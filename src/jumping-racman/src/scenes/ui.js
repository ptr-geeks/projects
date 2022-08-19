import * as Phaser from 'phaser';

export default class UI extends Phaser.Scene {
    constructor() {
        super('ui');
        this.timer = 0;
        this.cas = 0;
    }

    create() {
        this.timerText = this.add.text(5, 0, String(this.cas).padStart(1, '0'), {
            fontFamily: 'Arial',
            color: '#000000',
            fontSize: 48
        });
        this.timerText.setOrigin(0);
      
    this.gameOverText = this.add.text(game.config.width / 2, game.config.height / 2, "Your time is: " + cas, {fontSize: "64px", fill: "#000347", fontFamily: 'Impact'});
    this.gameOverText.setOrigin(0.5, 1.4);
    this.gameOverText.setVisible(false);
    }

    preUpdate()
    {
    }

    updateCas() {
        this.cas++;
        this.timerText.setText(String(this.cas).padStart(1, '0'));
    }

    gameOver() {
        this.gameOverText.setVisible(true);
    }
}
/*
        this.hearths = this.add.group();
        this.hearths.createMultiple({ 
            key: 'heart', 
            quantity: 3,
            setXY: {
                x: 20,
                y: 20,
                stepX: 30
            },
            setScale: {
                x: 0.1,
                y: 0.1
            },
            setOrigin: 0
         });
    }

    preUpdate() {

    }
}*/