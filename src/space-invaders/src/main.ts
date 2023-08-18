import Phaser, { Scene } from 'phaser';

enum ImageNames {
  PhaserLogo = 'ship',
  Enemy = 'enemy',
  Scene = 'scene',
  Bullet = 'bullet',
}

const NUMBER_OF_ALIENS = 108;
const ALIENS_PER_LINE = 18;

class PlayGame extends Phaser.Scene {
  image: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  enemy: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  Enemy: Phaser.Physics.Arcade.StaticGroup;
  Bullet: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  BulletGroup: Phaser.Physics.Arcade.Group;
  score: number = 0;
  scoreText: Phaser.GameObjects.Text;

  maxBullets: number = 5;
  currentBullets: number = 0;
  shootingCooldown: number = 3000; // 3000 milliseconds (3 seconds)
  lastShotTime: number = 0;

  keyA: Phaser.Input.Keyboard.Key;
  keyD: Phaser.Input.Keyboard.Key;
  keys: any;

  spaceWasPressed = false;
  moveVelocity = 200;

  enemyDeathDelay: number = 1000; // 1000 milliseconds (1 second)
  enemyBullets: Phaser.Physics.Arcade.Group;

  timeElapsed: number = 0;

  constructor() {
    super('PlayGame');
  }

  preload(): void {
    this.load.image(ImageNames.PhaserLogo, 'assets/ship.png');
    this.load.image(ImageNames.Enemy, 'assets/enemy.png');
    this.load.image(ImageNames.Scene, 'assets/starfield.png');
    this.load.image(ImageNames.Bullet, 'assets/bullet.jpg');
  }

  createEnemies(): void {
    for (var i = 0; i < NUMBER_OF_ALIENS; i++) {
      const e = this.physics.add
        .image(60 * (i % ALIENS_PER_LINE), 40 * Math.floor(i / ALIENS_PER_LINE), ImageNames.Enemy)
        .setOrigin(0)
        .setCollideWorldBounds();
      e.setData('isDying', false);
      this.Enemy.add(e);
    }
  }

  create(): void {
    this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, ImageNames.Scene).setScale(2);
    this.image = this.physics.add.image(500, 860, ImageNames.PhaserLogo).setCollideWorldBounds(true);

    this.keys = this.input.keyboard?.addKeys('W,A,S,D,right,left,space');
    this.scoreText = this.add.text(16, 860, 'score: 0', { fontSize: '32px', color: '#FFFFFF' });

    this.Enemy = this.physics.add.staticGroup();
    this.createEnemies();
    this.BulletGroup = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();

    this.physics.add.overlap(this.Enemy, this.BulletGroup, (enemy, bullet) => {
      enemy.destroy();
      this.score = this.score + 10;
      this.scoreText.setText('score: ' + this.score);
      bullet.destroy();
    });

    this.physics.add.overlap(this.image, this.enemyBullets, (player, bullet) => {
      bullet.destroy(); 
      this.playerDie();
    });
  }

  update(_time: number, delta: number): void {
    this.image.setVelocityX(0);

    if (this.keys.A.isDown) {
      this.image.setVelocityX(-this.moveVelocity);
    }

    if (this.keys.D.isDown) {
      this.image.setVelocityX(this.moveVelocity);
    }

    if (this.keys.left.isDown) {
      this.image.setVelocityX(-100);
    }

    if (this.keys.right.isDown) {
      this.image.setVelocityX(100);
    }

    if (this.keys.space.isUp && this.spaceWasPressed) {
      this.spaceWasPressed = false;
    }

    if (this.time.now - this.lastShotTime > this.shootingCooldown) {
      this.currentBullets = 0;
    }

    if (this.keys.space.isDown && !this.spaceWasPressed) {
      const currentTime = this.time.now;

      if (this.currentBullets < this.maxBullets) {
        const bullet = this.physics.add.image(this.image.x, this.image.y, ImageNames.Bullet);
        this.BulletGroup.add(bullet);
        bullet.setVelocityY(-100);
        this.currentBullets++;
        this.lastShotTime = currentTime;
      }

      this.spaceWasPressed = true;
    }

    if (this.currentBullets >= this.maxBullets && this.time.now - this.lastShotTime > this.shootingCooldown) {
      this.currentBullets = 0;
    }

    if (this.timeElapsed > 1500) {
      this.timeElapsed -= 1500;
      this.updateEnemiesShooting(5);
    }

    this.timeElapsed += delta;
  }

  updateEnemiesShooting(numberOfShots: number) {
    let shotsFired = 0;
    let enemies = this.Enemy.getChildren();

    for (let enemy of enemies) {
      if (!enemy.getData('isDying') && Phaser.Math.Between(0, 100) < 8) {
        this.enemyShoot(enemy);
        shotsFired++;

        if (shotsFired > numberOfShots) {
          return;
        }
      }
    }
  }

  enemyShoot(object: Phaser.GameObjects.GameObject) {
    const enemy = object as Phaser.Physics.Arcade.Image;
    const bullet = this.physics.add.image(enemy.x, enemy.y, ImageNames.Bullet);
    this.enemyBullets.add(bullet);
    bullet.setVelocityY(100);
  }

  playerDie() {
    //this.image.destroy(); 
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Game Over', { fontSize: '48px', color: '#FF0000' }).setOrigin(0.5);
    this.game.pause() 
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
      debug: false,
    },
  },
  width: 1000,
  height: 900,
  transparent: true,
  scene: PlayGame,
};

export default new Phaser.Game(config);