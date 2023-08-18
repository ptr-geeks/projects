import Phaser, { Physics } from 'phaser';

enum ImageNames {
    Tank = 'red_tank_right',
    Metek = 'cannonball2',
    Tank2 = 'blue_tank_left',
    Ozadje = 'ozadje',
    ozadje2 = 'ozadje2',
    Heart = 'heart',
    Heart2 = 'heart2',

}

class PlayGame extends Phaser.Scene {
    image: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    keys: any;
    Tank1: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    Tank2: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    Ozadje: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    movevelocity = 20;
    climbvelocity = 15;
    runda: boolean = true;
    spaceDown: boolean = false;
    canUp = false;
    canUp2 = false;
    spacePressed = false;
    AngleTank1 = 0;
    AngleTank2 = 0;
    spacePressed2 = false;
    BulletSpeed = 500;
    BulletGroup: Physics.Arcade.Group;
    BulletGroup1: Physics.Arcade.Group;
    IsShooting = true
    bullet: Phaser.Physics.Arcade.Image;
    explosion: Phaser.GameObjects.Sprite;
    fuel = 2;
    isShooting = false;
    lajfi = 3;
    lajfi2 = 3;
    heart: Phaser.GameObjects.Image;
    heart2: Phaser.GameObjects.Image;

    backgroundLayer: Phaser.Tilemaps.TilemapLayer;


    AnglePerSecond = 0.02;

