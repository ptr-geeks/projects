import * as Phaser from 'phaser';

export default class Preloader extends Phaser.Scene
{
    constructor ()
    {
        super('preloader');
    }

    preload ()
    {
        this.loadText = this.add.text(400, 300, 'Loading...').setOrigin(0.5);

        this.load.image('background', '/static/background.jpg');
        this.load.spritesheet('sprites', '/static/sprites.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('heart', '/static/heart.png');
        this.load.tilemapTiledJSON('World', '/static/Mapa.json');
        this.load.image('diamant', '/static/diamant.png');
      //  this.load.image('rumeno', '/static/rumeno.png');
        
        //this.load.image('racman_idle', '/static/racman_idle.png');
        this.load.spritesheet('racman_idle', '/static/racman_idle.png', { frameWidth: 130, frameHeight: 130 });
        this.load.spritesheet('racman_walk', '/static/racman_walk.png', { frameWidth: 130, frameHeight: 130 });
        this.load.spritesheet('racman_jump', '/static/racman_jump.png', { frameWidth: 130, frameHeight: 140 });
        this.load.spritesheet('racman_atk',  '/static/racman_atk.png', { frameWidth: 140, frameHeight: 130 });
        this.load.spritesheet('racman_crouch',  '/static/racman_crouch.png', { frameWidth: 130, frameHeight: 130});
        
    }

    create ()
    {
        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNumbers('racman_idle', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'player_walk',
            frames: this.anims.generateFrameNumbers('racman_walk', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'player_jump1',
            frames: this.anims.generateFrameNumbers('racman_jump', { start: 0, end: 3 }),
            frameRate: 7,
            repeat: 0
        });
        this.anims.create({
            key: 'player_jump2',
            frames: this.anims.generateFrameNumbers('racman_jump', { start: 3, end: 6 }),
            frameRate: 7,
            repeat: 0
        });

        this.anims.create({
            key: 'player_atk',
            frames: this.anims.generateFrameNumbers('racman_atk', { start: 0, end: 11}),
            frameRate: 25,
            repeat: 0
        })
        this.anims.create({
            key: 'player_crouch1',
            frames: this.anims.generateFrameNumbers('racman_crouch', { start: 0, end: 3}),
            frameRate: 15,
            repeat: 0
        })

        this.anims.create({
            key: 'player_crouch2',
            frames: this.anims.generateFrameNumbers('racman_crouch', { start: 3, end: 6}),
            frameRate: 15,
            repeat: 0
        })

        this.scene.start('game');
    }
}
