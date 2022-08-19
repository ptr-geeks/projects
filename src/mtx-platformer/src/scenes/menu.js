import * as Phaser from 'phaser';

export default class menu extends Phaser.Scene {
    constructor() {
      super({ key: 'menu' });
    }
    preload(){
    }

    create(){
      //fade in
      this.cameras.main.fadeIn(400);
      
      //background
      this.background = this.add.image(0,-200, 'background')
      .setOrigin(0, 0)
      .setDepth(-100)
      .setScale(0.5,0.5);
      this.background.setInteractive();

      //text
      this.txt = this.add.text(512,256, "Click here to start", {fill: "#131516", fontSize: 64, fontWeight: '800', font: 'bold 5rem Arial'}).setOrigin(0.5,0.5);
      
      //if background is clicked/pressed, camera zoom, fade out, level 1 start
      this.background.on('pointerdown', function (pointer) {
        this.scene.cameras.main.fadeOut(1200, 0, 0, 0);
        this.scene.tweens.add( {
        targets: this.scene.cameras.main,
        duration: 1200,
        zoom: 2
        })
        this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
          this.scene.scene.start('level1');
        })
      });
    }
}