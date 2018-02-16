require('expose-loader?PIXI!phaser-ce/build/custom/pixi.js');
require('expose-loader?p2!phaser-ce/build/custom/p2.js');
//require('expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js');
var Phaser = window.Phaser = require("phaser-ce/build/custom/phaser-split");
var io = require('socket.io-client');
var Ship = require('./ship');
require('./actions');

var client = {};
var players = {};
var sea, cursors;

client.socket = io.connect('http://localhost:8081');

client.askNewPlayer = function (name) {
    client.socket.emit('newplayer', name);
};
client.socket.on('newplayer', function (data) {
    addNewPlayer(data);
});
client.socket.on('action', function (data) {
    updatePlayer(data);
});
client.socket.on('remove', function (id) {
    removePlayer(id);
});
client.action = function (action) {
    client.socket.emit('action', action);
};

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload() {
    game.load.image('sea', './assets/images/sea.png');
    game.load.spritesheet('ship_1', './assets/images/ship1.png', 32, 32);
}

function create() {
    sea = game.add.tileSprite(0, 0, 800, 600, 'sea');
    cursors = game.input.keyboard.createCursorKeys();
    client.askNewPlayer({name: 'Name' + Math.random()})
}

function update() {
    Object.keys(players).forEach(function (id) {
        players[id].action()
    });
    sea.tilePosition.y += .1;
    if (cursors.left.isDown) {
        client.move('left');
        ship
        ship.animations.play('left');
        ship.scale.setTo(1, 1);
        ship.body.velocity.x = -150;
    } else if (cursors.right.isDown) {
        client.action(ACTION_LEFT);
        ship.scale.setTo(-1, 1);
        ship.animations.play('left');
        ship.body.velocity.x = 150;
    } else if (cursors.up.isDown) {
        client.move('up');
        ship.animations.play('up');
        ship.body.velocity.y = -150;
    } else if (cursors.down.isDown) {
        client.move('down');
        ship.animations.play('down');
        ship.body.velocity.y = 150;
    }
}

function addNewPlayer(data) {
    players[data.id] = new Ship()
}

function updatePlayer(data) {

}

function removePlayer(id) {
    delete players[id];
}