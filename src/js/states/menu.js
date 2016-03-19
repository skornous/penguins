import TextButton from '../extensions/textbutton';

export default class Menu extends Phaser.State {

    create() {

        this.title = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY-200, 'Penguins', {
            font: '36px Verdana',
            fill: 'white',
            align: 'center'
        });
        this.title.anchor.setTo(0.5);

        this.easy = new TextButton({
            game: this.game,
            x: this.game.world.centerX,
            y: this.game.world.centerY - 50,
            asset: 'button',
            overFrame: 2,
            outFrame: 1,
            downFrame: 0,
            upFrame: 1,
            label: 'Easy',
            style: {
                font: '16px Verdana',
                fill: 'white',
                align: 'center'
            }
        });

        this.medium = new TextButton({
            game: this.game,
            x: this.game.world.centerX,
            y: this.game.world.centerY,
            asset: 'button',
            overFrame: 2,
            outFrame: 1,
            downFrame: 0,
            upFrame: 1,
            label: 'Normal',
            style: {
                font: '16px Verdana',
                fill: 'white',
                align: 'center'
            }
        });

        this.hard = new TextButton({
            game: this.game,
            x: this.game.world.centerX,
            y: this.game.world.centerY + 50,
            asset: 'button',
            overFrame: 2,
            outFrame: 1,
            downFrame: 0,
            upFrame: 1,
            label: 'Hard',
            style: {
                font: '16px Verdana',
                fill: 'white',
                align: 'center'
            }
        });

        this.easy.onInputUp.add(()=>{
            this.game.difficulty = 0;
            this.state.start('Play');
        });

        this.medium.onInputUp.add(()=>{
            this.game.difficulty = 1;
            this.state.start('Play');
        });

        this.hard.onInputUp.add(()=>{
            this.game.difficulty = 2;
            this.state.start('Play');
        });

        this.menuPanel = this.add.group();
        this.menuPanel.add(this.title);
        this.menuPanel.add(this.easy);
        this.menuPanel.add(this.medium);
        this.menuPanel.add(this.hard);

    }
}
