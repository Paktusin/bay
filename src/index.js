/**
 * Import Phaser dependencies using `expose-loader`.
 * This makes then available globally and it's something required by Phaser.
 * The order matters since Phaser needs them available before it is imported.
 */

require('expose-loader?PIXI!phaser-ce/build/custom/pixi.js');
require('expose-loader?p2!phaser-ce/build/custom/p2.js');
require('expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js');

/**
 * Create a new Phaser game instance.
 * And render a single sprite so we make sure it works.
 */

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload() {
    console.log('preload');
    game.load.image('logo', './assets/images/sea.png');
}

function create() {
    console.log('create');
    var logo = game.add.sprite(0, 0, 'logo');
};

function update() {
    // ¯ \_(ツ)_/¯
    // "surprise me"
}
