import * as Phaser from 'phaser';

export default class end extends Phaser.Scene {
    constructor() {
      super({ key: 'end' });
    }
    preload(){
    }

    create(){
        //fade in
        this.cameras.main.fadeIn(500);

        //background
        this.background = this.add.image(0,-200, 'background')
        .setOrigin(0, 0)
        .setDepth(-100)
        .setScale(0.5,0.5);
        
        //player picture
        this.player = this.add.image(512, 192, 'player').setScale(1.5,1.5);

        //text
        this.txt = this.add.text(512,256, "Congratulations, you won!", {fill: "#131516", font: 'bold 5rem Arial'}).setOrigin(0.5,0.5);
        this.txt = this.add.text(512,384, "Press F5 to play again", {fill: "#131516", font: 'bold 1rem Arial'}).setOrigin(0.5,0.5);
    }
}