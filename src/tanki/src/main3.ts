import Phaser from 'phaser';

enum ImageNames {
  PhaserLogo = 'phaser3-logo'
  
}

class PlayGame extends Phaser.Scene {
  image: Phaser.Physics.Arcade.Image;
  keys: Phaser.Types.Input.Keyboard.CursorKeys;
  floor: Phaser.GameObjects.Rectangle;
  floor2: Phaser.GameObjects.Rectangle;
  floor3: Phaser.GameObjects.Rectangle;
  keyW: Phaser.Input.Keyboard.Key;
  keyS: Phaser.Input.Keyboard.Key;
  keyA: Phaser.Input.Keyboard.Key;
  keyD: Phaser.Input.Keyboard.Key;
  canjump = true
  platforms: Phaser.Physics.Arcade.StaticGroup;
  FireAngle = 0

  movevelocity = 100;

  constructor() {
    super('PlayGame');
  }
  preload(): void {
    this.load.image(ImageNames.PhaserLogo, 'assets/phaser3-logo.png');
    
  }
  CreatePlatform(x: number, y: number, w: number, h: number): Phaser.GameObjects.Rectangle {
    return this.add.rectangle(x, y, w, h, 0x00FF00).setOrigin(0)
  }
  create(): void {
    this.platforms = this.physics.add.staticGroup()
    this.platforms.add(this.CreatePlatform(0, this.cameras.main.height - 20, this.cameras.main.width, 20))
    //this.platforms.add(this.CreatePlatform(500, 200, 200, 40))
    //this.platforms.add(this.CreatePlatform(-500, this.cameras.main.height - 300, this.cameras.main.width, 2000,))
    this.physics.add.collider(this.platforms, this.image, () => this.canjump = true);



    
    this.image = this.physics.add.image(400, 300, ImageNames.PhaserLogo)
      //.setBounce(1, 1)
      .setCollideWorldBounds(true, 1, 1)
      .setScale(0.5)
      .setVelocity(50, 80);
    
    this.physics.add.collider(this.platforms, this.image, () => this.canjump = true);

    this.keys = this.input.keyboard?.createCursorKeys()!;
    this.keyW = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W)!;
    this.keyS = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S)!;
    this.keyA = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A)!;
    this.keyD = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D)!;


  }
  update(): void {
    //this.image.setVelocity(0);
    this.image.setVelocityX(0);
    if (this.keys.down.isDown) { this.image.setVelocityY(this.movevelocity); }
    if (this.keys.up.isDown && this.canjump) {
      this.image.setVelocityY(-this.movevelocity);
      this.canjump = false
    }
    if (this.keys.left.isDown) { this.image.setVelocityX(-this.movevelocity); }
    if (this.keys.right.isDown) { this.image.setVelocityX(this.movevelocity); }

    if (this.keyW.isDown) { this.image.setVelocityY(this.movevelocity); }
    if (this.keyS.isDown) { this.image.setVelocityY(-this.movevelocity); }
    if (this.keyD.isDown) { this.image.setVelocityX(this.movevelocity); }
    if (this.keyA.isDown) { this.image.setVelocityX(-this.movevelocity); }






  }
}



const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    mode: Phaser.Scale.NONE,
  },
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 50 },
      debug: true
    }
  },
  width: 600,
  height: 450,
  transparent: true,
  scene: PlayGame,
};

export default new Phaser.Game(config);

