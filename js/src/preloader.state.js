apg.preloader = function(game) {

	this.sizes = apg.sizes;
	this.frames = apg.frames;
	this.background = null;
	this.preload_bar = null;
};
apg.preloader.prototype = {

	preload: function() {

		console.log('PRELOADER state loaded');

		//	Assets loaded on 'boot' state for the loading progress bar
		this.background = this.add.sprite(this.world.centerX, this.world.centerY, 'preloader_background');
		this.preload_bar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloader_bar');

		// Anchor loading progress bar sprites to center
		this.background.anchor.setTo(0.5);
		this.preload_bar.anchor.setTo(0.5);

		// Set the preload bar sprite
		this.load.setPreloadSprite(this.preload_bar);

		// Load other assets
		this.load.image('bg_blue', 'assets/images/bg_blue.jpg');
		this.load.image('bg_red', 'assets/images/bg_red.jpg');
		this.load.image('caption', 'assets/images/caption.png');
		this.load.spritesheet('card', 'assets/images/cards.png', this.sizes.card.x, this.sizes.card.y, this.frames.card);
		this.load.spritesheet('button_set', 'assets/images/button_set.png', this.sizes.button_set.x, this.sizes.button_set.y, this.frames.button_set);
		this.load.spritesheet('button_sorter', 'assets/images/button_sorter.png', this.sizes.button_sorter.x, this.sizes.button_sorter.y, this.frames.button_sorter);
	},

	create: function() {

		// Start the 'table' state
		this.preload_bar.cropEnabled = false;
		this.state.start('table');
	}
};