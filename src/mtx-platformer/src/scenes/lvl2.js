import * as Phaser from 'phaser';
import Player from '../objects/player'

let keyS, keyY;
var cursors;
var tst = 1;
var dead = 0;

export default class level2 extends Phaser.Scene {
    constructor() {
      super({ key:'level2' });
      
    }
    
    preload(){
    }

    create(){
      //fade in
      this.cameras.main.fadeIn(500);

      //you need a key to open the door, to the next level
      this.key = false;

      //keyboard inputs
      cursors = this.input.keyboard.createCursorKeys();
      keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);  
      keyY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);

      //background
      this.background = this.add.tileSprite(-1000, -900, 2240, 0, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0.5, 0)
      .setDepth(-100);
        
      //images,...
      const platforma = this.physics.add.image(0,320, 'lvl2').setOrigin(0,0);
      this.dr1 = this.physics.add.image(2176,192, 'dr1').setOrigin(0, 0).setImmovable(true).setDepth(-50);
      this.key1 = this.physics.add.image(1300,260, 'key1').setOrigin(0,0).setImmovable(true);
      this.btn1 = this.physics.add.image(1504,208.5, 'btn1').setImmovable(true).setAngle(180)

      //sprite(player)
      this.player = new Player(this, 0, 260).setOrigin(0,0);

      //tiles
      var tls = [
        this.physics.add.image(384,256, 'tl2').setOrigin(0, 0).setImmovable(true), 
        this.physics.add.image(448,192, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(512,128, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(576,128, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(640,128, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(704,128, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(896,256, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(1088,192, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(1280,128, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(1472,128, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(1600,256, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(1728,256, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(1728,192, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(1856,256, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(1856,192, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(1856,128, 'tl2').setOrigin(0, 0).setImmovable(true),
        this.physics.add.image(1856,128, 'tl2').setOrigin(0, 0).setImmovable(true),
      ];

      //spikes
      var spks = [
        this.physics.add.image(704,256, 'spike').setOrigin(0,0).setImmovable(true).setSize(64,34).setOffset(0,30),
        this.physics.add.image(768,256, 'spike').setOrigin(0,0).setImmovable(true).setSize(64,34).setOffset(0,30),
        this.physics.add.image(832,256, 'spike').setOrigin(0,0).setImmovable(true).setSize(64,34).setOffset(0,30),
        this.physics.add.image(960,256, 'spike').setOrigin(0,0).setImmovable(true).setSize(64,34).setOffset(0,30),
        this.physics.add.image(1024,256, 'spike').setOrigin(0,0).setImmovable(true).setSize(64,34).setOffset(0,30),
        this.physics.add.image(1152,256, 'spike').setOrigin(0,0).setImmovable(true).setSize(64,34).setOffset(0,30),
        this.physics.add.image(1216,256, 'spike').setOrigin(0,0).setImmovable(true).setSize(64,34).setOffset(0,30),
        this.physics.add.image(1312,224, 'spike').setImmovable(true).setSize(64,34).setOffset(0,0).setAngle(180),
        this.physics.add.image(1568,288, 'spike').setImmovable(true).setSize(34,62).setOffset(30,0).setAngle(-90),
        this.physics.add.image(1664,256, 'spike').setOrigin(0,0).setImmovable(true).setSize(64,34).setOffset(0,30),
        this.physics.add.image(1792,256, 'spike').setOrigin(0,0).setImmovable(true).setSize(64,34).setOffset(0,30),
        this.physics.add.image(1920,256, 'spike').setOrigin(0,0).setImmovable(true).setSize(64,34).setOffset(0,30),
        this.physics.add.image(1984,256, 'spike').setOrigin(0,0).setImmovable(true).setSize(64,34).setOffset(0,30),
      ]

      //physics for this.player
      this.player.setBounce(0, 0);
      this.player.setCollideWorldBounds(false);
      this.player.setGravityY(850);
      this.player.setFrictionX(1);

      //physics for platforma
      platforma.setGravityY(0)
      platforma.setGravity(false);
      platforma.setImmovable(true);

      //coliders
      this.physics.add.collider(this.player, platforma);
      this.physics.add.collider(this.player, tls);
      this.physics.add.collider(this.player, spks, function(){dead = 1});
      
      //camera follow
      this.cameras.main.startFollow(this.player, true, 0.05, 1, 0, 4);
      this.cameras.main.setBounds(0, -400,  2240, 1024);
    }
     
    update(){
      //teleport to level3
      // if(keyS.isDown){
      //   if(tst == 1){
      //     this.cameras.main.fadeOut(1000, 0, 0, 0)
      //     this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      //     this.scene.start('level3')
      //   })
      //   tst = 0;
      //   }
      // }

      //movement limit
      if (this.player.x < 0) {
        this.player.x = 0;
      }

      //movement limit
      if (this.player.x > 2181) {
        this.player.x = 2181;
      }

      //teleport shortcut
      // if(keyY.isDown){
      //   this.player.x = 2048;
      //   this.player.y = 128;
      // }

      //door change texture(door texture == door opened), sceene change to level2
      if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.dr1.getBounds()) == true && this.key == true) {
        this.dr1.setTexture('dr2');
        if(tst == 1){
          this.cameras.main.fadeOut(1000, 0, 0, 0)
          this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
          this.scene.start('level3')
        })
        tst = 0;
        }
      }

      //door texture == door closed, if player isn't touching the door
      if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.dr1.getBounds()) == false) { 
        this.dr1.setTexture('dr1');
      }

      //player picks-up a key
      if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.key1.getBounds()) == true) { 
        this.key1.destroy();
        this.key = true;
      }

      //if player dies, this scene restarts
      if(dead == 1){
        this.scene.restart();
        dead = 0;
      }
    }

    preUpdate() {
      this.background.setTilePosition(this.scene.cameras.main.scrollX * 0.2);
    }

}