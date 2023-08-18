import Phaser from 'phaser';

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
    movevelocity = 100;
    runda: boolean = true;
    spaceDown: boolean = false;
    canUp: boolean = false;
    spacePressed = false;
    
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
        const izjeme = [7,8,10,11,31,37];   
        
        

        for (let i = izjeme.length -1; i >= 0; i--)
           indexes.splice(izjeme[i],1);

        
        backgroundLayer?.setCollision(indexes);


        //this.image = this.add.image(300, 200, ImageNames.Ozadje);
        this.image = this.physics.add.image(300, 200, ImageNames.Metek)
            .setCollideWorldBounds(true, 0.4, 0.4)
            .setScale(0.009);
        this.Tank1 = this.physics.add.image(550, 200, ImageNames.Tank)
            .setCollideWorldBounds(true, 1, 1)
            .setScale(1)
        this.Tank2 = this.physics.add.image(50, 200, ImageNames.Tank2)
            .setCollideWorldBounds(true, 1, 1)
            .setScale(1)
        this.keys = this.input.keyboard?.addKeys("W,A,S,D,up,down,left,right,space")!;
        // this.keys = this.input.keyboard?.createCursorKeys() 

        this.physics.add.collider(this.image, backgroundLayer!);
        this.physics.add.collider(this.Tank1, backgroundLayer!);
        this.physics.add.collider(this.Tank2, backgroundLayer!);



    }
    update(): void {
        this.Tank1.setVelocityX(0);
        this.Tank2.setVelocityX(0);

        if (this.keys.up.isDown && this.canUp) {
            this.image.setVelocityY(-this.movevelocity);
            this.canUp = false
             
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
            this.Tank2.rotation -= this.AnglePerSecond
        }
        if (this.keys.S.isDown && !this.runda) {
            this.Tank2.rotation += this.AnglePerSecond
        }
        if (this.keys.down.isDown && this.runda) {
            this.Tank1.rotation -= (this.AnglePerSecond)
        }
        if (this.keys.up.isDown && this.runda) {
            this.Tank1.rotation += (this.AnglePerSecond)
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
            gravity: { y: 50 },
            debug: true
        }
    },
    width: 600,
    height: 450,
    transparent: true,
    scene: PlayGame,
};

export default new Phaser.Game(config);
