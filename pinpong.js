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
			
        // Add mousemove and mousedown events to the canvas
        canvas.addEventListener("mousemove", trackPosition, true);
        canvas.addEventListener("mousedown", btnClick, true);

        // Initialise the collision sound
        collision = document.getElementById("collide");
		
        // Set the canvas's height and width to full screen
        canvas.width = W;
        canvas.height = H;