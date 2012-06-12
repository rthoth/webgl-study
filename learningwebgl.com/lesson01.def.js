/**
	Nesse arquivo coloco as coisas que serão definidas na lição 01
*/



/**
	
	@description

	@provides []

	@requires []

*/
;(function (exports) {
	
	var webgl = exports.webgl = {};
	webgl.lesson = {};

	var initGL = function (canvas) {

		var context = canvas.getContext("webgl");
		if (!context)
			context = canvas.getContext("experimental-webgl");


		if (!context)
			throw new Error("No Webgl Context");

		context.viewportWidth = canvas.offsetWidth;
		context.viewportHeight = canvas.offsetHeight;

		context.clearColor(0, 0, 0, 1);
		context.enable(context.DEPTH_TEST);

		
		return context;
	};

	var start = function (canvasId) {
		var canvas = document.getElementById(canvasId);
		if (!canvas)
			throw new Error("No canvasID" + canvasId);

		return initGL(canvas);
	};


	/**
		Aqui criamos um buffer para os vértices passados como argumento!
	*/
	var createBuffer = function (glContext, vertices) {
		var buffer = glContext.createBuffer();

		glContext.bindBuffer(glContext.ARRAY_BUFFER, buffer);
		glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW);

		buffer.$numItems = vertices.numItems;
		buffer.$itemSize = vertices.itemSize;
		buffer.$vertices = vertices;

		return buffer;
	};


	var drawScene = function (gl, params) {
		var objects = params.objects || {};

		// Será explicado, só diz que é importante...
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100, gl.uPMatrix);

		mat4.identity(gl.uMVMatrix);

		for (var objectName in objects) {

			objects[objectName].mvMatrix =  gl.uMVMatrix;
			objects[objectName].shaderProgram = params.shaderProgram;

			drawObject(gl, objectName, objects[objectName]);
		}

	};


	var drawObject = function (gl, name, params) {
		console.log("Drawing " + name);

		var translation = params.translation;
		var shaderProgram = params.shaderProgram;
		var vertexAttribute = params.vertexAttribute;
		var mvMatrix = params.mvMatrix;
		var mode = params.mode;

		// Tentarei fechar o contexto de um objeto...

		if (translation)
			//[x, y, z]
			mat4.translate(mvMatrix, translation);

		gl.bindBuffer(gl.ARRAY_BUFFER, params.buffer);

		// TODO: Acertar o attributo (vertexPositionAttribute)
		gl.vertexAttribPointer(shaderProgram.attributes[vertexAttribute], params.buffer.$itemSize, gl.FLOAT, false, 0, 0);


		setMatrixUniforms(gl, shaderProgram);

		gl.drawArrays(mode, 0, params.buffer.$numItems);
		console.log(gl.getError());


	};



	var createShader = function (gl, scriptId) {
		var script = document.getElementById(scriptId);

		if (!script)
			throw new Error("No script " + scriptId);

		var source = "";
		for (var el = script.firstChild; el; el = el.nextSibling) {
			if (el.nodeType === 3) //TEXT Node....
				source += el.textContent;
		}

		var shader;
		switch (script.type) {
			case 'x-shader/x-fragment':
				shader = gl.createShader(gl.FRAGMENT_SHADER);
				break;
			case 'x-shader/x-vertex':
				shader = gl.createShader(gl.VERTEX_SHADER);
				break;
			default:
				throw new Error("Is it a shader? " + scriptId + ".type = " + script.type);
		}

		gl.shaderSource(shader, source);
		gl.compileShader(shader);


		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
			throw new Error("Shader compile error " + scriptId + ": " + gl.getShaderInfoLog(shader));

		return shader;
	};



	var createShaderProgram = function (gl, params) {
		var scriptIds = params.scriptIds;
		var shaders = [];

		if (scriptIds)
			scriptIds.forEach(function(scriptId){
				shaders.push(createShader(gl, scriptId));
			});

		if (!shaders.length)
			throw new Error("No Shaders!");

		var program = gl.createProgram();
		shaders.forEach(function(shader){
			gl.attachShader(program, shader);
		});

		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS))
			throw new Error("Shader Program Link Error: " + gl.getProgramInfoLog(program));

		gl.useProgram(program);

		program.attributes = {};

		if (params.attributes)

			params.attributes.forEach(function (attribName) {
				program.attributes[attribName] = gl.getAttribLocation(program, attribName);
				gl.enableVertexAttribArray(program.attributes[attribName]);
			});

		program.uniforms = {};
		if (params.uniforms)

			params.uniforms.forEach(function (uniformName){
				program.uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
			});


		return program;

	};

	var setMatrixUniforms = function (gl, program) {
		if (program && program.uniforms)
			for (var uniformName in program.uniforms) {
				gl.uniformMatrix4fv(program.uniforms[uniformName], false, gl[uniformName]);
			};
	};


	//Exportando as coisas....
	webgl.start = start;
	webgl.initGL = initGL;
	webgl.createBuffer = createBuffer;
	webgl.drawScene = drawScene;
	webgl.drawObject = drawObject;
	webgl.createShader = createShader;
	webgl.createShaderProgram = createShaderProgram;

})(window);