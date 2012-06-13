/**
	
	@description

	@provides []

	@requires []

*/
;(function (window) {
	// TODO: 

	var DefaultError = Error;

	Error = function (message) {
		var result = new DefaultError(message);
		alert("Error: " + message);
		return result;
	};

	var webgl = window.webgl = {};

	var prepareContext = function (canvas) {
		if (!canvas || !canvas.getContext)
			throw new Error("Canvas not be null and has getContext method!");

		var context = canvas.getContext("webgl");
		if (!context)
			context = canvas.getContext("experimental-webgl");

		if (!context)
			throw new Error("No WebGl Context for you! I'm sorry ;-)");

		context.viewportWith = canvas.offsetWidth;
		context.viewportHeight = canvas.offsetHeight;
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;

		context.clearColor(0.0, 0.0, 0.0, 1.0);
		context.enable(context.DEPTH_TEST);

		return context;
	};

	var createShaderObject = function (gl, scriptId) {
		var script = document.getElementById(scriptId);

		var source = "";
		for (var e = script.firstChild; e; e = e.nextSibling) {
			if (e.nodeType === 3)
				source = e.textContent;
		}

		var shaderObject;

		switch (script.type) {
			case 'x-shader/x-fragment':
				shaderObject = gl.createShader(gl.FRAGMENT_SHADER);
				break;
			case 'x-shader/x-vertex':
				shaderObject = gl.createShader(gl.VERTEX_SHADER);
				break;
			default:
				throw new Error("Unsupported shaderType: " + script.type);
		}

		gl.shaderSource(shaderObject, source);
		gl.compileShader(shaderObject);

		if (!gl.getShaderParameter(shaderObject, gl.COMPILE_STATUS))
			throw new Error("Shader Compilation Error - " + gl.getShaderInfoLog(shaderObject));

		return shaderObject;
	};


	var createShaderProgram = function (gl, params) {
		
		var shaders = params.shaders || [];
		var shadersObjects = [];

		shaders.forEach(function(shader){
			var shaderObject = createShaderObject(gl, shader);
			shadersObjects.push(shaderObject);
		});

		var program = gl.createProgram();
		shadersObjects.forEach(function(shaderObject){
			gl.attachShader(program, shaderObject);
		});
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS))
			throw new Error("Program Shader Link Error - " + gl.getProgramInfoLog(program));

		gl.useProgram(program);

		program.attribIndex = {};

		if (params.attribIndex)
			params.attribIndex.forEach(function (attrib) {

				program.attribIndex[attrib] = gl.getAttribLocation(program, attrib);
				gl.enableVertexAttribArray(program.attribIndex[attrib]);

			});

		program.uniforms = {};
		program.matrix = {};
		if (params.uniforms)
			params.uniforms.forEach(function (uniform) {
				program.uniforms[uniform] = gl.getUniformLocation(program, uniform);
				program.matrix[uniform] = mat4.create();
			});

		return program;
	};


	var createBuffer = function (gl, params) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

		var vertices = params.vertices;

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		return buffer;
	};

	var updateUniforms = function (gl, program) {
		for (var m in program.matrix) {
			gl.uniformMatrix4fv(program.uniforms[m], false, program.matrix[m]);
		}
	};

	var drawObject = function (object, gl, program) {
		if (object.translation)
			mat4.translate(program.matrix.uMVMatrix, object.translation);

		gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
		gl.vertexAttribPointer(program.attribIndex.aVertexPosition, object.itemSize, gl.FLOAT, false, 0, 0);
		
		updateUniforms(gl, program);

		gl.drawArrays(object.mode, 0, object.numItems);
	};


	var drawScene = function (gl, params) {
		var objects = params.objects || [];
		var program = params.program;

		gl.viewport(0, 0, gl.viewportWith, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		//Perspectiva....
		mat4.perspective(45, gl.viewportWith / gl.viewportHeight, 0.1, 100, program.matrix.uPMatrix);

		//Acerta a matriz de translação...
		mat4.identity(program.matrix.uMVMatrix);

		objects.forEach(function(object){
			drawObject(object, gl, program);
		});
	};


	// Exporting....

	webgl.prepareContext = prepareContext;
	webgl.createShaderProgram = createShaderProgram;
	webgl.createBuffer = createBuffer;
	webgl.drawScene = drawScene;

})(window);