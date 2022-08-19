import * as Phaser from 'phaser';
import Player from '../objects/player'
var key = false;
var ynak;
var tst = 1;
var dead = 0;
var keyY;
var cursors;

export default class level3 extends Phaser.Scene {
    constructor() {
      super({ key: 'level3' });
    }
    
    preload(){
    }
    create(){
      //fade in
      this.cameras.main.fadeIn(500);

      //background
      this.background = this.add.tileSprite(-500, -900, 2240, 0, 'background').setDepth(-100)
      .setOrigin(0, 0)
      .setScrollFactor(0.5, 0)
      .setDepth(-100);
        
      //images, sprites,...
      const platforma = this.physics.add.image(0,320, 'lvl3').setOrigin(0,0);
      this.player = new Player(this, 0, 260).setOrigin(0,0);
        
      //physics for this.player
      this.player.setBounce(0, 0);
      this.player.setCollideWorldBounds(false);
      this.player.setGravityY(850);
      this.player.setFrictionX(1);

      //physics for platforma
      platforma.setGravityY(0)
      platforma.setGravity(false);
      platforma.setImmovable(true);

      //colliders
      this.physics.add.collider(this.player, platforma);
      
      //camera follow
      this.cameras.main.startFollow(this.player, true, 0.05, 1, 0, 4);
      this.cameras.main.setBounds(0, -400,  3520, 1024);
        
      //keyboard input
      cursors = this.input.keyboard.createCursorKeys();
      keyY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);

      this.tls = this.physics.add.group({ allowGravity: false, immovable: true,});
      this.spks = this.physics.add.group({ allowGravity: false, immovable: true,});
      this.tls.createMultiple({ key: 'tl3', quantity: 5, setXY: {x: 352, y: 288, stepX: 192, stepY: -64}});
      this.tls.createMultiple({ key: 'tl3', quantity: 3, setXY: {x: 1312, y: 32, stepX: 192, }});
      this.tls.createMultiple({ key: 'tl3', quantity: 2, setXY: {x: 1952, y: 156, stepX: 192, }});
      this.tls.createMultiple({ key: 'tl3', quantity: 2, setXY: {x: 2464, y: 288, stepX: 256, }});
      this.tls.createMultiple({ key: 'tl3', quantity: 3, setXY: {x: 2912, y: 220, stepX: 192, stepY: -64}});
      this.tls.createMultiple({ key: 'tl3', quantity: 3, setXY: {x: 3360, y: 92, stepX: 64}});
      this.spks.createMultiple({ key: 'spike_c', quantity: 25, setXY: {x: 416, y: 305, stepX: 64}});
      this.spks.createMultiple({ key: 'spike_c', quantity: 2, setXY: {x: 1952, y: 109, stepX:192}});
      this.spks.createMultiple({ key: 'spike_c', quantity: 1, setXY: {x: 2213, y: 305, stepX:192}});
      this.spks.createMultiple({ key: 'spike_c', quantity: 3, setXY: {x: 2528, y: 305, stepX:64}});
      this.spks.createMultiple({ key: 'spike_c', quantity: 12, setXY: {x: 2784, y: 305, stepX:64}});
      this.physics.add.collider(this.player, this.tls);
      this.physics.add.collider(this.player, this.spks, function(){dead = 1});
      this.dr1 = this.physics.add.image(3456,-68, 'dr1').setOrigin(0, 0).setImmovable(true).setDepth(-50);
      this.key1 = this.physics.add.image(2190,156, 'key1').setOrigin(0,0).setImmovable(true);
      
    }
       
    update(){  
      //key destroy if touched
      if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.key1.getBounds()) == true) { 
        this.key1.destroy();
        this.key = true;
      }

      //if player dies, this scene restarts
      if(dead == 1){
        this.scene.run('yd');
        this.scene.restart();
        dead = 0;
      }
      
      //teleport shortcut  
      // if(keyY.isDown){
      //   this.player.x = 2048;
      //   this.player.y = 128;
      // }

      //movement limit
      if (this.player.x < 0) {
        this.player.x = 0;
      }

      //movement limit 
      if (this.player.x > 3460) {
        this.player.x = 3460;
      }

      //door texture == door closed, if player isn't touching the door
      if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.dr1.getBounds()) == false) { 
        this.dr1.setTexture('dr1');
      }

      if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.dr1.getBounds()) == true && this.key == true) {
        this.dr1.setTexture('dr2');
        if(tst == 1){
          this.cameras.main.fadeOut(1000, 0, 0, 0)
          this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
          this.scene.start('end')
        })
        tst = 0;
        }
      }
    }
    preUpdate() {
      this.background.setTilePosition(this.scene.cameras.main.scrollX * 0.2);
    }
}