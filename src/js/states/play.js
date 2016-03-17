import Player from '../prefabs/player';
import Enemy from '../prefabs/enemy';
import Seal from '../prefabs/seal';
import HUD from '../prefabs/hud';
import GameTreeEngine from '../extensions/gameTreeEngine';

export default class Play extends Phaser.State {

    create() {
        this.gte = new GameTreeEngine("../../data/missions.json");
        this.actualMission = this.gte.getInitialMission();

        this.farback = this.add.tileSprite(0, 0, 800, 2380, 'farback');

        this.game.time.slowMotion = 1;

        this.enemies = this.add.group();
        this.enemies.enableBody = true;

        this.player = new Player({
            game: this.game,
            x: this.game.world.centerX,
            y: 0.92 * this.game.world.height,
            health: 1,
            asset: 'pengu',
            frame: 4
        });
        this.game.stage.addChild(this.player);

        this.hud = new HUD({
            game: this.game,
            player: this.player
        });

        this.game.input.onDown.add(() => {
            this.game.time.slowMotion = 1;
        });

        this.game.input.onUp.add(() => {
            this.game.time.slowMotion = 3;
        });

        this.enemyTime = 0;
        this.enemyInterval = 0.5;

        this.game.time.events.loop(Phaser.Timer.SECOND * 10, () => {
            if(this.enemyInterval > 0.2 ){
                this.enemyInterval -= 0.1;
            }
        });

        this.overlayBitmap = this.add.bitmapData(this.game.width, this.game.height);
        this.overlayBitmap.ctx.fillStyle = '#000';
        this.overlayBitmap.ctx.fillRect(0, 0, this.game.width, this.game.height);

        this.overlay = this.add.sprite(0, 0, this.overlayBitmap);
        this.overlay.visible = false;
        this.overlay.alpha = 0.75;

    }

    update() {

        this.enemyTime += this.game.time.physicsElapsed;

        if (this.enemyTime > this.enemyInterval) {
            this.enemyTime = 0;

            this.createEnemy({
                game: this.game,
                x: this.game.rnd.integerInRange(6, 76) * 10,
                y: 0,
                speed: {
                    x: this.game.rnd.integerInRange(5, 10) * 10 * (Math.random() > 0.5 ? 1 : -1),
                    y: this.game.rnd.integerInRange(5, 10) * 10
                },
                frame: 1,
                health: 1,
                asset: 'seal'
            });
        }

        //this.game.physics.arcade.overlap(this.player.bullets, this.enemies, this.hitEnemy, null, this);

        this.game.physics.arcade.overlap(this.player, this.enemies, this.crashEnemy, null, this);

        //this.enemies.forEach(enemy => this.game.physics.arcade.overlap(this.player, enemy.bullets, this.hitPlayer, null, this));

        // move background
        this.farback.tilePosition.y += 3;
        if (this.player.sideStepping()) {
            this.farback.tilePosition.x += this.player.goingLeft() ? 1 : -1;
        }
    }

    createEnemy(data) {

        let enemy = this.enemies.getFirstExists(false);

        if (!enemy) {
            enemy = new Seal(data);
            this.enemies.add(enemy);
        }
        enemy.reset(data);
    }

    hitEffect(obj, color) {
        let tween = this.game.add.tween(obj);
        let emitter = this.game.add.emitter();
        let emitterPhysicsTime = 0;
        let particleSpeed = 100;
        let maxParticles = 10;

        tween.to({tint: 0xff0000}, 100);
        tween.onComplete.add(() => {
            obj.tint = 0xffffff;
        });
        tween.start();

        emitter.x = obj.x;
        emitter.y = obj.y;
        emitter.gravity = 0;
        emitter.makeParticles('particle');

        if (obj.health <= 0) {
            particleSpeed = 200;
            maxParticles = 40;
            color = 0xff0000;
        }

        emitter.minParticleSpeed.setTo(-particleSpeed, -particleSpeed);
        emitter.maxParticleSpeed.setTo(particleSpeed, particleSpeed);
        emitter.start(true, 500, null, maxParticles);
        emitter.update = () => {
            emitterPhysicsTime += this.game.time.physicsElapsed;
            if(emitterPhysicsTime >= 0.6){
                emitterPhysicsTime = 0;
                emitter.destroy();
            }

        };
        emitter.forEach(particle => particle.tint = color);
        if (!this.player.alive) {
            this.game.world.bringToTop(this.overlay);
        }
    }

    crashEnemy(player, enemy) {
        //console.log("pingu : " + player.health);
        //console.log("seal : " + enemy.health);
        enemy.damage(enemy.health);
        player.damage(enemy.health);
        this.hitEffect(player);
        this.hitEffect(enemy);
        if (!enemy.alive) {
            //this.enemyExplosionSound.play("",0,0.5);
            //this.hud.updateScore(enemy.maxHealth);
        }
        this.hud.updateHealth();
        if (!player.alive) {
            //this.playerExplosionSound.play();
            this.gameOver();
        }

        //console.log("pingu : " + player.health);
        //console.log("seal : " + enemy.health);
    }

    gameOver(){
        this.game.time.slowMotion = 3;
        this.overlay.visible = true;
        this.game.world.bringToTop(this.overlay);
        let timer = this.game.time.create(this.game, true);
        timer.add(3000, () => {
            //this.music.stop();
            //this.gameOverSound.play();
            this.game.state.start('Over');
        });
        timer.start();
    }

}
