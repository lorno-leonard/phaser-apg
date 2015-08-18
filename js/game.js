"use strict";
var apg = {
	max_num_players: 4,
	max_num_players_thai: 6,
	positions: {
		button_set: { x: 680, y: 550 },
		button_return: { x: 30, y: 480 },
		button_sort_suit: { x: 30, y: 524 },
		button_sort_rank: { x: 30, y: 568 },
		caption: [
			{ x: 400, y: 448 },
			{ x: 160, y: 312 },
			{ x: 400, y: 222 },
			{ x: 640, y: 312 }
		],
		slot: [
			{
				0: { x: 367, y: 310 },
				1: { x: 400, y: 310 },
				2: { x: 433, y: 310 },
				3: { x: 334, y: 355 },
				4: { x: 367, y: 355 },
				5: { x: 400, y: 355 },
				6: { x: 433, y: 355 },
				7: { x: 466, y: 355 },
				8: { x: 334, y: 400 },
				9: { x: 367, y: 400 },
				10: { x: 400, y: 400 },
				11: { x: 433, y: 400 },
				12: { x: 466, y: 400 }
			},
			{
				0: { x: 127, y: 175 },
				1: { x: 160, y: 175 },
				2: { x: 193, y: 175 },
				3: { x: 94, y: 220 },
				4: { x: 127, y: 220 },
				5: { x: 160, y: 220 },
				6: { x: 193, y: 220 },
				7: { x: 226, y: 220 },
				8: { x: 94, y: 265 },
				9: { x: 127, y: 265 },
				10: { x: 160, y: 265 },
				11: { x: 193, y: 265 },
				12: { x: 226, y: 265 }
			},
			{
				0: { x: 367, y: 85 },
				1: { x: 400, y: 85 },
				2: { x: 433, y: 85 },
				3: { x: 334, y: 130 },
				4: { x: 367, y: 130 },
				5: { x: 400, y: 130 },
				6: { x: 433, y: 130 },
				7: { x: 466, y: 130 },
				8: { x: 334, y: 175 },
				9: { x: 367, y: 175 },
				10: { x: 400, y: 175 },
				11: { x: 433, y: 175 },
				12: { x: 466, y: 175 }
			},
			{
				0: { x: 607, y: 175 },
				1: { x: 640, y: 175 },
				2: { x: 673, y: 175 },
				3: { x: 574, y: 220 },
				4: { x: 607, y: 220 },
				5: { x: 640, y: 220 },
				6: { x: 673, y: 220 },
				7: { x: 706, y: 220 },
				8: { x: 574, y: 265 },
				9: { x: 607, y: 265 },
				10: { x: 640, y: 265 },
				11: { x: 673, y: 265 },
				12: { x: 706, y: 265 }
			}
		],
		card: { x: 80, y: 550 }
	},
	sizes: {
		card: { x: 30, y: 42 },
		button_set: { x: 208, y: 76 },
		button_sorter: { x: 39, y: 39 }
	},
	frames: {
		card: 55,
		button_set: 5,
		button_sorter: 9
	}
};
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
apg.table = function(game) {

	// Sprites
	this.background = null;
	this.button_set = null;
	this.button_return = null;
	this.button_sort_suit = null;
	this.button_sort_rank = null;

	// Collections
	this.buttons = [];
	this.cards = [];
	this.captions = [];
	
	this.card_names = [
		'2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', 'th', 'jh', 'qh', 'kh', 'ah',
		'2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', 'tc', 'jc', 'qc', 'kc', 'ac',
		'2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', 'td', 'jd', 'qd', 'kd', 'ad',
		'2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', 'ts', 'js', 'qs', 'ks', 'as',
		'bg', 'bf', 'sl'
	];

	// Groups
	this.group_sorters = null;
	this.group_positions = [];

	// Global Values
	this.positions = apg.positions;

	// Tween variable, to determine if there's a current tween being played
	this.tween = null;
};
apg.table.prototype = {

	preload: function() {

		console.log('TABLE state loaded');
	},

	create: function() {

		var game = this;

		// Initialize Background
		var background_size = {
			x: this.cache.getImage('bg_blue').width,
			y: this.cache.getImage('bg_blue').height
		};
		this.background = this.add.tileSprite(0, 0, background_size.x, background_size.y, 'bg_blue');

		// Initialize Groups
		this.group_sorters = this.add.group(this.world, 'group_sorters');
		_.times(apg.max_num_players, function(n) {
			game.group_positions.push(game.add.group());
		});

		// Initialize Buttons
		this.button_set = this.add.sprite(this.positions.button_set.x, this.positions.button_set.y, 'button_set', 0);
		this.button_set.animations.add('active', [0]);
		this.button_set.animations.add('inactive', [1]);
		this.button_set.animations.add('hover', [4]);
		this.button_set.animations.add('glow', [2, 3, 4]);
		this.buttons.push(this.button_set);

		this.button_return = this.add.sprite(this.positions.button_return.x, this.positions.button_return.y, 'button_sorter', 0);
		this.button_return.animations.add('active', [0]);
		this.button_return.animations.add('inactive', [1]);
		this.button_return.animations.add('hover', [2]);
		this.buttons.push(this.button_return);
		this.group_sorters.add(this.button_return); // Add to sorters group

		this.button_sort_suit = this.add.sprite(this.positions.button_sort_suit.x, this.positions.button_sort_suit.y, 'button_sorter', 3);
		this.button_sort_suit.animations.add('active', [3]);
		this.button_sort_suit.animations.add('inactive', [4]);
		this.button_sort_suit.animations.add('hover', [5]);
		this.buttons.push(this.button_sort_suit);
		this.group_sorters.add(this.button_sort_suit); // Add to sorters group

		this.button_sort_rank = this.add.sprite(this.positions.button_sort_rank.x, this.positions.button_sort_rank.y, 'button_sorter', 6);
		this.button_sort_rank.animations.add('active', [6]);
		this.button_sort_rank.animations.add('inactive', [7]);
		this.button_sort_rank.animations.add('hover', [8]);
		this.buttons.push(this.button_sort_rank);
		this.group_sorters.add(this.button_sort_rank); // Add to sorters group

		// Set common properties to buttons
		_.each(this.buttons, function(button) {
			button.anchor.setTo(0.5);
			button.inputEnabled = true;
			button.input.useHandCursor = true;
		});

		// Set Button Events
		this.button_set.events.onInputDown.add(function() {
			if(this.tween && this.tween.isRunning) {
				return;
			}

			this.tween = this.add.tween(this.button_set.scale)
			.to({
					x: 1.1,
					y: 1.1
				},
				100,
				Phaser.Easing.Exponential.Out,
				true
			)
			.yoyo(true);

			this.spawCards();
		}, this);
		this.button_set.events.onInputOver.add(function() { this.button_set.animations.play('hover'); }, this);
		this.button_set.events.onInputOut.add(function() { this.button_set.animations.play('active'); }, this);

		this.button_return.events.onInputOver.add(function() { this.button_return.animations.play('hover'); }, this);
		this.button_return.events.onInputOut.add(function() { this.button_return.animations.play('active'); }, this);
		this.button_return.events.onInputDown.add(function() { 
			_.each(this.cards, function(card, n) {
				_.delay(function(game, card) {
					var tween = game.add.tween(card)
								.to({
										alpha: 0
									},
									500,
									Phaser.Easing.Linear.None
								);
					tween.onComplete.add(function(card) {
						card.kill();
					});

					tween.start();
				}, 50 * (n + 1), game, card);
			});

			_.delay(function(game) {
				game.cards = [];
			}, 1000, this)
		}, this);

		this.button_sort_suit.events.onInputOver.add(function() { this.button_sort_suit.animations.play('hover'); }, this);
		this.button_sort_suit.events.onInputOut.add(function() { this.button_sort_suit.animations.play('active'); }, this);

		this.button_sort_rank.events.onInputOver.add(function() { this.button_sort_rank.animations.play('hover'); }, this);
		this.button_sort_rank.events.onInputOut.add(function() { this.button_sort_rank.animations.play('active'); }, this);
		
		// // Set Captions
		// var captions = [];
		// var caption_size = {
		// 	x: this.cache.getImage('caption').width,
		// 	y: this.cache.getImage('caption').height
		// };
		// captions.push(this.add.tileSprite(400, 448, caption_size.x, caption_size.y, 'caption'));
		// captions.push(this.add.tileSprite(160, 312, caption_size.x, caption_size.y, 'caption'));
		// captions.push(this.add.tileSprite(400, 222, caption_size.x, caption_size.y, 'caption'));
		// captions.push(this.add.tileSprite(640, 312, caption_size.x, caption_size.y, 'caption'));
		
		// _.each(captions, function(caption) {
		// 	caption.anchor.setTo(0.5);
		// });

		// // Set Cards
		// var cards = [];

		// // SOUTH - Top
		// cards.push(this.add.sprite(367, 310, 'card'));
		// cards.push(this.add.sprite(400, 310, 'card'));
		// cards.push(this.add.sprite(433, 310, 'card'));

		// // SOUTH - Middle
		// cards.push(this.add.sprite(334, 355, 'card'));
		// cards.push(this.add.sprite(367, 355, 'card'));
		// cards.push(this.add.sprite(400, 355, 'card'));
		// cards.push(this.add.sprite(433, 355, 'card'));
		// cards.push(this.add.sprite(466, 355, 'card'));

		// // SOUTH - Bottom
		// cards.push(this.add.sprite(334, 400, 'card'));
		// cards.push(this.add.sprite(367, 400, 'card'));
		// cards.push(this.add.sprite(400, 400, 'card'));
		// cards.push(this.add.sprite(433, 400, 'card'));
		// cards.push(this.add.sprite(466, 400, 'card'));

		// // WEST - Top
		// cards.push(this.add.sprite(127, 175, 'card'));
		// cards.push(this.add.sprite(160, 175, 'card'));
		// cards.push(this.add.sprite(193, 175, 'card'));

		// // WEST - Middle
		// cards.push(this.add.sprite(94, 220, 'card'));
		// cards.push(this.add.sprite(127, 220, 'card'));
		// cards.push(this.add.sprite(160, 220, 'card'));
		// cards.push(this.add.sprite(193, 220, 'card'));
		// cards.push(this.add.sprite(226, 220, 'card'));

		// // WEST - Bottom
		// cards.push(this.add.sprite(94, 265, 'card'));
		// cards.push(this.add.sprite(127, 265, 'card'));
		// cards.push(this.add.sprite(160, 265, 'card'));
		// cards.push(this.add.sprite(193, 265, 'card'));
		// cards.push(this.add.sprite(226, 265, 'card'));

		// // NORTH - Top
		// cards.push(this.add.sprite(367, 85, 'card'));
		// cards.push(this.add.sprite(400, 85, 'card'));
		// cards.push(this.add.sprite(433, 85, 'card'));

		// // NORTH - Middle
		// cards.push(this.add.sprite(334, 130, 'card'));
		// cards.push(this.add.sprite(367, 130, 'card'));
		// cards.push(this.add.sprite(400, 130, 'card'));
		// cards.push(this.add.sprite(433, 130, 'card'));
		// cards.push(this.add.sprite(466, 130, 'card'));

		// // NORTH - Bottom
		// cards.push(this.add.sprite(334, 175, 'card'));
		// cards.push(this.add.sprite(367, 175, 'card'));
		// cards.push(this.add.sprite(400, 175, 'card'));
		// cards.push(this.add.sprite(433, 175, 'card'));
		// cards.push(this.add.sprite(466, 175, 'card'));

		// // EAST - Top
		// cards.push(this.add.sprite(607, 175, 'card'));
		// cards.push(this.add.sprite(640, 175, 'card'));
		// cards.push(this.add.sprite(673, 175, 'card'));

		// // EAST - Middle
		// cards.push(this.add.sprite(574, 220, 'card'));
		// cards.push(this.add.sprite(607, 220, 'card'));
		// cards.push(this.add.sprite(640, 220, 'card'));
		// cards.push(this.add.sprite(673, 220, 'card'));
		// cards.push(this.add.sprite(706, 220, 'card'));

		// // EAST - Bottom
		// cards.push(this.add.sprite(574, 265, 'card'));
		// cards.push(this.add.sprite(607, 265, 'card'));
		// cards.push(this.add.sprite(640, 265, 'card'));
		// cards.push(this.add.sprite(673, 265, 'card'));
		// cards.push(this.add.sprite(706, 265, 'card'));

		// _.each(cards, function(card) {
		// 	card.anchor.setTo(0.5);
		// });
	},

	spawCards: function() {

		var game = this;

		_.times(10, function(n) {
			_.delay(function() {
				game.addCard(game.card_names[_.random(0, 53)]);
			}, 200 * (n + 1));
		});
	},

	addCard: function(hand) {

		if(this.cards.length >= 10) {
			return;
		}

		// Initialize Position
		var pos = {
			x: this.positions.card.x + (this.cards.length * 35),
			y: this.positions.card.y
		}

		// Create Card
		var card = this.add.sprite(800, pos.y, 'card');
		card.anchor.setTo(0.5);

		// Add Animations to Card
		_.each(this.card_names, function(value, key) {
			card.animations.add(value, [key]);
		});

		// Set Card hand
		var hand = this.card_names[_.random(0, 51)];
		card.animations.play(hand);
		card.hand = hand;

		// Set Card events
		card.originX = pos.x;
		card.originY = pos.y;
		card.inputEnabled = true;
		card.input.enableDrag(false);
		card.input.useHandCursor = true;
		card.events.onDragStop.add(this.cardDragStop, this);

		// Add Card to the cards collection
		this.cards.push(card);

		// Move Card from Right edge to assigned position
		this.add.tween(card)
		.to({
				x: pos.x,
				y: pos.y
			},
			500,
			Phaser.Easing.Elastic.Out,
			true
		);
	},

	cardDragStop: function(card) {
		console.log(card.hand);

		// Move Card back to its original position
		this.add.tween(card)
			.to({
				x: card.originX,
				y: card.originY
			},
			200,
			Phaser.Easing.Back.Out,
			true
		);
	}
}
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