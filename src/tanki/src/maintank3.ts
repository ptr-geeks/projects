import Phaser, { Physics } from 'phaser';

enum ImageNames {
    Tank = 'red_tank_right',
    Metek = 'cannonball2',
    Tank2 = 'blue_tank_left',
    Ozadje = 'ozadje'
    
}

class PlayGame extends Phaser.Scene {
    image: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    keys: any;
    Tank1: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    Tank2: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    Ozadje: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    movevelocity = 10;
    climbvelocity = 15;
    runda: boolean = true;
    spaceDown: boolean = false;
    canUp = false;
    canUp2 = false;
    spacePressed = false;
    AngleTank1 = 0;
    AngleTank2 = 0;
    Tank1PositonX = 550;
    Tank1PositonY = 200;
    Tank2PositonY = 200;
    Tank2PositonX = 50;

    BulletGroup: Physics.Arcade.Group;
    
    AnglePerSecond = 0.02;

    constructor() {
        super('PlayGame');
    }
    preload(): void {
        this.load.image(ImageNames.Tank, 'assets/new tanks/lepseRedTank/tank_red_leftLEPSE.png')
        this.load.image(ImageNames.Tank2, 'assets/new tanks/lepseBlueTank/tank_rightLepsepng.png')
        this.load.image(ImageNames.Metek, 'assets/cannonball2.png');
        this.load.image(ImageNames.Ozadje, 'assets/Assets.png');
        this.load.tilemapTiledJSON("tilemap", 'assets/map.json')

    }
    create(): void {
        
        const tilemap = this.make.tilemap({ key: 'tilemap' });
        const assets = tilemap.addTilesetImage('Assets', ImageNames.Ozadje)
        const backgroundLayer = tilemap.createLayer('Tla', assets!, 0, 0)?.setScale(1);

       const indexes = new Array(600).fill(0, 0, 600).map((x, i) => i);
        
        const izjeme = [7,8,10,11,31,37,189];   

        this.BulletGroup = this.physics.add.group([], {
            key: "bullets",

        });


        for (let i = izjeme.length -1; i >= 0; i--)
           indexes.splice(izjeme[i],1);

        
        backgroundLayer?.setCollision(indexes);


        //this.image = this.add.image(300, 200, ImageNames.Ozadje);
        this.image = this.physics.add.image(300, 200, ImageNames.Metek)
            .setVisible(true)
            .setRotation(0)
            .setCollideWorldBounds(true, 0.4, 0.4)
            .setScale(0.009);
        this.Tank1 = this.physics.add.image(550, 200, ImageNames.Tank)
            .setCollideWorldBounds(true, 1, 1)
            .setScale(1)
            .setRotation(0)
        this.Tank2 = this.physics.add.image(50, 200, ImageNames.Tank2)
            .setCollideWorldBounds(true, 1, 1)
            .setScale(1)
            .setRotation(0)
        this.keys = this.input.keyboard?.addKeys("W,A,S,D,up,down,left,right,space")!;
        // this.keys = this.input.keyboard?.createCursorKeys() 

        this.physics.add.collider(this.image, backgroundLayer!);
        this.physics.add.collider(this.image, backgroundLayer!);
        this.physics.add.collider(this.Tank1, backgroundLayer!,  () => {
            this.canUp = true
            console.log('collide')
        });
        this.physics.add.collider(this.Tank2, backgroundLayer!,  () => {
            this.canUp2 = true
            console.log('collide')
        });

        this.physics.add.collider(this.Tank1, this.BulletGroup, (obj1, obj2) => {
            console.log(obj1, obj2);
            obj2.destroy();
        })
        //this.physics.add.collider(this.Tank2, this.Ozadje, () => this.canUp = true);
       // this.physics.add.collider(this.Tank1, this.Ozadje, () => this.canUp = true);



    }
    update(): void {
        this.Tank1.setVelocityX(0);
        this.Tank2.setVelocityX(0);
        this.Tank1.setRotation(this.AngleTank1)
        this.Tank2.setRotation(this.AngleTank2)
        

        if (this.keys.right.isDown && this.canUp  && this.runda) {
            this.Tank1.setVelocityY(-this.climbvelocity);
            
            this.canUp = false
            
             
        }
        if (this.keys.left.isDown && this.canUp && this.runda) {
            this.canUp = false
            this.Tank1.setVelocityY(-this.climbvelocity);
            
            
        }
        if (this.keys.D.isDown && this.canUp2 && !this.runda) {
            this.Tank2.setVelocityY(-this.climbvelocity);
            
            this.canUp2 = false
            
             
        }
        if (this.keys.A.isDown && this.canUp2 && !this.runda) {
            this.canUp2 = false
            this.Tank2.setVelocityY(-this.climbvelocity);
            
        }
        if (this.keys.space.isDown) {
            this.spaceDown = true;
        }
        if (this.keys.space.isUp && this.spaceDown) {
            this.spacePressed = true;
            this.spaceDown = false;
            console.log('space pressed');

        }
        if (this.spacePressed && this.runda) {
            this.runda = false;
            this.spacePressed = false;
            console.log("false")
        }
        else if (this.spacePressed && !this.runda) {
            this.runda = true;
            this.spacePressed = false;
            console.log("true")

        }

        if (this.keys.right.isDown && this.runda) {
            this.Tank1.setVelocityX(this.movevelocity);
        }
        if (this.keys.left.isDown && this.runda) {
            this.Tank1.setVelocityX(-this.movevelocity);
        }
        if (this.keys.D.isDown && !this.runda) {
            this.Tank2.setVelocityX(this.movevelocity);
        }
        if (this.keys.A.isDown && !this.runda) {
            this.Tank2.setVelocityX(-this.movevelocity);
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

        if( this.runda && this.keys.spaceDown){
            this.image.setRotation(this.AngleTank1)
            this.image.setVisible(true)
            
        }


        if( this.runda && this.keys.space.isDown){
            this.image.setRotation(this.AngleTank2)
            this.image.setVisible(true)
            const bullet = this.physics.add.image(this.Tank1.x, this.Tank1.y - 50, ImageNames.Metek)
            this.BulletGroup.add(bullet);
            bullet.setVelocityY(-500).setScale(0.005);
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
            debug: true
        }
    },
    width: 600,
    height: 450,
    transparent: true,
    scene: PlayGame,
};

export default new Phaser.Game(config);
