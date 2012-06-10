;(function(window){

	var course = window.course = {};

	course.l01 = {};
	course.gl = {};
	course.lessons = {};
	course.utils = {};

	var start = function() {
		var canvas;
 		canvas = document.getElementById("glCanvas");
		course.gl[0] = createWebGLContext(canvas);
		for (var i=1; i<=20; i++) {
			canvas = document.getElementById("glCanvas" + i);
			if (canvas)
				course.gl[i] = createWebGLContext(canvas);

		}
		for (var i in course.lessons) {
			try {
				if (course.lessons[i])
					course.lessons[i]();
			} catch (e) {
				alert("Problems in Lesson " + i + "\n" + e);
				window.errors = window.errors || {};
				window.errors[i] = e;
				throw e;
			}
		}

	};

	var createWebGLContext = course.l01.createWebGLContext = function (canvas) {
		var gl;
		try {
			gl = canvas.getContext("3d") || canvas.getContext("experimental-webgl");
		} catch (e) {
			alert(e);
			throw e;				
		}

		if (!gl) {
			alert("Ops! Se webgl para você!");
			throw new Error("No WebGL!");
		} else
			prepare(gl);

		return gl;
	};

	var prepare = function (gl) {
		gl.clearColor(0, 0, 0, 1);	//Define a cor de fundo, preto com fundo opaco!
		gl.enable(gl.DEPTH_TEST);		//Pelo que entendi ativa teste de profundidade (distância da câmera?)
		gl.depthFunc(gl.LEQUAL);		// Coisas próximas vão obscurecer coisas distantes....uhummm.....
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);		//limpa a cena com usando o tal do depth buffer
	};

	window.onload = start;

})(window);