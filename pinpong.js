window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
		  window.webkitRequestAnimationFrame || 
		  window.mozRequestAnimationFrame    || 
		  window.oRequestAnimationFrame      || 
		  window.msRequestAnimationFrame     ||  
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

        window.cancelRequestAnimFrame = (function() {
            return window.cancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                clearTimeout
        })();
		
		// Initialize canvas and required variables
        var canvas = document.getElementById("canvas"),
            ctx = canvas.getContext("2d"), // Create canvas context
            W = window.innerWidth, // Window's width
			H = window.innerHeight, // Window's height
            particles = [], // Array containing particles
            ball = {}, // Ball object
			paddles = [2], // Array containing two paddles
            mouse = {}, // Mouse object to store it's current position
            points = 0, // Varialbe to store points
			fps = 60, // Max FPS (frames per second)
            particlesCount = 20, // Number of sparks when ball strikes the paddle
            flag = 0, // Flag variable which is changed on collision