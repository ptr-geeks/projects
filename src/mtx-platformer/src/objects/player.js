import * as Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // movement keys
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    }

    preUpdate(){
        if(this.keyW.isDown && this.body.touching.down){ //jump
            this.setVelocityY(-380);
          }
        if(this.keyD.isDown && !this.keyA.isDown){ //player move right and keep the defaut texture
          this.setTexture('player');
          this.setVelocityX(280);
        }
        if(this.keyA.isDown && !this.keyD.isDown){ //player move left and set texture to player_mirror
          this.setTexture('player_mirror');
          this.setVelocityX(-280);
        }
        if(!this.keyA.isDown && !this.keyD.isDown){ //player keep still
          this.setVelocityX(0);
        }
        if(this.scene.scene.key == 'level2') { //if scene is level2
          if(Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), this.scene.btn1.getBounds()) == true && this.scene.key == true) { 
            this.scene.btn1.setTexture('btn2');
            setTimeout(() => {
              this.x = 1603; 
              this.y = 196; 
            }, 680);
          }
          if(Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), this.scene.btn1.getBounds()) == true && this.scene.key == false) { 
              this.scene.btn1.setTexture('btn2')
          }
          if(Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), this.scene.btn1.getBounds()) == false) { 
            this.scene.btn1.setTexture('btn1')
          }
        }
    }
}