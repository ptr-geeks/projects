import Phaser, { Scene } from 'phaser';


enum ImageNames {
  Car = 'phaser3-logo',
  background = 'background',
  tilemap = 'tilemap',
  cloud = 'cloud',
  cloud2 = 'cloud2',
  house = 'house',
  main = 'main',
  button = 'button'
}



class PlayGame extends Phaser.Scene {
  walls: Phaser.Physics.Arcade.StaticGroup
  cloud: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  cloud2: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  car: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  background: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  button: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  tilemap: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  main: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  playing = ""
  speed = 0
  rotation = 0
  keys: any;
  doScale: boolean = true;
  maxspeed = 1000
  maxrotation = 0.04
  kmh = 0
  candraw = 0
  rotationspeed = 0.0001
  time1 = 0
  cantime = 0
  highscore = 0
  text1: Phaser.GameObjects.Text
  text2: Phaser.GameObjects.Text
  constructor() {
    super('PlayGame');
  }
  preload(): void {
    this.load.image(ImageNames.Car, 'assets/car.png');
    this.load.image(ImageNames.tilemap, 'assets/tilemap.png');
    this.load.image(ImageNames.cloud, 'assets/cloud.png');
    this.load.image(ImageNames.cloud2, 'assets/cloud2.png');
    this.load.image(ImageNames.main, 'assets/main2.png');
    this.load.image(ImageNames.button, 'assets/button.png');
    this.load.tilemapTiledJSON("map", "assets/Background2.json")
    this.load.image("spritesheet", "assets/spritesheet_tiles.png")
  }

  createWall(x: number, y: number, w: number, h: number): Phaser.GameObjects.Rectangle{
    return this.add.rectangle(x, y, w, h, 0x00FF00).setOrigin(0);
  }


