import Player from '../prefabs/player';
import Seal from '../prefabs/seal';
import Fish from '../prefabs/fish';
import Rock from '../prefabs/rock';
import HUD from '../prefabs/hud';
import GameTreeEngine from '../extensions/gameTreeEngine';

export default class Play extends Phaser.State {

    create() {
        this.gte = new GameTreeEngine("../../data/missions.json");
        this.actualMission = this.gte.getInitialMission();

        this.fishesEaten = 0;
        this.rocksGrabbed = 0;
        this.enemiesKilled = 0;

        this.fishesToEat = 0;
        this.rocksToGrab = 0;
        this.enemiesToKill = 0;

        this.objectives = this.readMisison(this.actualMission);

        this.farback = this.add.tileSprite(0, 0, 800, 2380, 'farback');

        this.game.time.slowMotion = 1;

        this.enemies = this.add.group();
        this.enemies.enableBody = true;

        this.fishes = this.add.group();
        this.fishes.enableBody = true;

        this.rocks = this.add.group();
        this.rocks.enableBody = true;

        this.player = new Player({
            game: this.game,
            x: this.game.world.centerX,
            y: 0.92 * this.game.world.height,
            health: 10,
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
        this.fishTime = 0;
        this.rockTime = 0;

        // initiate difficulty
        if (this.game.difficulty == 0) {
            this.enemyInterval = 3;
            this.fishInterval = 3;
            this.rockInterval = 5;
        } else if (this.game.difficulty == 1) {
            this.enemyInterval = 3;
            this.fishInterval = 5;
            this.rockInterval = 10;
        } else {
            this.enemyInterval = 0.5;
            this.fishInterval = 5;
            this.rockInterval = 15;
        }

        this.game.time.events.loop(Phaser.Timer.SECOND * 10, () => {
            if(this.enemyInterval > 0.2 ){
                this.enemyInterval -= 0.1;
            }
            if(this.fishInterval > 0.2 ){
                this.fishInterval -= 0.1;
            }
            if(this.rockInterval > 0.2 ){
                this.rockInterval -= 0.1;
            }
        });

        this.overlayBitmap = this.add.bitmapData(this.game.width, this.game.height);
        this.overlayBitmap.ctx.fillStyle = '#000';
        this.overlayBitmap.ctx.fillRect(0, 0, this.game.width, this.game.height);

        this.overlay = this.add.sprite(0, 0, this.overlayBitmap);
        this.overlay.visible = false;
        this.overlay.alpha = 0.75;

        this.hud.updateObjectives({
            rocks: this.rocksToGrab,
            fishes: this.fishesToEat,
            enemies: this.enemiesToKill
        })
    }

    update() {

        this.enemyTime += this.game.time.physicsElapsed;
        this.fishTime += this.game.time.physicsElapsed;
        this.rockTime += this.game.time.physicsElapsed;

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

        if (this.fishTime > this.fishInterval) {
            this.fishTime = 0;

            this.createFish({
                game: this.game,
                x: this.game.rnd.integerInRange(6, 76) * 10,
                y: 0,
                speed: {
                    x: this.game.rnd.integerInRange(5, 10) * 10 * (Math.random() > 0.5 ? 1 : -1),
                    y: this.game.rnd.integerInRange(5, 10) * 10
                },
                frame: 1,
                health: 1,
                asset: 'fish'
            });
        }

        if (this.rockTime > this.rockInterval) {
            this.rockTime = 0;

            this.createRock({
                game: this.game,
                x: this.game.rnd.integerInRange(6, 76) * 10,
                y: 0,
                speed: {
                    x: this.game.rnd.integerInRange(5, 10) * 10 * (Math.random() > 0.5 ? 1 : -1),
                    y: this.game.rnd.integerInRange(5, 10) * 10
                },
                frame: 1,
                health: 1,
                asset: 'rock'
            });
        }

        //this.game.physics.arcade.overlap(this.player.bullets, this.enemies, this.hitEnemy, null, this);

        this.game.physics.arcade.overlap(this.player, this.enemies, this.crashEnemy, null, this);
        this.game.physics.arcade.overlap(this.player, this.fishes, this.eatFish, null, this);
        this.game.physics.arcade.overlap(this.player, this.rocks, this.collectRock, null, this);

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

    createFish(data) {
        // console.log("create fish");
        let fish = this.fishes.getFirstExists(false);

        if (!fish) {
            fish = new Fish(data);
            this.fishes.add(fish);
        }
        fish.reset(data);
    }

    createRock(data) {
        // console.log("create rock");
        let rock = this.rocks.getFirstExists(false);

        if (!rock) {
            rock = new Rock(data);
            this.rocks.add(rock);
        }
        rock.reset(data);
    }

    crashEnemy(player, enemy) {
        // console.log(enemy.health)
        player.damage(enemy.health);
        enemy.damage(enemy.health);
        this.hitEffect(player);
        this.hitEffect(enemy);
        if (!enemy.alive) {
            //this.hud.updateScore(enemy.maxHealth);
        }
        this.hud.updateHealth();
        if (!player.alive) {
            this.gameOver();
        }
        this.enemiesKilled++;
        this.hud.updateEnemy();
        this.objectivesFulfilled();
    }

    eatFish(player, fish) {
        player.heal(fish.health);
        fish.damage(fish.health);
        this.hud.updateScore(fish.maxHealth);
        this.hud.updateHealth();
        // console.log("health : " + player.health);
        if (!player.alive) {
            this.gameOver();
        }
        this.fishesEaten++;
        this.hud.updateFish();
        this.objectivesFulfilled();
    }

    collectRock(player, rock) {
        rock.damage(rock.health);
        this.hud.updateScore(rock.maxHealth * 10);
        this.rocksGrabbed++;
        this.hud.updateRock();
        this.objectivesFulfilled();
    }

    gameOver(){
        this.game.time.slowMotion = 3;
        this.overlay.visible = true;
        this.game.world.bringToTop(this.overlay);
        let timer = this.game.time.create(this.game, true);
        timer.add(3000, () => {
            this.game.state.start('Over');
        });
        timer.start();
    }

    objectivesFulfilled() {
        if (this.rocksGrabbed >= this.rocksToGrab &&
            this.enemiesKilled >= this.enemiesToKill &&
            this.fishesEaten >= this.fishesToEat
        ) {
            this.gameOver();
        }
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

    readMisison(mission) {
        // this.missionBranch(mission);
        // console.log(this.missionBranch(mission));
        this.fishesToEat = 10;
        this.rocksToGrab = 10;
        this.enemiesToKill = 10;

        return null;
    }

    missionBranch(root) {
        if (root instanceof String) {
            return root;
        } else if (root instanceof Array) {
            // console.log("Array");
            // console.log(root);
            let content;
            if (root.or != undefined) {
                content = root.or;
            } else { // root.and != undefined
                content = root.and;
            }

            for (var i in content) {
                console.log(content[i]);
                this.missionBranch(content[i]);
            }
        } else {
            // console.log("Object");
            // console.log(root);
            for (var name in root) {
                this.missionBranch(root[name]);
            }
        }
    }
}
