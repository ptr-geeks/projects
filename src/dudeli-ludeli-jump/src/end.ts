import Phaser from 'phaser';



export class End extends Phaser.Scene {

  constructor() {
    super('end');
  }

  preload(): void {

  }


  create(): void {

  this.add.text(100, 100, 'phaser');

  this.add.text(400, 381.5, 'YOU WIN').setFontFamily('Arial').setFontSize(64).setColor('#FF0000')


  
  }

  update(): void {

  }
}