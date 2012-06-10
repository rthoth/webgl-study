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
		
		trianguleVertexPositionBuffer = webgl.createBuffer(glContext, vertices);

		//Acho que isso é pegadinha do cara...
		vertices = [
			 1,  1, 0,
			-1,  1, 0,
			 1, -1, 0,
			-1, -1, 0
		];

		vertices.itemSize = 4;

		squareVertexPositionBuffer = webgl.createBuffer(glContext, vertices);

		webgl.drawScene({
			gl: glContext
		});
	};

})(window);