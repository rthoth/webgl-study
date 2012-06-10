;(function  (window) {

	course.lessons[2] = function () {
		var gl = course.gl[0];
		var fragmentShader = course.l02.getShader(gl, "fragment-shader");
		var vertexShader = course.l02.getShader(gl, "vertex-shader");

		var response = course.l02.initShaders({
			glContext: gl,
			shaders: [fragmentShader, vertexShader]
		});

		var vertices = [
			1.0,  1.0,  0.0,
			-1.0, 1.0,  0.0,
			1.0,  -1.0, 0.0,
			-1.0, -1.0, 0.0
  	];

		var buffers = course.l02.createBuffer(gl, {
			vertices: vertices	
		});


		setInterval((function(){
			return function () {
				course.l02.drawScene(gl, {
					vertices: buffers,
					shaderProgram: response.shaderProgram,
					vertexPositionAttribute: response.vertexAttributes[0]
				});
			};
		})(), 15);
		
	};
	
})(window);