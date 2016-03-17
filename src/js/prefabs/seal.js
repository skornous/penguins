export default class Seal extends Phaser.Sprite {

    constructor({ game, x, y, asset, frame, health }) {
        super(game, x, y, asset, frame);

        this.game = game;
        this.health = health;

        this.anchor.setTo(0.5);
        this.scale.setTo(0.8);
        this.game.physics.arcade.enable(this);

        this.animations.add('swimmingLeft', [0, 1, 2, 3], 10, true);
        this.animations.add('swimmingRight', [5, 6, 7, 8], 10, true);
        //this.animations.stop();
        this.frame = 4;

    }

    update() {

        if (this.position.x < 0.04 * this.game.world.width) {
            this.position.x = 0.04 * this.game.world.width + 2;
            this.body.velocity.x *= -1;
            this.animations.play('swimmingRight');
        }
        else if (this.position.x > 0.96 * this.game.world.width) {
            this.position.x = 0.96 * this.game.world.width - 2;
            this.body.velocity.x *= -1;
            this.animations.play('swimmingLeft');
        }

        if (this.position.y - this.height / 2 > this.game.world.height) {
            this.kill();
        }
    }

    damage(amount) {
        super.damage(amount);
    }

    reset({ x, y, health, bulletSpeed, speed }) {
        super.reset(x, y, health);
        this.body.velocity.x = speed.x;
        this.body.velocity.y = speed.y;
    }
}
