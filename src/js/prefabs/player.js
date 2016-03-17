import Bullet from './bullet';

export default class Player extends Phaser.Sprite {

    constructor({ game, x, y, asset, frame, health }) {
        super(game, x, y, asset, frame);

        this.game = game;

        this.anchor.setTo(0.5);
        this.scale.setTo(0.1);

        this.health = health;
        this.maxHealth = health;

        this.direction = "none";

        this.game.physics.arcade.enable(this);

        this.lastPos = {x, y};

        this.diff = {
            x: 0,
            y: 0
        };

        this.game.input.onDown.add(() => {
            if (this.alive) {
                let {x,y} = this.game.input.activePointer.position;
                this.diff.x = x - this.position.x;
                this.diff.y = y - this.position.y;
            }
        });

        this.game.input.onUp.add(() => {
            if (this.alive) {
                this.frame = 4;
                this.direction = 'none';
            }
        });

    }

    update() {

        //this.game.debug.body(this);

        if (this.game.input.activePointer.isDown) {

            let { x, y } = this.game.input.activePointer.position;

            let left = x < this.lastPos.x;
            let right = x > this.lastPos.x;
            let diff = Math.abs(x - this.lastPos.x);

            this.position.x = x - this.diff.x;
            this.position.y = y - this.diff.y;

            if (this.position.x < 0.02 * this.game.world.width) {
                this.position.x = 0.02 * this.game.world.width;
            }

            if (this.position.x > 0.98 * this.game.world.width) {
                this.position.x = 0.98 * this.game.world.width;
            }

            if (this.position.y < 0.09 * this.game.world.height) {
                this.position.y = 0.09 * this.game.world.height;
            }

            if (this.position.y > 0.94 * this.game.world.height) {
                this.position.y = 0.94 * this.game.world.height;
            }

            if (diff > 3) {
                if (left) {
                    this.frame = 0;
                    this.direction = 'left';
                } else if (right) {
                    this.frame = 8;
                    this.direction = 'right';
                }
            } else {
                if (this.game.time.elapsedMS >= 16) {
                    this.frame = 4;
                    this.direction = 'none';
                }
            }
            //this.game.farback.tilePosition.y += 3;


            this.lastPos.x = x;
            this.lastPos.y = y;
        }

    }


    damage(amount) {
        super.damage(amount);
    }

    goingLeft() {
        return this.direction === "left";
    }

    sideStepping() {
        return this.direction !== "none";
    }

}
