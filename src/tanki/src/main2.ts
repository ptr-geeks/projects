import Phaser from 'phaser';

enum ImageNames {
  PhaserLogo = 'phaser3-logo'
}

class PlayGame extends Phaser.Scene {
  image: Phaser.GameObjects.Image;
  doscale: boolean = true;
  doposition: boolean = true

  constructor() {
    super('PlayGame');
  }
  preload(): void {
    this.load.image(ImageNames.PhaserLogo, 'assets/phaser3-logo.png');
  }
  create(): void {
    this.image = this.physics.add.image(400, 300, ImageNames.PhaserLogo)   
    .setScale(0.5,0.5)
    .setFlip(true,true)
    .setRotation(-Math.PI/8);
    //.setOrigin(0.7);
    
    
    
    
  }
  update(): void {
   //this.image.rotation += 0.01;
   
   if (this.image.scale < 0.195){
    this.image.setRandomPosition(1,1)
   
   }
   
    
    
    
   if (this.doscale){
    
    if(this.image.scale > 1){
      this.doscale=false
    }
      this.image.scale+=0.002;
      this.image.rotation += 0.01;
   }
   else{
    if(this.image.scale <0.2){
    this.doscale = true;
    }
    this.image.scale -=0.004
    this.image.rotation -= 0.01;
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
      debug: true
    }
  },
  width: 800,
  height: 600,
  transparent: true,
  scene: PlayGame,
};

export default new Phaser.Game(config);
//if (this.doposition){
 // if(this.image.){
  //  this.doposition=false
 // }
 //   this.image.setPosition(4,4);
    
// }
// else{
 // if(this.image.){
//  this.doposition = true;
 // }
  
// }
