import { GameObjects } from "phaser";

export default class Menu extends Phaser.Scene {
    constructor ()
    {
        super({ key: 'menu' });
    }
    preload ()
    {
        this.load.image('skeleton background', 'assets/Skeleton.png');
        this.load.image('bone', 'assets/Bone.png');    
    }

    create ()
    {
        // this.scene.start("PlayGame")
        this.add.image(800, 200, 'skeleton background');
        this.cameras.main.setBackgroundColor('#ADD8E6');
        const bone = this.add.image(800, 550, 'bone').setInteractive();

        // this.bone.setInteractive();
        bone.on('pointerdown', () => {
            this.scene.start('PlayGame')
        });
    }
}
