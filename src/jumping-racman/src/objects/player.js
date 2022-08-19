import * as Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'racman_idle');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.2);
        //this.setDragX(0.2);

        this.movementKeys = scene.input.keyboard.addKeys("W,A,D");
        
        
        scene.cameras.main.startFollow(this, false, 0.05, 1, 0, );
        scene.cameras.main.setZoom(2);
        this.atkKeys = scene.input.keyboard.addKey("B");
        this.crouchKeys = scene.input.keyboard.addKey("C");
        this.dashKeys = scene.input.keyboard.addKey("V");

        this.crouching = false;
        this.Anim = false;
        this.dash = false
    }
    
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.movementKeys.D.isDown) {
            if(this.dash == true)
            {  
                this.setVelocityX(400);
                this.setFlipX(false);  
            }
            else{
            this.setVelocityX(200);
            this.setFlipX(false);
            }
        } else if (this.movementKeys.A.isDown) {
            if(this.dash == true)
            {
                if(this.dash == true)
                {  
                    this.setVelocityX(-400);
                    this.setFlipX(true);    
                }
                
            }
            else{
            this.setVelocityX(-200);
            this.setFlipX(true);
            }
        } else {
            this.setVelocityX(0);
            
        }


        if (Phaser.Input.Keyboard.JustDown(this.atkKeys)) {
            this.Anim = true;
            this.play('player_atk', true);
            this.Anim = false;

        }

        if (this.body.onFloor() && (this.movementKeys.D.isDown || this.movementKeys.A.isDown)) {
            this.Anim = true;
            this.play('player_walk', true);
            this.Anim = false;

        }
        else if(this.body.onFloor() && this.Anim == false) {
            this.play('player_idle', true)

        }
        else if (this.Anim == true) {
            this.stop();
        }
        let jump = 3;
        if (Phaser.Input.Keyboard.JustDown(this.movementKeys.W) && this.body.onFloor()) {

            this.Anim = true
            this.play('player_jump1', true)

            if (this.crouching == true && jump > 0) {
                this.setVelocityY(-450);
                this.crouching = false;
            }
            else {
                this.setVelocityY(-330);
            }

            this.play('player_jump2', true)
            this.Anim = false
        }

        if (Phaser.Input.Keyboard.JustDown(this.crouchKeys)) {
            this.Anim = true
            this.play('player_crouch1', true)
            this.crouching = true;
            this.Anim = false;
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.dashKeys))
        {
            this.dash = true;
        }

        if(Phaser.Input.Keyboard.JustUp(this.dashKeys))
        {
            this.dash = false;
        }
   
        //console.log(this.y);
        if (this.y > 900) {
            this.y = 505;
            this.x = -160;
        }
    //  console.log(this.x);
      //console.log(this.y);
    }
   
}
function dashNazaj()
{
 this.setVelocity(200);
 this.dash = false;
}