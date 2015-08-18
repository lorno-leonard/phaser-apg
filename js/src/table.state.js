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