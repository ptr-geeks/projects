import Phaser from 'phaser';

class Button {
  constructor(x: number, y: number, label: string, scene: Phaser.Scene, callback: () => void) {
      const button = scene.add.text(x, y, label)
          .setOrigin(0.5)
          .setPadding(10)
          .setStyle({ backgroundColor: '#111' })
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => callback())
          .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
          .on('pointerout', () => button.setStyle({ fill: '#FFF' }));
  }
}


export class Start extends Phaser.Scene {

  constructor() {
    super('Start');
  }

  preload(): void {

  }


  create(): void {

    const button = new Button(480, 381.5, 'Start Game', this, () => this.scene.start('PlayGame'));


  
  }

  update(): void {

  }
}
