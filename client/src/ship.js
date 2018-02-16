const SPRITE_SIZE = 32;

function Ship(object) {
    this.id = object.id || 'Player';
    this.name = object.name || 'Player';
    this.sprite = new Phaser.Sprite(-SPRITE_SIZE, -SPRITE_SIZE, 'ship_1');
    this.sprite.tint = Math.random() * 0xffffff;
    this.sprite.anchor.set(.5, .5);
    this.sprite.animations.add('left', [4, 5, 6, 7], 10);
    this.sprite.animations.add('down', [8, 9, 10, 11], 10);
    this.sprite.animations.add('up', [12, 13, 14, 15], 10);
}

Ship.prototype.render = function () {

};

module.exports = Ship;