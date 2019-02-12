require('expose-loader?PIXI!phaser-ce/build/custom/pixi.js');
require('expose-loader?p2!phaser-ce/build/custom/p2.js');
//require('expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js');

var actions = require('../../common/actions');
var settings = require('../../common/settings');

var Phaser = window.Phaser = require("phaser-ce/build/custom/phaser-split");

var io = require('socket.io-client');
var Player = require('./player');

var client = {};
var players = {};
var sea, cursors;
var my_player;

client.socket = io.connect(process.env.production ? 'https://paktusin.ddns.net:/' : 'http://localhost:8080');
if (!process.env.production) {
    console.log('dev mode')
}

var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});


client.askNewPlayer = function (name) {
    client.socket.emit('newplayer', name);
};
client.socket.on('newplayer', function (data) {
    addNewPlayer(data);
});
client.socket.on('myplayer', function (id) {
    my_player = id;
    game.camera.follow(players[my_player].sprite);
});
client.socket.on('allplayers', function (data) {
    data.forEach(function (player_data) {
        players[player_data.id] = new Player(player_data, game)
    });
});
client.socket.on('remove', function (id) {
    removePlayer(id);
});
client.socket.on('action', function (data) {
    actionPlayer(data);
});
client.action = function (player) {
    client.socket.emit('update', player);
};


function preload() {
    game.load.image('sea', './assets/images/sea.png');
    for (var i = 0; i < 6; i++) {
        game.load.spritesheet('ship_' + (i + 1), './assets/images/ship' + (i + 1) + '.png', 32, 32);
    }
}

function create() {
    sea = game.add.tileSprite(0, 0, settings.WORLD_SIZE, settings.WORLD_SIZE, 'sea');
    game.world.setBounds(0, 0, settings.WORLD_SIZE, settings.WORLD_SIZE);
    cursors = game.input.keyboard.createCursorKeys();

    var myFuturePlayer = {
        name: 'Name' + Math.round(Math.random() * 100),
        type: 'ship_' + Math.floor(Math.random() * (6 - 1) + 1)
    };
    console.log(myFuturePlayer);
    client.askNewPlayer(myFuturePlayer);
}

function update() {
    sea.tilePosition.y += .1;
    if (my_player) {
        if (cursors.left.isDown) {
            players[my_player].update(actions.ACTION_LEFT);
            client.action(players[my_player].toServer());
        } else if (cursors.right.isDown) {
            players[my_player].update(actions.ACTION_RIGHT);
            client.action(players[my_player].toServer());
        } else if (cursors.up.isDown) {
            players[my_player].update(actions.ACTION_UP);
            client.action(players[my_player].toServer());
        } else if (cursors.down.isDown) {
            players[my_player].update(actions.ACTION_DOWN);
            client.action(players[my_player].toServer());
        } else {
            if (players[my_player].action !== actions.ACTION_STAY) {
                players[my_player].update(actions.ACTION_STAY);
                client.action(players[my_player].toServer());
            }
        }
    }
}

function addNewPlayer(data) {
    players[data.id] = new Player(data, game)
}

function removePlayer(id) {
    players[id].destroy();
    delete players[id];
}

function actionPlayer(data) {
    if (my_player !== data.id) {
        players[data.id].updatePos(data);
    }
}

function render() {
}