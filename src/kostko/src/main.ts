import Phaser from 'phaser';
import Menu from './menu';

class PlayGame extends Phaser.Scene {
  keys: Phaser.Types.Input.Keyboard.CursorKeys;
  player: Phaser.Physics.Arcade.Sprite;
  coinscoretext: Phaser.GameObjects.Text;
  coinscore: number = 0;

  constructor() {
    super('PlayGame');
  }

  preload(): void {
//coin
    this.load.spritesheet('coin', 'assets/SpriteSheetCoin.png', { 
   frameWidth: 32,
   frameHeight: 32
    })

    this.load.image('coin', 'assets/Coin.png')

    // Background
    this.load.image('background', 'assets/background.jpg');

    // World
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    this.load.image('sprites', 'assets/Assets.png');

    // Player
    this.load.spritesheet('player_idle', 'assets/Skeleton Idle.png', {
      frameWidth: 24,
      frameHeight: 32
    });

    this.load.spritesheet('player_run', 'assets/Skeleton Walk.png', {
      frameWidth: 22,
      frameHeight: 33
    });

    this.load.spritesheet('player_jump', 'assets/player_jump.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('player_fall', 'assets/player_fall.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('player_land', 'assets/player_land.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create(): void {
    const ui = this.scene.add("UI", {active: true, key: "UI"})!;

    this.coinscoretext = ui.add.text(650, 10, 'Coin Score');
    this.coinscoretext.setTint(0, 0, 0)
    const coinGroup = this.physics.add.staticGroup();


    this.cameras.main.setBounds(0, 0, 1920, 2000);
    this.physics.world.setBounds(0, 0, 1920, 2000);

    // Background
    this.add.tileSprite(0, 0, 0, 0, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0.5, 0)
      .setScale(1, 0.8)
      .setDepth(-100);

    
    
    const map = this.make.tilemap({ key: 'map' });
    const tileSet = map.addTilesetImage('ozadje', 'sprites');

    const backgroundLayer = map.createLayer('ozadje', tileSet!, 0, 0)?.setScale(2);
    const platformsLayer = map.createLayer('tla', tileSet!, 0, 0)?.setScale(2);
    const Spikes = map.createLayer('Spikes', tileSet!, 0, 0)?.setScale(2);
    platformsLayer?.setCollision([10, 32, 33, 11, 8, 12, 37, 157, 174, 78, 55, 35])
    Spikes?.setCollision([212]);

    this.anims.create({
    key: 'coin',
    frames: this.anims.generateFrameNumbers('coin',{
      start: 0,
      end: 21
      }),
       frameRate: 20,
       repeat: -1,
       yoyo: true
    });
    const coinLayer = map.getObjectLayer("Coin platforme")!["objects"];

     coinLayer.forEach((platform) => {
      console.log(platform)
       const coin = this.add.sprite(platform.x! * 2, platform.y! * 2, 'coin');
       coin.anims.play("coin")
        coinGroup.add(coin);
     })

    // Player
    this.player = this.physics.add.sprite(50, 450, 'player_idle', 0)
      .setScale(1)
      .setCollideWorldBounds(true);

    this.physics.add.collider(this.player, platformsLayer!);

    this.physics.add.collider(this.player, Spikes!, (player, Spike) => {
      this.scene.start('Menu');
    })

    this.physics.add.overlap(this.player, coinGroup, (player, coin) => {
      coin.destroy();
      this.coinscore = this.coinscore +1
       this.coinscoretext.setText("Coin Score:" + this.coinscore)
    })




    this.anims.create({
      key: 'player_idle',
      frames: this.anims.generateFrameNumbers('player_idle', {
        start: 0,
        end: 10
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'player_run',
      frames: this.anims.generateFrameNumbers('player_run', {
        start: 0,
        end: 12
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'player_jump',
      frames: this.anims.generateFrameNumbers('player_run', {
        frames: [0]
      }),
      frameRate: 1,
      repeat: 0,
    });

    this.anims.create({
      key: 'player_fall',
      frames: this.anims.generateFrameNumbers('player_run', {
        frames: [4]
      }),
      frameRate: 1,
      repeat: 0,
    });

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Keys
    this.keys = this.input.keyboard?.createCursorKeys()!;
  }
  playerDebug: boolean = true;
  update(): void {
    this.player.setVelocityX(0);

    if (this.keys.right.isDown) {
      this.player.setVelocityX(300);
      this.player.setFlipX(false);
      this.player.anims.play('player_run', true);
    }
    if (this.keys.left.isDown) {
      this.player.setVelocityX(-300);
      this.player.setFlipX(true);
      this.player.anims.play('player_run', true);
    }

    if (this.keys.up.isDown && this.player.body?.blocked.down) {
      this.player.setVelocityY(-335);
      this.player.anims.play('player_jump');
    }
    // We're falling
    if (this.player.body?.velocity.y! > 20) {
      this.player.anims.play('player_fall');
    }
    else if (this.player.body?.velocity.length() == 0 && this.player.body.blocked.down) {
      if (!this.player.anims.isPlaying) {
        this.player.anims.play('player_idle', true);
      }
    }
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
      gravity: { y: 400 },
      debug: false
    }
  },
  width: 1440,
  height: 800,
  transparent: true,
  scene: [Menu, PlayGame],
  pixelArt: true
};

export default new Phaser.Game(config);
