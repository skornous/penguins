export default class Hud extends Phaser.Group {
    constructor({ game, player }) {
        super(game);
        this.game = game;
        this.player = player;
        this.width = 800;

        this.healthLabel = 'Life Points: ';
        this.healthText = new Phaser.Text(this.game, 0, 0, this.healthLabel + this.player.health, {
            font: '26px Verdana',
            fill: 'white',
            align: 'center'

        });

        // this.healthbar = new Phaser.Sprite(this.game, 0, 0, 'healthbar');
        // this.healthbar.scale.setTo(0.995, 11);
        // this.healthInfo = this.player.health;

        let yStart = 35;
        let dist = 15;

        this.score = 0;
        this.scoreLabel = 'Score: ';
        this.scoreText = new Phaser.Text(this.game, 20, yStart, this.scoreLabel + this.score, {
            font: '13px Verdana',
            fill: 'white',
            align: 'center'

        });



        this.fishes = 0;
        this.fishLabel = 'Fishes to eat: ';
        this.fishText = new Phaser.Text(this.game, 20, yStart+dist, this.fishLabel + this.fishes, {
            font: '13px Verdana',
            fill: 'white',
            align: 'center'

        });

        this.rocks = 0;
        this.rockLabel = 'Rocks to collect: ';
        this.rocksText = new Phaser.Text(this.game, 20, yStart+dist*2, this.rockLabel + this.rocks, {
            font: '13px Verdana',
            fill: 'white',
            align: 'center'

        });

        this.enemies = 0;
        this.enemiesLabel = 'Enemies to kill: ';
        this.enemiesText = new Phaser.Text(this.game, 20, yStart+dist*3, this.enemiesLabel + this.enemies, {
            font: '13px Verdana',
            fill: 'white',
            align: 'center'

        });

        this.add(this.healthText);
        this.add(this.scoreText);
        this.add(this.fishText);
        this.add(this.rocksText);
        this.add(this.enemiesText);
    }

    updateHealth() {
        // let newHealth;
        // if (this.player.health >= this.healthInfo) { // got heal
        //     newHealth = 1/(this.player.health / this.player.maxHealth) * this.width
        // } else { // got hit
        //     newHealth = (this.player.health / this.player.maxHealth) * this.width;
        // }
        // this.healthbar.crop(new Phaser.Rectangle(0, 0, newHealth, 10));
        // this.healthbar.updateCrop();
        // console.log(this.player.health);
        // this.healthInfo = this.player.health;

        this.healthText.text = this.healthLabel + this.player.health;
    }

    updateScore(amount) {
        this.score += amount;
        this.scoreText.text = this.scoreLabel + (this.score * 10);
    }

    updateFish() {
        this.fishes = this.fishes == 0 ? 0 : this.fishes-1;
        this.fishText.text = this.fishLabel + this.fishes;
    }

    updateRock() {
        this.rocks = this.rocks == 0 ? 0 : this.rocks-1;
        this.rocksText.text = this.rockLabel + this.rocks;
    }

    updateEnemy() {
        this.enemies = this.enemies == 0 ? 0 : this.enemies-1;
        this.enemiesText.text = this.enemiesLabel + this.enemies;
    }

    updateObjectives({rocks, fishes, enemies}) {
        this.rocks = rocks;
        this.fishes = fishes;
        this.enemies = enemies;

        this.fishText.text = this.fishLabel + this.fishes;
        this.rocksText.text = this.rockLabel + this.rocks;
        this.enemiesText.text = this.enemiesLabel + this.enemies;
    }

};
