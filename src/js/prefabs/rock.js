export default class Rock extends Phaser.Sprite {

    constructor({ game, x, y, asset, frame, health }) {
        super(game, x, y, asset, frame);

        this.game = game;
        this.health = health;

        this.anchor.setTo(0.5);
        this.scale.setTo(0.01);
        this.game.physics.arcade.enable(this);

        this.frame = 0;

    }

    update() {

        if (this.position.y - this.height / 2 > this.game.world.height) {
            this.kill();
        }
    }

    damage(amount) {
        super.damage(amount);
    }

    reset({ x, y, health, bulletSpeed, speed }) {
        super.reset(x, y, health);
        this.body.velocity.y = speed.y;
    }
}
