require('expose-loader?p2!phaser-ce/build/custom/p2.js');
require('expose-loader?PIXI!phaser-ce/build/custom/pixi.js');
require('expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js');

import io from 'socket.io-client';
import actions from '../../common/actions';
import settings from '../../common/settings';
import Player from "./Player";

class Game extends Phaser.Game {

    constructor(my_player) {
        super(800, 600, Phaser.CANVAS, '',);
        this.players = {};
        this.myPlayer = my_player;
    }

    preload() {
        console.log('preload');
        this.load.image('sea', './assets/images/sea.png');
        for (let i = 0; i < 6; i++) {
            this.load.spritesheet('ship_' + (i + 1), './assets/images/ship' + (i + 1) + '.png', 32, 32);
        }
    }

    create() {
        console.log('create');
        this.sea = this.add.tileSprite(0, 0, settings.WORLD_SIZE, settings.WORLD_SIZE, 'sea');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.world.setBounds(0, 0, settings.WORLD_SIZE, settings.WORLD_SIZE);
        const myFuturePlayer = {
            name: 'Name' + Math.round(Math.random() * 100),
            type: 'ship_' + Math.floor(Math.random() * (6 - 1) + 1)
        };
        console.log(myFuturePlayer);

        this.client = io.connect(process.env.production ? 'https://paktusin.ddns.net:8082' : 'http://localhost:8082');
        this.client.on('newplayer', this.addNewPlayer.bind(this));
        this.client.on('myplayer', (id) => {
            this.myPlayer = id;
            this.camera.follow(this.players[this.myPlayer].sprite);
        });
        this.client.on('allplayers', this.allPlayers.bind(this));
        this.client.on('remove', this.removePlayer.bind(this));
        this.client.on('action', this.actionPlayer.bind(this));
        this.client.emit('newplayer', myFuturePlayer);
    }

    allPlayers(data) {
        data.forEach(function (player_data) {
            this.players[player_data.id] = new Player(player_data, game)
        });
    }

    action(player) {
        this.client.emit('update', player);
    }

    update(time) {
        this.sea.tilePosition.y += .1;
        if (this.myPlayer) {
            if (this.cursors.left.isDown) {
                this.players[this.myPlayer].update(actions.ACTION_LEFT);
                this.client.action(this.players[this.myPlayer].toServer());
            } else if (this.cursors.right.isDown) {
                this.players[this.myPlayer].update(actions.ACTION_RIGHT);
                this.client.action(this.players[this.myPlayer].toServer());
            } else if (this.cursors.up.isDown) {
                this.players[this.myPlayer].update(actions.ACTION_UP);
                this.client.action(this.players[this.myPlayer].toServer());
            } else if (this.cursors.down.isDown) {
                this.players[this.myPlayer].update(actions.ACTION_DOWN);
                this.client.action(this.players[this.myPlayer].toServer());
            } else {
                if (this.players[this.myPlayer].action !== actions.ACTION_STAY) {
                    this.players[this.myPlayer].update(actions.ACTION_STAY);
                    this.client.action(this.players[this.myPlayer].toServer());
                }
            }
        }
    }

    addNewPlayer(data) {
        this.players[data.id] = new Player(data, game)
    }

    removePlayer(id) {
        this.players[id].destroy();
        delete this.players[id];
    }

    actionPlayer(data) {
        if (this.myPlayer !== data.id) {
            this.players[data.id].updatePos(data);
        }
    }

}

export default Game;