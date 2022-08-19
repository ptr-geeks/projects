import * as Phaser from 'phaser';

export default class Preloader extends Phaser.Scene
{
    constructor ()
    {
        super('preloader');
        
    }

    preload ()
    {
        this.load.image('background', '/static/background.jpg');
        this.load.image('spike', '/static/spike.png');
        this.load.image('spike_c', '/static/spike_cropped.png');

        //player
        this.load.image('player', '/static/character.png');
        this.load.image('player_mirror', '/static/character_mirror.png')

        //this.load.image('tiles', '/static/platformPack_tilesheet.png');
        this.load.image('key1', '/static/key1.png');

        //tiles
        this.load.image('tl1', '/static/tile1.png');
        this.load.image('tl2', '/static/tile2.png');
        this.load.spritesheet('tl3', '/static/tile3.png', { frameWidth: 64, frameHeight: 64 });

        //doors (dr1 = closed door, dr2 = opened door)
        this.load.image('dr1', '/static/door1.png');
        this.load.image('dr2', '/static/door2.png');

        //buttons (btn1 = normal button, btn2 = pressed/pushed button)
        this.load.image('btn1', '/static/button1.png');
        this.load.image('btn2', '/static/button2.png');

        //levels
        this.load.image('lvl1', '/static/level1.png');
        this.load.image('lvl2', '/static/level2.png');
        this.load.image('lvl3', '/static/level3.png');
    }

    create ()
    {
        this.scene.start('menu');
    }
}