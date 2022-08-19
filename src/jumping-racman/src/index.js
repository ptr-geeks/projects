import * as Phaser from 'phaser';
import Preloader from './scenes/preloader';
import Game from './scenes/game';
import UI from './scenes/ui';

const config = {
  name: 'app',
  type: Phaser.AUTO,
  scale: {
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    mode: Phaser.Scale.NONE,
  },
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: "50" },
        debug: false
    }
  },
  width: 800,
  height: 600,
  transparent: true,
  scene: [Preloader, Game, UI],
};

window.game = new Phaser.Game(config);
