/**
	
	@description

	@provides []

	@requires []

*/
;(function (exports) {
	// TODO: 

	window.onload = function () {
		var gl = webgl.prepareContext(document.getElementById("lesson01"));


		var shaderProgram = webgl.createShaderProgram(gl, {
			shaders: ['x-fragment', 'x-vertex'],
			attribIndex: ['aVertexPosition'],
			uniforms: ['uMVMatrix', 'uPMatrix']
		});

		var triangleBuffer = webgl.createBuffer(gl, {
			vertices: [
				 0,  1, 0,
				-1, -1, 0,
				 1, -1, 0
			]
		});

		var squareBuffer = webgl.createBuffer(gl, {
			vertices: [
				 1,  1, 0,
				-1,  1, 0,
				 1, -1, 0,
				-1, -1, 0
			]
		});

		var objects = [
			{
				buffer: triangleBuffer,
				numItems: 3,
				itemSize: 3,
				mode: gl.TRIANGLES,
				translation: [-1.5, 0, -7]
			},
			{
				buffer: squareBuffer,
				numItems: 4,
				itemSize: 3,
				mode: gl.TRIANGLE_STRIP,
				translation: [3, 0, 0]
			}
		];

		setInterval(function(){
			objects[0].translation[2] = -7 - Math.random() * 3;
			objects[1].translation[2] = -5 - Math.random() * 4;
			webgl.drawScene(gl, {
				program: shaderProgram,
				objects: objects
			});
		}, 100)


	};

})(window);