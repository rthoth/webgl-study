;(function (window) {

	course.l02 = {};

	var getShader = course.l02.getShader = function (glContext, scriptId) {
		var script = document.getElementById(scriptId);
		if (!script)
			throw new Error("No script " + scriptId);


		var scriptSource = "";
		for (var current = script.firstChild; current; current = current.nextSibiling) {
			if (current.nodeType === current.TEXT_NODE)
				scriptSource += current.textContent;
		}

		var shader;
		switch (script.type) {
			case "x-shader/x-fragment":
				shader = glContext.createShader(glContext.FRAGMENT_SHADER);
				break;
			case "x-shader/x-vertex":
				shader = glContext.createShader(glContext.VERTEX_SHADER);
				break;
			default:
				throw new Error("Tipo de shader desconhecido" + script.type);
		}

		glContext.shaderSource(shader, scriptSource);

		glContext.compileShader(shader);

		//Agora vou checar a compilação do shader...
		if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS))
			throw new Error("Ocorreu um erro na compilação do shader " + scriptId + ": " + glContext.getShaderInfoLog(shader));

		return shader;
	};


	//Inicializa os shaders....
	var initShaders = function (parameters) {
		var glContext = parameters.glContext;
		var shaders = parameters.shaders;
		var vertexAttributes = parameters.vertexAttributes;

		// Aqui estamos criando um Shader Program, seja lá o que for isso...
		var shaderProgram = glContext.createProgram();
		shaders = shaders || [];
		shaders.forEach(function(shader){
			// Adicionando os shaders
			glContext.attachShader(shaderProgram, shader);
		});

		glContext.linkProgram(shaderProgram);
		if (!glContext.getProgramParameter(shaderProgram, glContext.LINK_STATUS))
			throw new Error("Problema para iniciar o shaderProgram");

		glContext.useProgram(shaderProgram);

		var vertexAtts = [];
		if (vertexAttributes)
			vertexAttributes.forEach(function(attribute){

				var vertexAttribute = glContext.getAttributeLocation(shaderProgram, attribute);
				vertexAtts.push(vertexAttribute);
				glContext.enableVertexAttribArray(vertexAttribute);

			});

		return {
			shaderProgram: shaderProgram,
			vertexAttributes: vertexAtts
		}
	};


	var createBuffer = function (glContext, parameters) {

		var verticesBuffer = glContext.createBuffer();
		var vertices = parameters.vertices;

		glContext.bindBuffer(glContext.ARRAY_BUFFER, verticesBuffer);

		glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW);

		return verticesBuffer;
	};


	var drawScene = function (glContext, parameters) {

		var vertices = parameters.vertices;
		var shaderProgram = parameters.shaderProgram;

		var vertexPositionAttribute = parameters.vertexPositionAttribute;

		glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

		var perspectiveMatrix = makePerspective(20, 640/480, 0.1, 100);

		// Esse Matrix é da API Sylvester....
		var identity = Matrix.I(4);


		var translated = mvTranslate(identity, [0, 0, -6.0]);

		glContext.bindBuffer(glContext.ARRAY_BUFFER, vertices);

		if (vertexPositionAttribute)
			glContext.vertexAttribPointer(vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

		setMatrixUniform(glContext, {
			shaderProgram: shaderProgram,
			shaderMatrix: "uPMatrix",
			localMatrix: perspectiveMatrix
		});

		setMatrixUniform(glContext, {
			shaderProgram: shaderProgram,
			shaderMatrix: "uMVMatri",
			localMatrix: translated
		});

		glContext.drawArrays(glContext.TRIANGULE_STRIP, 0, 4);
	};

	var setMatrixUniform = function (glContext, parameters) {
		var shaderProgram = parameters.shaderProgram;
		var shaderMatrix = parameters.shaderMatrix;
		var localMatrix =parameters.localMatrix;

		var uniform = glContext.getUniformLocation(shaderProgram, shaderMatrix);
		glContext.uniformMatrix4fv(uniform, false, new Float32Array(localMatrix.flatten()));
	};

	var mvTranslate = function (matrix, v) {
		var translateMatrix = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
		return matrix.x(translateMatrix);
	}

	course.l02.setMatrixUniform = setMatrixUniform;
	course.l02.mvTranslate = mvTranslate;
	course.l02.drawScene = drawScene;
	course.l02.createBuffer = createBuffer;
	course.l02.initShaders = initShaders;
	course.l02.getShader = getShader;


	var makePerspective =  function (fovy, aspect, znear, zfar) {
		var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
		var ymin = -ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
	};


	var makeFrustum = function(left, right, bottom, top, znear, zfar) {
	    var X = 2*znear/(right-left);
	    var Y = 2*znear/(top-bottom);
	    var A = (right+left)/(right-left);
	    var B = (top+bottom)/(top-bottom);
	    var C = -(zfar+znear)/(zfar-znear);
	    var D = -2*zfar*znear/(zfar-znear);

	    return $M([[X, 0, A, 0],
	               [0, Y, B, 0],
	               [0, 0, C, D],
	               [0, 0, -1, 0]]);
	};

	Matrix.Translation = function (v) {
		if (v.elements.length == 2) {
			var r = Matrix.I(3);
			r.elements[2][0] = v.elements[0];
			r.elements[2][1] = v.elements[1];
			return r;
		}

		if (v.elements.length == 3) {
			var r = Matrix.I(4);
			r.elements[0][3] = v.elements[0];
			r.elements[1][3] = v.elements[1];
			r.elements[2][3] = v.elements[2];
			return r;
		}

		throw "Invalid length for Translation";
	};


	Matrix.prototype.flatten = function ()
{
    var result = [];
    if (this.elements.length == 0)
        return [];


    for (var j = 0; j < this.elements[0].length; j++)
        for (var i = 0; i < this.elements.length; i++)
            result.push(this.elements[i][j]);
    return result;
}

Matrix.prototype.ensure4x4 = function()
{
    if (this.elements.length == 4 &&
        this.elements[0].length == 4)
        return this;

    if (this.elements.length > 4 ||
        this.elements[0].length > 4)
        return null;

    for (var i = 0; i < this.elements.length; i++) {
        for (var j = this.elements[i].length; j < 4; j++) {
            if (i == j)
                this.elements[i].push(1);
            else
                this.elements[i].push(0);
        }
    }

    for (var i = this.elements.length; i < 4; i++) {
        if (i == 0)
            this.elements.push([1, 0, 0, 0]);
        else if (i == 1)
            this.elements.push([0, 1, 0, 0]);
        else if (i == 2)
            this.elements.push([0, 0, 1, 0]);
        else if (i == 3)
            this.elements.push([0, 0, 0, 1]);
    }

    return this;
};

Matrix.prototype.make3x3 = function()
{
    if (this.elements.length != 4 ||
        this.elements[0].length != 4)
        return null;

    return Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]],
                          [this.elements[1][0], this.elements[1][1], this.elements[1][2]],
                          [this.elements[2][0], this.elements[2][1], this.elements[2][2]]]);
};

Vector.prototype.flatten = function ()
{
    return this.elements;
};



})(window);