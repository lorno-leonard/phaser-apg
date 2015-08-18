apg.boot = function(game) {};
apg.boot.prototype = {

	init: function() {
		// Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
		this.input.maxPointers = 1;

		// Phaser will not automatically pause if the browser tab the game is in loses focus
		this.stage.disableVisibilityChange = true;

		// Scale the Game
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.parentIsWindow = true; // Set to true so that the canvas will be responsive
	},

	preload: function() {

		console.log('BOOT state loaded');
		
		// Load loading images
		this.load.image('preloader_background', 'assets/images/preloader_background.png');
		this.load.image('preloader_bar', 'assets/images/preloader_bar.png');
	},

	create: function() {

		// Start the 'preloader' state
		_.delay(function(game) {
			game.state.start('preloader');
		}, 1000, this);
	}
};