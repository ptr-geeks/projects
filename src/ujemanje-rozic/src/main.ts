import Phaser from 'phaser'; 

enum ImageNames {
  kosarica1 = 'kosarica1',
  kosarica2 = 'kosarica2',
  rozica = 'rozica',
  rozica2 = 'rozica2',
  rozica3 = 'rozica3',
  Lrozica = 'rozica',
  Lrozica2 = 'rozica2',
  Lrozica3 = 'rozica3',
  nebo = 'odzadje',
  rozice1 = 'rozice1',
  rozice2 = 'rozice2',
  rozice3 = 'rozice3',
  bomba = 'bomba',
  bonus = 'bonus',
  Lbonus = 'bonus',
  Lbomba = 'bomba',
  zlati = 'zlati'
}
let a = 0, n = 0, m = 0, l = 0;
class PlayGame extends Phaser.Scene {
  image1: Phaser.Physics.Arcade.Image;
  player1Score: number = 0;
  player2Score: number = 0;
  scoreText: Phaser.GameObjects.Text;
  image2: Phaser.Physics.Arcade.Image;
  nebo: Phaser.GameObjects.Image;
  roza: Phaser.Physics.Arcade.Image;
  //rozeSeznam: Phaser.Physics.Arcade.Image[] = [];
  roza2: Phaser.Physics.Arcade.Image;
  roza3: Phaser.Physics.Arcade.Image;
  bon : Phaser.Physics.Arcade.Image;
  Lbon : Phaser.Physics.Arcade.Image;
  Lroza: Phaser.Physics.Arcade.Image;
  //rozeSeznam: Phaser.Physics.Arcade.Image[] = [];
  Lroza2: Phaser.Physics.Arcade.Image;
  Lroza3: Phaser.Physics.Arcade.Image;
  floor: Phaser.GameObjects.Rectangle;
  crta: Phaser.GameObjects.Rectangle;
  rozice1:  Phaser.Physics.Arcade.Image;
  rozice2: Phaser.Physics.Arcade.Image;
  rozice3: Phaser.Physics.Arcade.Image;
  listki: Phaser.Physics.Arcade.Image;
  bomba: Phaser.Physics.Arcade.Image;
  Lbomba: Phaser.Physics.Arcade.Image;
  score: Phaser.GameObjects.Text;
  timeLeft: number = 45; // Skupni čas v sekundah
  timeText: Phaser.GameObjects.Text;
  timer: Phaser.Time.TimerEvent;
  keys: any;
  
