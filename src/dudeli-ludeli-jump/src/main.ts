import Phaser from 'phaser';

import { Start } from './start';
import { End } from './end';

enum ImageNames {

}

class PlayGame extends Phaser.Scene {
  image: Phaser.Physics.Arcade.Image;

  platform: Phaser.Physics.Arcade.StaticGroup;
  player: Phaser.Physics.Arcade.Sprite;

  timeedEvent: any;
  text: Phaser.GameObjects.Text;

  keys: any;
  justJumped: boolean = false;
  jumpCount = 0;
  Maxhight = 6000;

  timeStart: number = 0;

  constructor() {
    super('PlayGame');
  }
  preload(): void {


    this.load.image('ozadje', 'assets/ozadje.png');
    this.load.spritesheet('player_idel', 'assets/idel.png', {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet('player_run', 'assets/run.png', {
      frameWidth: 48,
      frameHeight: 48,
    });

    this.load.spritesheet('player_land', 'assets/land.png', {
      frameWidth: 48,
      frameHeight: 48,
    });


    this.load.tilemapTiledJSON('tilemap', 'assets/map.json');
    this.load.image('sprites_image', 'assets/platform.png');

  }

  create(): void {
    this.cameras.main.setBounds(0, 0, 960, 4800);
    this.physics.world.setBounds(0, 0, 960, 6000);

    const uiScene = this.scene.add('ui', {}, true);
    this.text = uiScene!.add.text(32, 32, '').setFontFamily('Arial').setFontSize(64).setColor('#FF0000');

    this.add.tileSprite(0, 0, 0, 6500, 'ozadje')
      .setScrollFactor(0, 0.05)
      .setOrigin(0, 0)
      .setDepth(-100);

    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage("platform", "sprites_image");
    const layer = map.createLayer("Tile Layer 1", tileset!);
    layer?.setCollisionBetween(1, 255);

    const finish = map.createLayer("finish", tileset!);
    finish?.setCollision([210])

    this.anims.create({
      key: 'player_idel',
      frames: this.anims.generateFrameNumbers('player_idel', {
        start: 0,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'player_run',
      frames: this.anims.generateFrameNumbers('player_run', {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1
    })


    this.anims.create({
      key: 'player_land',
      frames: this.anims.generateFrameNumbers('player_land', {
        start: 0,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1
    })

    this.player = this.physics.add.sprite(50, 4700, 'player_idel')
      .setCollideWorldBounds()
      .setScale(1.5).setBodySize(32, 32);

    this.physics.add.collider(this.player, layer!);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.physics.add.collider(this.player, finish!, () => {
      this.scene.pause();
      this.scene.start("end");
    });


    this.keys = this.input.keyboard?.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' })!;
  }
  update(time: number, delta: number): void {
    const totalSeconds = ((time - this.time.startTime) / 1000).toFixed(2);
    this.text.setText('Time:' + totalSeconds + 's');

    this.player.setVelocityX(0)


    if (this.keys.right.isDown) {
      this.player.setVelocityX(400);
      this.player.setFlipX(false);
      this.player.anims.play('player_run', true)
    }

    if (this.keys.left.isDown) {
      this.player.setVelocityX(-600);
      this.player.setFlipX(true);
      this.player.anims.play('player_run', true)
    }
    /*if (this.keys.up.isDown && this.player.body?.blocked.down){
      this.player.setVelocityY(-235);
      this.player.anims.play('player_fall')
    }*/

    if (this.keys.left.isUp && this.keys.right.isUp) {
      this.player.anims.play('player_idel', true)
    }

    if (this.player.body?.velocity.y!) {
      this.player.anims.play('player_land')
    }

    if (this.player.body?.blocked.left || this.player.body?.blocked.right) {
      this.player.setVelocityY(0);
    }

    if (this.keys.left.isDown) {
      this.player.setVelocityX(-400);

    }

    if (this.player.body!.blocked.down) {
      this.jumpCount = 0;
    }

    var canDoubleJump = this.jumpCount < 2;

    if (this.keys.up.isUp && this.justJumped) {
      this.jumpCount++;
      this.justJumped = false;
    }

    if (this.justJumped == false && this.keys.up.isDown && (this.player.body!.touching.down || canDoubleJump)) {
      this.justJumped = true;
      this.player.setVelocityY(-600);
    }

    if (!this.cameras.main.worldView.contains(this.player.x, this.player.y)) {
      // player died
      console.log("dead");
    }

    // if (this.player.body?.velocity.y! < 0) {
    //   this.cameras.main.setBounds(0, 0, 960, this.player.y + 100);
    // }
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
      gravity: { y: 800 },
      //debug: true
    }
  },
  width: 960,
  height: 768,
  transparent: true,
  scene: [Start, PlayGame, End],
};

export default new Phaser.Game(config);
