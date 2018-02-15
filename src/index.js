/**
 * Import Phaser dependencies using `expose-loader`.
 * This makes then available globally and it's something required by Phaser.
 * The order matters since Phaser needs them available before it is imported.
 */

require('expose-loader?PIXI!phaser-ce/build/custom/pixi.js');
require('expose-loader?p2!phaser-ce/build/custom/p2.js');
//require('expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js');
var Phaser = window.Phaser = require("phaser-ce/build/custom/phaser-split");

/**
 * Create a new Phaser game instance.
 * And render a single sprite so we make sure it works.
 */

var sea, ship, cursors;

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload() {
    game.load.image('sea', './assets/images/sea.png');
    game.load.spritesheet('ship_1', './assets/images/ship1.png', 32, 32);
    game.load.spritesheet('ship_2', './assets/images/ship2.png', 32, 32);
}

function create() {
    sea = game.add.tileSprite(0, 0, 800, 600, 'sea');
    ship = game.add.sprite(game.world.width / 2 - 32, game.world.height / 2 - 32, 'ship_1');
    ship.animations.add('left', [4, 5, 6, 7], 10);
    ship.animations.add('down', [8, 9, 10, 11], 10);
    ship.animations.add('up', [12, 13, 14, 15], 10);
    ship.anchor.set(.5, .5);
    game.physics.arcade.enable(ship);
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    sea.tilePosition.y += 2;
    ship.body.velocity.x = 0;
    ship.body.velocity.y = 0;
    if (cursors.left.isDown) {
        ship.animations.play('left');
        ship.scale.setTo(1, 1);
        ship.body.velocity.x = -150;
    } else if (cursors.right.isDown) {
        ship.scale.setTo(-1, 1);
        ship.animations.play('left');
        ship.body.velocity.x = 150;
    } else if (cursors.up.isDown) {
        ship.animations.play('up');
        ship.body.velocity.y = -150;
    } else if (cursors.down.isDown) {
        ship.animations.play('down');
        ship.body.velocity.y = 150;
    }
}
