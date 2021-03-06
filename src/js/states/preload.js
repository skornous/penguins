export default class Preload extends Phaser.State {

    preload() {

        // --- SPRITES --- //
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');

        // --- BACKGROUND --- //
        this.loaderBg.anchor.setTo(0.5);
        this.loaderBar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.loaderBar);

        // --- DATAS --- //
        //this.load.atlasJSONArray('smallfighter', 'img/spritesheet/smallfighter.png', 'data/spritesheet/smallfighter.json');
        //this.load.atlasJSONArray('alien', 'img/spritesheet/alien.png', 'data/spritesheet/alien.json');
        this.load.atlasJSONArray('button', 'img/spritesheet/button.png', 'data/spritesheet/button.json');
        this.load.spritesheet('penguin', 'img/spritesheet/dude.png', 32, 48);
        this.load.spritesheet('seal', 'img/spritesheet/dude.png', 32, 48);

        // --- GAME IMAGES --- //
        this.load.image('pengu', 'img/penguin.png');
        this.load.image('rock', 'img/farback.jpg');
        this.load.image('fish', 'img/bullet.png');
        this.load.image('particle', 'img/particle.gif');
        this.load.image('healthbar', 'img/healthbar.png');
        this.load.image('hudBg', 'img/hud-bg.png');
        this.load.image('farback', 'img/game-bg.jpg');

        // --- SOUND --- //

    }

    create() {
        this.state.start('Menu');
    }

}
