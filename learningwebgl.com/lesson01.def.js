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

		buffer.$numItems = vertices.length;
		buffer.$itemSize = vertices.itemSize;
		buffer.$vertices = vertices;

		return buffer;
	};


	var drawScene = function (params) {
		var gl = params.gl;
		var objects = params.objects || {};

		// Será explicado, só diz que é importante...
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		var pMatrix = mat4.create();

		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100, pMatrix);

		//mat4.identity(mvMatrix);

		for (var objectName in objects) {
			drawObject(gl, objectName, objects[objectName]);
		}

	};


	var drawObject = function (gl, name, params) {
		console.log("Drawing " + name);

		var translation = params.translation;
		var shaderProgram = params.shaderProgram;

		// Tentarei fechar o contexto de um objeto...
		var mvMatrix = mat4.identity();

		if (translation)
			//[x, y, z]
			mat4.translate(mvMatrix, translation);

		gl.bindBuffer(gl.ARRAY_BUFFER, params.buffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, params.buffer.$itemSize, gl.FLOAT, false, 0, 0);

		setMatrixUniforms();

		gl.drawArrays(gl.TRIANGULES, 0, params.buffer, params.buffer.numItems);
	};



	var getShader = function (gl, scriptId) {
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


	//Exportando as coisas....
	webgl.start = start;
	webgl.initGL = initGL;
	webgl.createBuffer = createBuffer;
	webgl.drawScene = drawScene;
	webgl.drawObject = drawObject;

})(window);