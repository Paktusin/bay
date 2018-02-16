const SPRITE_SIZE = 32;
var act = require('../../common/actions');

function Player(params, game) {
    this.id = params.id;
    this.name = params.name || 'Player';
    this.action = params.action;

    this.sprite = game.add.sprite(this.x, this.y, 'ship_1');
    this.text = game.add.text(this.x, this.y - SPRITE_SIZE / 2, this.name.toLowerCase(), {
        font: 'normal 8pt Arial'
    });
    //this.sprite.tint = Math.random() * 0xffffff;
    this.sprite.anchor.set(.5, .5);
    this.text.anchor.set(.5, .5);

    this.sprite.animations.add('left', [4, 5, 6, 7], 10);
    this.sprite.animations.add('down', [8, 9, 10, 11], 10);
    this.sprite.animations.add('up', [12, 13, 14, 15], 10);

    game.physics.arcade.enable(this.sprite);
    this.sprite.body.collideWorldBounds = true;
}

Player.prototype.destroy = function () {
    this.sprite.destroy();
    this.text.destroy();
};

Player.prototype.actions = {};

Player.prototype.actions[act.ACTION_STAY] = function () {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
};

Player.prototype.actions[act.ACTION_LEFT] = function () {
    this.sprite.animations.play('left');
    this.sprite.scale.setTo(1, 1);
    this.sprite.body.velocity.x = -150;
};

Player.prototype.actions[act.ACTION_RIGHT] = function () {
    this.sprite.animations.play('left');
    this.sprite.scale.setTo(-1, 1);
    this.sprite.body.velocity.x = 150;
};

Player.prototype.actions[act.ACTION_UP] = function () {
    this.sprite.animations.play('up');
    this.sprite.body.velocity.y = -150;
};

Player.prototype.actions[act.ACTION_DOWN] = function () {
    this.sprite.animations.play('down');
    this.sprite.body.velocity.y = 150;
};

Player.prototype.update = function (action) {
    this.action = action;
    this.actions[action].call(this);
};

Player.prototype.updatePos = function (data) {
    this.action = data.action;
    this.actions[data.action].call(this);
    if (data.action === act.ACTION_STAY) {
        this.sprite.position.x = data.x;
        this.sprite.position.y = data.y;
    }
};

Player.prototype.toServer = function () {
    return {
        x: this.sprite.position.x,
        y: this.sprite.position.y,
        id: this.id,
        name: this.name,
        action: this.action
    }
};

module.exports = Player;