    constructor() {
        super('PlayGame');
    }
    preload(): void {
        this.load.image(ImageNames.Tank, 'assets/new tanks/lepseRedTank/tank_red_leftLEPSE.png')
        this.load.image(ImageNames.Tank2, 'assets/new tanks/lepseBlueTank/tank_rightLepsepng.png')
        this.load.image(ImageNames.Metek, 'assets/cannonball2.png');
        this.load.image(ImageNames.Ozadje, 'assets/Assets.png');
        this.load.tilemapTiledJSON("tilemap", 'assets/mapa.json');
        this.load.image(ImageNames.ozadje2, 'assets/vesolje.jpg' );
        this.load.spritesheet('eksplozija', 'assets/Explosions.png',{frameWidth: 48, frameHeight: 48}); 
        this.load.image(ImageNames.Heart,"assets/heart1.png" );
        this.load.image(ImageNames.Heart2,"assets/heart1.png" );

    }
    create(): void {

        this.add.image(0, 0, ImageNames.ozadje2).setOrigin(0).setDepth(-1).setScale(0.5);
        this.heart = this.add.image(50,50, ImageNames.Heart).setVisible(true).setScale(0.1);
        this.heart2 = this.add.image(750,50, ImageNames.Heart2).setVisible(true).setScale(0.1);

        //this.add.image(this.cameras.main.centerX, this.cameras.main.centerY).setScale(1);
        this.physics.world.setBounds(0, 0, 800, 480);

        const tilemap = this.make.tilemap({ key: 'tilemap' });
        const assets = tilemap.addTilesetImage('Assets', ImageNames.Ozadje)
        this.backgroundLayer = tilemap.createLayer('Tile Layer 1', assets!, 0, 0)?.setScale(0.5)!;
        const indexes = new Array(600).fill(0, 0, 600).map((x, i) => i);

        const izjeme = [3,7, 8, 10, 11, 31, 37, 189];

        this.BulletGroup = this.physics.add.group([], {
            key: "bullets",

        });
        this.BulletGroup1 = this.physics.add.group([], {
            key: "bullets1",

        });


        for (let i = izjeme.length - 1; i >= 0; i--)
            indexes.splice(izjeme[i], 1);


        this.backgroundLayer?.setCollision(indexes);

        
        //this.image = this.add.image(300, 200, ImageNames.Ozadje);
        // this.image = this.physics.add.image(300, 200, ImageNames.Metek)
        //     .setVisible(false)
        //     .setActive(false)
        //     .setRotation(0)
        //     .setCollideWorldBounds(true, 0.4, 0.4)
        //     .setScale(0.009);
        const spawnpoints = tilemap.getObjectLayer("spawnpoint")!["objects"];
        const spawnpoint1 = spawnpoints.find(x => x.id == 1)
        const spawnpoint2 = spawnpoints.find(x => x.id == 2)
        this.Tank1 = this.physics.add.image(spawnpoint2!.x!*0.5, spawnpoint2!.y!*0.5, ImageNames.Tank)
            .setCollideWorldBounds(true, 1, 1)
            .setScale(0.7)
            .setRotation(0)
        this.Tank2 = this.physics.add.image(spawnpoint1!.x!*0.5, spawnpoint1!.y!*0.5, ImageNames.Tank2)
            .setCollideWorldBounds(true, 1, 1)
            .setScale(0.7)
            .setRotation(0)
        this.keys = this.input.keyboard?.addKeys("W,A,S,D,up,down,left,right,space")!;
        // this.keys = this.input.keyboard?.createCursorKeys() 

        //this.physics.add.collider(this.image, this.backgroundLayer!);
        this.physics.add.collider(this.Tank1, this.backgroundLayer!, () => {
            this.canUp = true
            //console.log('collide')
        });
        this.physics.add.collider(this.Tank2, this.backgroundLayer!, () => {
            this.canUp2 = true
            //console.log('collide')
        });

        this.anims.create({
            key: 'eksplozija',
            frames: this.anims.generateFrameNumbers('eksplozija', {frames: [12,9,6,3,0]}),
            frameRate:24,
            repeat:0,
            hideOnComplete: true,
            yoyo: true,
        });

        this.explosion = this.add.sprite(50,50,"eksplozija").setVisible(false);

    }
    update(): void {
        this.spacePressed = false;
        if (this.keys.space.isDown) {
            this.spaceDown = true;
        }
        
        if (this.keys.space.isUp && this.spaceDown) {
            this.spacePressed = true;
            this.spaceDown = false;
        }
        //this.explosion.setVisible(false);
        this.Tank1.setVelocityX(0);
        this.Tank2.setVelocityX(0);
        this.Tank1.setRotation(this.AngleTank1)
        this.Tank2.setRotation(this.AngleTank2)


        if (this.keys.right.isDown && this.canUp && this.runda&& this.fuel > 0) {
            this.Tank1.setVelocityY(-this.climbvelocity);
            this.fuel = this.fuel - 0.001;

            this.canUp = false


        }
        if (this.keys.left.isDown && this.canUp && this.runda&& this.fuel > 0) {
            this.canUp = false
            this.Tank1.setVelocityY(-this.climbvelocity);
            this.fuel = this.fuel - 0.001;


        }
        if (this.keys.D.isDown && this.canUp2 && !this.runda&& this.fuel > 0) {
            this.Tank2.setVelocityY(-this.climbvelocity);
            this.fuel = this.fuel - 0.001;

            this.canUp2 = false


        }
        if (this.keys.A.isDown && this.canUp2 && !this.runda&& this.fuel > 0) {
            this.canUp2 = false
            this.Tank2.setVelocityY(-this.climbvelocity);
            this.fuel = this.fuel - 0.001;

        }

        if (this.keys.right.isDown && this.runda&& this.fuel > 0) {
            this.Tank1.setVelocityX(this.movevelocity);
            this.fuel = this.fuel - 0.001;
        }
        if (this.keys.left.isDown && this.runda && this.fuel > 0) {
            this.Tank1.setVelocityX(-this.movevelocity);
            this.fuel = this.fuel - 0.001;
            //console.log(this.fuel);
        }
        if (this.keys.D.isDown && !this.runda&& this.fuel > 0) {
            this.Tank2.setVelocityX(this.movevelocity);
            this.fuel = this.fuel - 0.001;
        }
        if (this.keys.A.isDown && !this.runda&& this.fuel > 0) {
            this.Tank2.setVelocityX(-this.movevelocity);
            this.fuel = this.fuel - 0.001;
        }

        if (this.keys.W.isDown && !this.runda) {
            this.AngleTank2 -= 0.01
        }
        if (this.keys.S.isDown && !this.runda) {
            this.AngleTank2 += 0.01
        }
        if (this.keys.down.isDown && this.runda) {
            this.AngleTank1 -= 0.01
        }
        if (this.keys.up.isDown && this.runda) {
            this.AngleTank1 += 0.01
        }

        if (this.runda && this.spacePressed && !this.isShooting) {
            this.IsShooting = true
            if(this.bullet) this.bullet.destroy();
            this.bullet = this.physics.add.image(this.Tank1.x, this.Tank1.y - 20, ImageNames.Metek)
                .setScale(0.005)
                .setCollideWorldBounds();
            
            this.IsShooting = true;   
            this.physics.add.collider(this.bullet, this.backgroundLayer!, () => {
                this.explosion.setPosition(this.bullet.x, this.bullet.y);
                this.explosion.setVisible(true);
                this.explosion.anims.play("eksplozija");
                //this.runda = !this.runda;
                this.bullet.destroy();
                this.IsShooting = false;
                console.log(false);
                
                
               
            });
            this.physics.velocityFromAngle(Phaser.Math.RadToDeg(this.AngleTank1), this.BulletSpeed, this.bullet.body!.velocity);
            this.bullet.body!.velocity.negate();
            //this.IsShooting = false;
            //console.log(false);
            this.explosion.setVisible(false);
        }


        if (!this.runda && this.spacePressed && !this.isShooting) {
            //this.IsShooting = true
            console.log(this.isShooting)
            if(this.bullet) this.bullet.destroy();
            this.IsShooting = true;  
            
            this.bullet = this.physics.add.image(this.Tank2.x, this.Tank2.y - 20, ImageNames.Metek)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                .setScale(0.005)
                .setCollideWorldBounds();

            this.physics.add.overlap(this.bullet, this.backgroundLayer!, (obj1, obj2) => {
                const tile = obj2 as Phaser.Tilemaps.Tile;
                if(tile.index !== -1) {
                    this.bullet.destroy()
                    //console.log(obj2);
                    this.explosion.setPosition(this.bullet.x, this.bullet.y);
                    this.explosion.setVisible(true);
                    this.explosion.anims.play("eksplozija");
                    //this.runda = !this.runda;
                    this.bullet.destroy();
                    this.IsShooting = false;
                    console.log(false);
                    console.log('eksplozija');
                    //this.explosion.setVisible(false);¸
                    
                }
            });
            this.physics.velocityFromAngle(Phaser.Math.RadToDeg(this.AngleTank2), this.BulletSpeed, this.bullet.body!.velocity);
            this.explosion.setVisible(false);
        }

        if (this.spacePressed) {
            this.runda = !this.runda;
            this.fuel = 2;
            this.IsShooting = true;
            console.log(true);

            //this.explosion.setVisible(false);
            
            this.physics.add.overlap(this.bullet, this.Tank1!, (obj1, obj2) => {
                this.lajfi = this.lajfi - 1;
                console.log(this.lajfi);
                this.bullet.destroy();
                this.heart2.setVisible(false);
            });

            this.physics.add.overlap(this.bullet, this.Tank2!, (obj1,obj2) => {
                this.lajfi = this.lajfi2 - 1;
                console.log(this.lajfi);
                this.bullet.destroy();
                this.heart.setVisible(false);

            } );
            
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
            gravity: { y: 500 },
            debug: false
        }
    },
    width: 800,
    height: 450,
    transparent: true,
    scene: PlayGame,
};

export default new Phaser.Game(config);
