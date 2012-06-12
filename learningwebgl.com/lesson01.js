/**
	Nesse arquivo coloco as coisas que são efetivamente a lição 01
*/

/**
	
	@description

	@provides []

	@requires []

*/
;(function (exports) {
	// TODO: 

	var trianguleVertexPositionBuffer; //Pelo que diz aqui teremos o triângulo!
	var squareVertexPositionBuffer; //Os vértices do quadrado!



	window.onload = function(){
		var glContext = webgl.start("lesson01");


		var vertices = [
			 0,  1, 0,
			-1, -1, 0,
			 1, -1, 0
		];

		vertices.itemSize = 3;
		vertices.numItems = 3;
		
		trianguleVertexPositionBuffer = webgl.createBuffer(glContext, vertices);

		//Acho que isso é pegadinha do cara...
		vertices = [
			 1,  1, 0,
			-1,  1, 0,
			 1, -1, 0,
			-1, -1, 0
		];

		vertices.numItems = 4;
		vertices.itemSize = 3;

		squareVertexPositionBuffer = webgl.createBuffer(glContext, vertices);

		glContext.uMVMatrix = mat4.create();
		glContext.uPMatrix = mat4.create();

		var program = webgl.createShaderProgram(glContext, {
			scriptIds: ["x-fragment", "x-vertex"],
			attributes: ['aVertexPosition'],
			uniforms:['uMVMatrix', 'uPMatrix']
		});

		webgl.drawScene(glContext, {
			shaderProgram: program,
			objects:{
				triangule: {
					translation: [-1.5, 0, -7],
					buffer: trianguleVertexPositionBuffer,
					vertexAttribute: 'aVertexPosition',
					mode: glContext.TRIANGLES
				},
				square: {
					translation: [3, 0, 0],
					buffer: squareVertexPositionBuffer,
					vertexAttribute: 'aVertexPosition',
					mode: glContext.TRIANGLE_STRIP
				}
			}
		});
	};

})(window);