  create(): void {
    this.tilemap = this.physics.add.image(800, 440, ImageNames.tilemap)
    .setScale(10, 10)

    const map = this.add.tilemap("map")
    const tileset = map.addTilesetImage("1", "spritesheet")!
    const roadLayer = map.createLayer("Proga", tileset, -200, -800)?.setScale(4)
    const offRoadLayer = map.createLayer("Offroad", tileset, -200, -800)?.setScale(4)

    map.setCollision([150, 220, 86, 65])

    this.car = this.physics.add.image(7997, 2537, ImageNames.Car)
    .setCollideWorldBounds(false, 0.1, 0.1)
    .setScale(0.1, 0.1)
    .setRotation(-1.57)

    this.car.body.setSize(500, 500);

    this.playing = " "

    this.main = this.physics.add.image(0, 0, ImageNames.main)
    .setCollideWorldBounds(false, 0.1, 0.1)
    .setOrigin(0)
    .setScale(1.75, 1.75)
    this.main.setVisible(true)

    this.button = this.physics.add.image(-600, -35, ImageNames.button)
    .setCollideWorldBounds(false, 0.1, 0.1)
    .setScale(0.3, 0.3)
    .setOrigin(0)

    this.main.setVisible(true)

    this.physics.add.collider(this.car, offRoadLayer!, () => this.speed = 0 )

    this.cloud = this.physics.add.image(-2000, 1500, ImageNames.cloud)
    .setCollideWorldBounds(false, 0.1, 0.1)
    .setScale(1, 1)

    this.cloud2 = this.physics.add.image(7000, 3000, ImageNames.cloud2)
    .setCollideWorldBounds(false, 0.1, 0.1)
    .setScale(5, 5)

    this.cameras.main.setBackgroundColor("#388004");
  
    this.keys = this.input.keyboard?.addKeys('W,A,S,D,E,G,space')!;
    this.cameras.main.setBounds(-1000, -1000, 12000, 7000);

    this.walls = this.physics.add.staticGroup();
    
    this.walls.add(this.createWall(4084,2000,3500,40)).setOrigin(0)
    this.walls.add(this.createWall(336,2977,2000,40)).setOrigin(0)
    this.walls.add(this.createWall(3456,4050,4000,40)).setOrigin(0)
    this.walls.add(this.createWall(3456,4050,500,40)).setOrigin(0)
    this.walls.add(this.createWall(7740,2777,500,40)).setOrigin(0)
    this.walls.setVisible(false)

    this.physics.add.collider(this.walls, this.car,  () => this.speed = 0 )


    const ui = this.scene.add("UI", {
      key: "UI",
      active: true
    })!;
    this.text1 = ui.add.text(10, 9, "", { font: "40px Arial"})
    this.text2 = ui.add.text(10, 50, "", { font: "40px Arial"})
  }
  update(): void {
    
    if(this.playing == " "){
      this.button.setOrigin(0.5)
      this.main.setOrigin(0.5)
      this.car.setRotation(-1.57)
      this.cameras.main.startFollow(this.main);
      this.text1.setVisible(false)
      this.text2.setVisible(false)
      this.cantime = 1
      this.main.setVisible(true)
      this.button.setVisible(true)
      this.time1 = 0
      this.cloud.setX(-2000)
      this.cloud.setY(1500)
      this.cloud2.setX(7000)
      this.cloud2.setY(3000)
    }
    this.text1.setText("Time: " + this.time1)
    this.text2.setText("Highscore: " + this.highscore)

    if(this.cantime == 2){
      this.time1 += 1
    }
    if(this.keys.space.isDown && this.playing == " "){
      this.playing = "playing"
      this.cantime = 1
      this.car.setX(7997)
      this.car.setY(2537)
    }
    if(this.playing == "playing"){

      if(this.keys.G.isDown){
        this.speed = 0
        this.car.setRotation(1.57)
        this.playing = " "
        this.cameras.main.startFollow(this.main);
        this.main.setOrigin(0.5)
        
      
      }
      
      this.text1.setVisible(true)
      this.text2.setVisible(true)
      this.main.setVisible(false)
      this.button.setVisible(false)

      if(this.car.y < 2158 && this.car.y > 2000 && this.car.x > 7852 && this.cantime == 1){
        this.cantime = 2
        this.text2.setVisible(false)
      }
  
      if(this.car.y < 2977 && this.cantime == 2 && this.car.y > 2877 && this.car.x > 7852){
        if(this.time1 < this.highscore){
          this.highscore = this.time1
        }
        if(this.highscore == 0){
          this.highscore = this.time1
        }
        this.car.setY(2500)
        this.cantime = 1
        this.text2.setVisible(true)
        this.time1 = 0
        this.speed = 0
      }

        this.cameras.main.startFollow(this.car);

        this.cloud.x += 0.7
        this.cloud.y -= 1

        this.cloud2.x -= 0.5
        this.cloud2.y -= 1

        console.log(this.car.x, this.car.y, this.car.rotation)

        if(this.cloud.x > 6000){
          this.cloud.setX(-2000)
          this.cloud.setY(1500)
        }

        if(this.cloud2.x < -3000){
          this.cloud2.setX(7000)
          this.cloud2.setY(3000)
        }

        this.car.setVelocity(0);
        const vel = this.physics.velocityFromRotation(this.car.rotation, this.speed, this.car.body.velocity);
        this.car,
        this.car.rotation += this.rotation

        if(this.rotation > this.maxrotation){
          this.rotation -= 0.001
        }

        if(this.rotation < this.maxrotation * -1){
          this.rotation += 0.001
        }

        if(this.keys.D.isUp){
          if(this.rotation > 0){
            this.rotation -= 0.0009
          }
        }

        if(this.keys.A.isUp){
          if(this.rotation < 0){
            this.rotation += 0.0005
          }
        }

        if(this.keys.W.isUp){
          this.candraw = 0
        }

        if(this.rotation < this.maxrotation * -1){
          this.rotation = -0.5
        }

        if(this.speed > this.maxspeed){
          this.speed = this.maxspeed
        }

        if(this.speed < -this.maxspeed){
          this.speed = -this.maxspeed
        }

        if(this.speed > 0){
          this.speed -= 2
        }

        if(this.speed < 0){
          this.speed += 2
        }

        if(this.keys.S.isDown){
          this.speed -= 5
        }

        if(this.keys.W.isDown){
          this.speed += 5
          this.kmh++
          this.candraw = 1
        }

        if(this.keys.D.isDown){
          if(this.speed != 0){
            this.rotation += this.rotationspeed
          }
        }

        if(this.keys.A.isDown){
          if(this.speed != 0){
            this.rotation -= this.rotationspeed
          }
        }

        if(this.keys.space.isDown){
          if(this.speed > 9.9){
            this.speed -= 10 
          }
      
          if(this.speed < -9.9){
            this.speed += 10
          }
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
      gravity: { y: 0 },
      debug: false
    }
  },
  width: 1707,
  height: 870,
  transparent: false,
  
  scene: PlayGame,
};

export default new Phaser.Game(config);