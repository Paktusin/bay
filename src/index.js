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

var sea;

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload() {
    console.log('preload');
    game.load.image('sea', './assets/images/sea.png');
    game.load.image('ship_1', './assets/images/ship1.png');
    game.load.image('ship_2', './assets/images/ship2.png');
}

function create() {
    sea = game.add.tileSprite(0, 0, 800, 600, 'sea');

};

function update() {
    sea.tilePosition.y += 2;
}
