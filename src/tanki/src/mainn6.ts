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
    spacePressed2 = false;
    BulletSpeed = 500;
    BulletGroup: Physics.Arcade.Group;
    BulletGroup1: Physics.Arcade.Group;
    isShooting = false;

    bullet: Phaser.Physics.Arcade.Image;

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

    }
    create(): void {
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
        this.image = this.physics.add.image(300, 200, ImageNames.Metek)
            .setVisible(false)
            .setActive(false)
            .setRotation(0)
            .setCollideWorldBounds(true, 0.4, 0.4)
            .setScale(0.009);
        const spawnpoints = tilemap.getObjectLayer("spawnpoint")!["objects"];
        const spawnpoint1 = spawnpoints.find(x => x.id == 1)
        const spawnpoint2 = spawnpoints.find(x => x.id == 2)
        this.Tank1 = this.physics.add.image(spawnpoint2!.x!*0.5, spawnpoint2!.y!*0.5, ImageNames.Tank)
            .setCollideWorldBounds(true, 1, 1)
            .setScale(0.5)
            .setRotation(0)
        this.Tank2 = this.physics.add.image(spawnpoint1!.x!*0.5, spawnpoint1!.y!*0.5, ImageNames.Tank2)
            .setCollideWorldBounds(true, 1, 1)
            .setScale(0.5)
            .setRotation(0)
        this.keys = this.input.keyboard?.addKeys("W,A,S,D,up,down,left,right,space")!;
        // this.keys = this.input.keyboard?.createCursorKeys() 

        this.physics.add.collider(this.image, this.backgroundLayer!);
        this.physics.add.collider(this.Tank1, this.backgroundLayer!, () => {
            this.canUp = true
            //console.log('collide')
        });
        this.physics.add.collider(this.Tank2, this.backgroundLayer!, () => {
            this.canUp2 = true
            //console.log('collide')
        });
        this.physics.add.collider(this.bullet, this.backgroundLayer!, () => this.bullet.destroy(this.isShooting = false));
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

        this.Tank1.setVelocityX(0);
        this.Tank2.setVelocityX(0);
        this.Tank1.setRotation(this.AngleTank1)
        this.Tank2.setRotation(this.AngleTank2)
        


        if (this.keys.right.isDown && this.canUp && this.runda) {
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

        if (this.runda && this.spacePressed && !this.isShooting) {
            this.isShooting = true;
            if(this.bullet) this.bullet.destroy();
            this.bullet = this.physics.add.image(this.Tank1.x, this.Tank1.y - 20, ImageNames.Metek)
                .setScale(0.005)
                .setCollideWorldBounds();
            this.physics.velocityFromAngle(Phaser.Math.RadToDeg(this.AngleTank2), this.BulletSpeed, this.bullet.body!.velocity);

           
            this.physics.velocityFromAngle(Phaser.Math.RadToDeg(this.AngleTank1), this.BulletSpeed, this.bullet.body!.velocity);
            this.bullet.body!.velocity.negate();

        }

        
        if (!this.runda && this.spacePressed && !this.spacePressed) {
            this.isShooting = true;
            if(this.bullet) this.bullet.destroy();
            
            this.bullet = this.physics.add.image(this.Tank2.x, this.Tank2.y - 20, ImageNames.Metek)
                .setScale(0.005)
                .setCollideWorldBounds();
                this.physics.velocityFromAngle(Phaser.Math.RadToDeg(this.AngleTank2), this.BulletSpeed, this.bullet.body!.velocity);

            this.physics.add.overlap(this.bullet, this.backgroundLayer!, (obj1, obj2) => {
                const tile = obj2 as Phaser.Tilemaps.Tile;
                if(tile.index !== -1) {
                    this.bullet.destroy()
                    console.log(obj2);
                }
            });
            
        }

        if (this.spacePressed) {
            this.runda = !this.runda;
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
    width: 1200,
    height: 900,
    transparent: true,
    scene: PlayGame,
};

export default new Phaser.Game(config);