  constructor() {
    super('PlayGame');
  }
  preload(): void {
    this.load.image(ImageNames.kosarica1, 'assets/kosarica1.png');
    this.load.image(ImageNames.kosarica2, 'assets/kosarica2.png');
    this.load.image(ImageNames.bonus, 'assets/bonus.png');
    this.load.image(ImageNames.Lbonus, 'assets/bonus.png');
    this.load.image(ImageNames.rozica, 'assets/rozica.png');
    this.load.image(ImageNames.rozica2, 'assets/rozica2.png');
    this.load.image(ImageNames.rozica3, 'assets/rozica3.png');
    this.load.image(ImageNames.Lrozica, 'assets/rozica.png');
    this.load.image(ImageNames.Lrozica2, 'assets/rozica2.png');
    this.load.image(ImageNames.Lrozica3, 'assets/rozica3.png');
    this.load.image(ImageNames.nebo, 'assets/odzadje.jpg');
    this.load.image(ImageNames.rozice1, 'assets/rozice1.png');
    this.load.image(ImageNames.rozice2, 'assets/rozice2.png');
    this.load.image(ImageNames.rozice3, 'assets/rozice3.png');
    this.load.image(ImageNames.bomba, 'assets/bomba.jpg.png');
    this.load.image(ImageNames.Lbomba, 'assets/bomba.jpg.png');
    this.load.image(ImageNames.zlati, 'assets/zlati.png');
    this.load.audio('backgroundMusic', 'assets/background_music.mp3');
  }
  create(): void {
    this.nebo = this.add.image(900, 360, ImageNames.nebo)
      .setScale(5, 4);
    this.rozice1 = this.physics.add.staticImage(850, 400, ImageNames.rozice1);
    this.rozice2 = this.physics.add.staticImage(850, 720, ImageNames.rozice2);
    this.rozice3 = this.physics.add.staticImage(850, 80, ImageNames.rozice3);

    // glasba
    const music = this.sound.add('backgroundMusic', { loop: true, volume: 0.5 });
    music.play();

    // Score text
    this.score = this.add.text(this.cameras.main.centerX, 10, '0 : 0')
      .setFontFamily('Arial')
      .setFontSize(60)
      .setColor('rgba(0, 0, 0, 1)')
      .setOrigin(0.5, 0)
    this.updateScoreBoard();

    //this.crta = this.add.rectangle(850, 200, 20, 1360, 0x000000)
    //this.physics.add.existing(this.crta, true),
    this.floor = this.add.rectangle(0, 900, 4000, 40, 0x4CAF50);
    this.physics.add.existing(this.floor, true);
    this.image1 = this.physics.add.image(1300, 790, ImageNames.kosarica1)
      .setCollideWorldBounds()
      .setScale(0.4, 0.3);
    this.image1.body!.onCollide = true;
    this.image2 = this.physics.add.image(400, 790, ImageNames.kosarica2)
      .setCollideWorldBounds()
      .setScale(0.4, 0.3);
    this.image2.body!.onCollide = true;

    const spawnPinkFlower = () => {
      /*this.rozeSeznam.push(this.physics.add.image(Math.random() * 830, 0, ImageNames.rozica)
      .setScale(0.2, 0.2));*/
      this.Lroza = this.physics.add.image(Math.random() * 830, 0, ImageNames.Lrozica)
        .setScale(0.12, 0.12);
      this.Lroza.y += 2;
      a++;
    
      if (a < 28) {
        this.time.delayedCall(1500, spawnPinkFlower, [], this);
      }
    };
    spawnPinkFlower();
    let Dbon = 0;
    const bonusFlower = () => {
      /*this.rozeSeznam.push(this.physics.add.image(Math.random() * 830, 0, ImageNames.rozica)
      .setScale(0.2, 0.2));*/
      this.bon = this.physics.add.image(Math.random() * 830, 0, ImageNames.bonus)
        .setScale(0.12, 0.12);
      this.bon.y += 2;
      Dbon++;
    
      if (Dbon < 2) {
        this.time.delayedCall(20000, bonusFlower, [], this);
      }
    };
    bonusFlower();
    let Lbon1 = 0;
    const bonus1Flower = () => {
      /*this.rozeSeznam.push(this.physics.add.image(Math.random() * 830, 0, ImageNames.rozica)
      .setScale(0.2, 0.2));*/
      this.Lbon = this.physics.add.image(880 + Math.random() * (1700 - 880), 0, ImageNames.Lbonus)
        .setScale(0.12, 0.12);
      this.Lbon.y += 2;
      Lbon1++;
    
      if (Lbon1 < 2) {
        this.time.delayedCall(30000, bonus1Flower, [], this);
      }
    };
    bonus1Flower();
    let v = 0;
    const spawnPinkFlower4 = () => {
      this.Lroza2 = this.physics.add.image(Math.random() * 830, 0, ImageNames.Lrozica2)
        .setScale(0.07, 0.07);
      this.Lroza2.y += 2;
    
      v++;
    
      if (v < 15) {
        this.time.delayedCall(2500, spawnPinkFlower4, [], this);
      }
    };
    spawnPinkFlower4();
    let c = 0;
    const spawnPinkFlower5 = () => {
    
      this.Lroza3 = this.physics.add.image(Math.random() * 830, 0, ImageNames.Lrozica3)
        .setScale(0.09, 0.09);
      this.Lroza3.y += 2;
    
      c++;
    
      if (c < 20) {
        this.time.delayedCall(2000, spawnPinkFlower5, [], this);
      }
    };
    spawnPinkFlower5();

    const spawnPinkFlower1 = () => {
      this.roza = this.physics.add.image(880 + Math.random() * (1700 - 880), 0, ImageNames.rozica)
        .setScale(0.12, 0.12);
        
      this.roza.y += 2;
    
      n++;
    
      if (n < 28) {
        // Če a še ni doseženo 50, počakamo 2000 milisekund (2 sekundi) in nato ponovno kličemo funkcijo spawnPinkFlower1
        this.time.delayedCall(1500, spawnPinkFlower1, [], this);
      }
    };
    
    spawnPinkFlower1();

    const spawnPinkFlower2 = () => {
      this.roza2 = this.physics.add.image(880 + Math.random() * (1700 - 880), 0, ImageNames.rozica2)
        .setScale(0.07, 0.07);
      this.roza2.y += 3; 
    
      m++;
    
      if (m < 15) {
        this.time.delayedCall(2500, spawnPinkFlower2, [], this);
      }
    };
    spawnPinkFlower2();

    const spawnPinkFlower3 = () => {
    
      this.roza3 = this.physics.add.image(880 + Math.random() * (1700 - 880), 0, ImageNames.rozica3)
        .setScale(0.09, 0.09);
      this.roza3.y += 1; 
    
      l++;
    
      if (l < 20) {
        this.time.delayedCall(2000, spawnPinkFlower3, [], this);
      }
    };
    spawnPinkFlower3();
    let b = 0;
    const bomba1 = () => {
    
      this.bomba = this.physics.add.image(880 + Math.random() * (1700 - 880), 0, ImageNames.bomba)
        .setScale(0.15, 0.15);
      this.roza.y += 1;
    
      b++;
    
      if (b < 40) {
        if(b > 20 && b){
          this.time.delayedCall(900, bomba1, [], this);
        }else if(b > 10){
          this.time.delayedCall(1000, bomba1, [], this);
        }else{
          this.time.delayedCall(1200, bomba1, [], this);
        }
      }
    };
    bomba1();
    let b1 = 0;
    const bomba2 = () => {
    
      this.Lbomba = this.physics.add.image(Math.random() * 830, 0, ImageNames.Lbomba)
        .setScale(0.15, 0.15);
      this.Lroza.y += 1;
    
      b1++;
    
      if (b1 < 40) {
        if(b1 > 20){
          this.time.delayedCall(900, bomba2, [], this);
        }else if(b1 > 10){
          this.time.delayedCall(1000, bomba2, [], this);
        }else{
          this.time.delayedCall(1200, bomba2, [], this);
        }
      }
    };
    bomba2();


      
      this.physics.add.collider(this.floor, this.image1);
      this.physics.add.collider(this.floor, this.image2);
      this.physics.add.collider(this.floor, this.rozice1);
      this.physics.add.collider(this.rozice2, this.image1);
      this.physics.add.collider(this.rozice2, this.image2);
      this.physics.add.collider(this.rozice1, this.rozice2);
      this.physics.add.collider(this.rozice1, this.rozice3);
      this.physics.add.collider(this.floor, this.rozice2);
      this.physics.add.collider(this.floor, this.rozice3);
      this.keys = this.input.keyboard?.addKeys('a,d, left, right');

        // Za desno stran (image1)
        this.physics.world.on('collide', (gameObject1: any, gameObject2: any, body1: any, body2: any) => {
          if (gameObject1.texture === this.image1.texture) {
              // Tu zaznajte in štejte trke samo za rože na desni strani
              if (gameObject2.texture === this.roza.texture || gameObject2.texture === this.roza2.texture || gameObject2.texture === this.roza3.texture) {
                  this.player1Score++;
                  this.updateScoreBoard();
                  gameObject2.destroy();
              }
              if(gameObject2.texture === this.bon.texture) {
                this.player1Score+=10;
                this.updateScoreBoard();
                gameObject2.destroy();
              }
          }
        });

        // Za levo stran (image2)
        this.physics.world.on('collide', (gameObject1: any, gameObject2: any, body1: any, body2: any) => {
          if (gameObject1.texture === this.image2.texture) {
              // Tu zaznajte in štejte trke samo za rože na levi strani
              if (gameObject2.texture === this.Lroza.texture || gameObject2.texture === this.Lroza2.texture || gameObject2.texture === this.Lroza3.texture) {
                  this.player2Score++;
                  this.updateScoreBoard();
                  gameObject2.destroy();
              }
              if(gameObject2.texture === this.Lbon.texture) {
                this.player2Score+=10;
                this.updateScoreBoard();
                gameObject2.destroy();
              }
          }
        });
        // Za desno stran (image1)
        this.physics.world.on('collide', (gameObject1: any, gameObject2: any, body1: any, body2: any) => {
          if (gameObject1.texture === this.image1.texture) {
              // Preveri, ali se igralec zaleti v bombo na desni strani
              if (gameObject2.texture === this.bomba.texture) {
                  this.player1Score = 0;
                  this.updateScoreBoard();
                  gameObject2.destroy();
              }
              // Preveri, ali se zaleti v rože na desni strani
              else if (gameObject2.texture === this.roza.texture || gameObject2.texture === this.roza2.texture || gameObject2.texture === this.roza3.texture) {
                  this.player1Score++;
                  this.updateScoreBoard();
                  gameObject2.destroy();
              }
          }
        });

        // Za levo stran (image2)
        this.physics.world.on('collide', (gameObject1: any, gameObject2: any, body1: any, body2: any) => {
          if (gameObject1.texture === this.image2.texture) {
              // Preveri, ali se igralec zaleti v bombo na levi strani
              if (gameObject2.texture === this.Lbomba.texture) {
                  this.player2Score = 0;
                  this.updateScoreBoard();
                  gameObject2.destroy();
              }
              // Preveri, ali se zaleti v rože na levi strani
              else if (gameObject2.texture === this.Lroza.texture || gameObject2.texture === this.Lroza2.texture || gameObject2.texture === this.Lroza3.texture) {
                  this.player2Score++;
                  this.updateScoreBoard();
                  gameObject2.destroy();
              }
          }
        });
         // Prikaz časa (DODAJTE TE VRSTICE)
    this.timeText = this.add.text(20, 20, `Time: ${this.timeLeft}`, {
      fontFamily: 'Fira Code',
      fontSize: '24px',
      color: 'rgba(0, 0, 0, 1)',
    });

    // Začnite odštevanje časa (DODAJTE TE VRSTICE)
    this.timer = this.time.addEvent({
      delay: 1000, // 1 sekunda
      callback: this.updateTime,
      callbackScope: this,
      loop: true,
    });
  }
  update(): void {
    this.physics.add.collider(this.image1, this.roza);
    this.physics.add.collider(this.image1, this.roza2);
    this.physics.add.collider(this.image2, this.bon);
    this.physics.add.collider(this.image1, this.Lbon);
    this.physics.add.collider(this.image1, this.roza3);
    this.physics.add.collider(this.image2, this.Lroza);
    this.physics.add.collider(this.image2, this.Lroza2);
    this.physics.add.collider(this.image2, this.Lroza3);
    this.physics.add.collider(this.image1, this.bomba);
    this.physics.add.collider(this.image2, this.Lbomba);
    this.image1.setVelocityX(0);
    this.image2.setVelocityX(0);

    if (this.keys.a.isDown && this.image2.x > 0) {
      this.image2.setVelocityX(-400);
    }

    if (this.keys.d.isDown && this.image2.x < this.cameras.main.height - 100) {
      this.image2.setVelocityX(400);
    }
  
    if(this.keys.right.isDown) {
      this.image1.setVelocityX(400);
    } 
    if(this.keys.left.isDown) {
      this.image1.setVelocityX(-400);
    }
  }
  updateScoreBoard(): void {
    this.score.setText(`${this.player2Score} : ${this.player1Score}`)
  }
  updateTime(): void {
    this.timeLeft--;
    this.timeText.setText(`Time: ${this.timeLeft}`);
  
    if (this.timeLeft === 0) {
      // Čas je potekel, zaustavite igro
      this.timer.destroy();
      //this.physics.pause();
  
      // Določite zmagovalca glede na rezultate
      let winner: string;
      if (this.player1Score > this.player2Score) {
        winner = 'Igralec 2';
      } else if (this.player2Score > this.player1Score) {
        winner = 'Igralec 1';
      } else {
        winner = 'Tie';
      }
      if(winner == 'Igralec 1'){
        let f = 0;
        const spawnPinkFlower8 = () => {
          this.roza = this.physics.add.image(Math.random() * 830, 0, ImageNames.rozica)
            .setScale(0.07, 0.07);
          this.roza.y += 2;
        
          f++;
        
          if (f < 100) {
            this.time.delayedCall(100, spawnPinkFlower8, [], this);
          }
        }; 
        spawnPinkFlower8();
      }else if(winner == 'Igralec 2'){
        let d = 0;
        const spawnPinkFlower7 = () => {
          this.Lroza = this.physics.add.image(880 + Math.random() * (1700 - 880), 0, ImageNames.Lrozica)
            .setScale(0.07, 0.07);
          this.Lroza.y += 2;
        
          d++;
        
          if (d < 100) {
            this.time.delayedCall(100, spawnPinkFlower7, [], this);
          }
        }; 
        spawnPinkFlower7();
      }
        // Pripravite besedilo glede na zmagovalca
        const resultText = winner === 'Tie' ? "Izenaceno!" : `${winner} je zmagal!`;
        // Prikaz rezultata na sredini zaslona
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, resultText, {
          fontFamily: 'Fira Code',
          fontSize: '80px',
          color: 'rgba(0, 0, 0, 1)',
        }).setOrigin(0.5);
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
      gravity: { y: 100 },
    }
  },
  width: 1700,
  height: 950,
  transparent: true,
  scene: PlayGame,
}

export default new Phaser.Game(config);