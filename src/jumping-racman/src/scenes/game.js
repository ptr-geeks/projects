import * as Phaser from 'phaser';
import Player from '../objects/player';
import UI from './ui';


var cas = 0;
window.cas = cas;

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
    this.jump = 1;
  }

  preload() {
  }

  create() {
    this.background = this.add.tileSprite(-200, 100, 0, 0, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0.5, 0)
      .setScale(0.4, 0.4)
      .setDepth(-100);

      const World = this.make.tilemap({key: 'World'});
      const Mapa = World.addTilesetImage('MAPA', 'sprites');
      
      this.world = World.createLayer('World', Mapa);
      this.world.setCollisionByExclusion(-1, true);
      
     // text = this.add.text(32, 32);
     
/*
      var x = 135;
      var mapa = [0, 1, 1, 0, 1, 0]
      for (let i = 0; i < mapa.length; i++) {
        if(mapa[0] == 1)
        {

          platforms = this.physics.add.staticGroup();
          platforms.create(x, 300, 'sprites', [1]);
          x + 64;
          
        }
       }
*/
    this.diamond = this.physics.add.sprite(-125, game.config.height - 3590, 'diamant')
       .setScale(0.1)
       .setImmovable(true);
      this.diamond.body.allowGravity = false;
      
      /*this.rumeno = this.physics.add.sprite(85, game.config.height - 269, 'rumeno')
      .setScale(0.1)
      .setImmovable(true);
     this.rumeno.body.allowGravity = false;*/


    //diamant.body.onOverlap = true;
    //this.physics.add.overlap(Player, diamant, Oool, null, this);
   // let teran = this.physics.add.group({ allowGravity: false, immovable: true });
    //teran.createMultiple({ key: 'sprites', frame: 1, frameQuantity: 5, repeat: 0 });

   // Phaser.Actions.SetXY(teran.getChildren(), 350, game.config.height - 170, 64);


    //this.testTile = this.physics.add.sprite(100, game.config.height - 96 - 16 - 64, 'sprites', 2);
    //this.testTile.body.setAllowGravity(false);
    //this.testTile.setBounce(0, 0.5);

    this.player = new Player(this, 32, game.config.height - 96);
    this.physics.add.collider(this.player, this.world);
   /* this.physics.add.collider(this.player, this.rumeno,(obj1, obj2) => {
      this.jump++;
      this.rumeno.destroy();
    });*/
    this.physics.add.collider(this.player, this.diamond, (obj1, obj2) => {
      this.event.paused = true;
      this.scene.get('ui').gameOver();
    });
    
    /*text.setText([
      'Your final time vas' + this.cas,
  ]);*/

    //this.physics.add.collider(this.player, this.testTile, this.bounceTile);

    
    this.scene.run('ui');
    this.event = this.time.addEvent({ delay: 1000, callback: pristejesec, callbackScope: this, repeat: -1, startAt: 0 });

    function pristejesec(){
      this.scene.get('ui').updateCas();
    }

  
    


  }




 
}
/*function Oool() 
{
 console.log("dela");
}*/