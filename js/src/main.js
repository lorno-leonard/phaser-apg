window.addEventListener('DOMContentLoaded', function() {

	// Initialize Game
	var game = new Phaser.Game(800, 600, Phaser.AUTO, 'body');

	// Add Game States
	game.state.add('boot', apg.boot);
	game.state.add('preloader', apg.preloader);
	game.state.add('table', apg.table);
	game.state.add('test', apg.test);

	// Start with the 'boot' state
	game.state.start('boot');
}, false);