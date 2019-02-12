const SPRITE_SIZE = 32;
import actions from '../../common/actions';

class Player {
    constructor(params, game) {

        this.id = params.id;
        this.name = params.name || 'Player';
        this.action = params.action;
        this.type = params.type;

        this.sprite = game.add.sprite(params.x, params.y, this.type);
        this.text = game.add.text(this.x, this.y - SPRITE_SIZE / 2, this.name.toLowerCase(), {
            font: 'normal 8pt Arial'
        });
        this.sprite.anchor.set(.5, .5);
        this.text.anchor.set(.5, 1.5);

        this.sprite.animations.add('left', [0, 1, 2, 3], 10);
        this.sprite.animations.add('down', [4, 5, 6, 7], 10);
        this.sprite.animations.add('up', [8, 9, 10, 11], 10);

        game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;

        this.speedX = 150;
        this.speedY = 100;

        this.update(actions.ACTION_STAY);

        this.actions = {};

        this.actions[actions.ACTION_STAY] = () => {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
        };

        this.actions[actions.ACTION_LEFT] = () => {
            this.sprite.animations.play('left');
            this.sprite.scale.setTo(1, 1);
            this.sprite.body.velocity.x = -this.speedX;
            this.sprite.body.velocity.y = 0;
        };

        this.actions[actions.ACTION_RIGHT] = () => {
            this.sprite.animations.play('left');
            this.sprite.scale.setTo(-1, 1);
            this.sprite.body.velocity.x = this.speedX;
            this.sprite.body.velocity.y = 0;
        };

        this.actions[actions.ACTION_UP] = () => {
            this.sprite.animations.play('up');
            this.sprite.body.velocity.y = -this.speedY;
            this.sprite.body.velocity.x = 0;
        };

        this.actions[actions.ACTION_DOWN] = () => {
            this.sprite.animations.play('down');
            this.sprite.body.velocity.y = this.speedY;
            this.sprite.body.velocity.x = 0;
        };
    }

    updateText() {
        this.text.position.x = this.sprite.position.x;
        this.text.position.y = this.sprite.position.y;
    };

    destroy() {
        this.sprite.destroy();
        this.text.destroy();
    };

    update(action) {
        this.action = action;
        this.actions[action].call(this);
        this.updateText();
    };

    updatePos(data) {
        this.action = data.action;
        this.actions[data.action].call(this);
        if (data.action === actions.ACTION_STAY) {
            this.sprite.body.position.x = data.x;
            this.sprite.body.position.y = data.y;
            this.sprite.position.x = data.x;
            this.sprite.position.y = data.y;
        }
        this.updateText();
    };

    toServer() {
        return {
            x: this.sprite.position.x,
            y: this.sprite.position.y,
            id: this.id,
            name: this.name,
            action: this.action
        }
    };

}


export default Player;