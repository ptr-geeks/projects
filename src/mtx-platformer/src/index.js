import * as Phaser from 'phaser';
import Preloader from './scenes/preloader';
import menu from './scenes/menu';
import level1 from './scenes/lvl1';
import level2 from './scenes/lvl2';
import level3 from './scenes/lvl3';
import end from './scenes/end';

const config = {
  name: 'app',
  type: Phaser.AUTO,
  scale:{
    //autoCenter: Phaser.Scale.CENTER_BOTH,
    //mode: Phaser.Scale.NONE,
  },
  
  width: 1024,
  height: 512,
  scene: [Preloader, menu, level1, level2, level3, end],
  autoCenter: true,

  physics: {
    default: 'arcade',
    arcade: {
      debug: false //true or false
    }
  },


};

window.game = new Phaser.Game(config);
