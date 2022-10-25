import ProceduralMap from '../classes/map/ProceduralMap.js';
import Champion from '../classes/units/Champion.js';
import D from '../data/GameData.js';
import C from '../utils/constants.js';
import { Counter } from '../utils/helpers.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    
    this.counter = new Counter(1);
  }
  
  preload() {
    this.load.image("terrain", "assets/images/terrain.png");
    this.load.image("terrain-18", "assets/images/terrain-18.png");
    this.load.image("terrain-extended-18", "assets/images/terrain-extended-18.png");
    this.load.image("terrain-extended-all", "assets/images/terrain-extended-all.png");
    this.load.atlas("foliage-atlas", "assets/images/foliage-16.png", "assets/json/foliage-16.json");
    // this.load.atlas("foliage_atlas", "assets/images/foliage4.png", "assets/json/foliage4.json");
    this.load.image("foliage", "assets/images/foliage3.png");
    this.load.spritesheet("teemo-base", "assets/images/animations/teemo-base-16.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    // this.load.spritesheet("teemo-base", "assets/images/animations/teemo-base.png", {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });

    // this.load.on('complete', () => {
    //   Animations.createAnimations(this);
    // });

    this.physics.world.enable(this);
  }
  
  // CREATE FUNCTIONS
  create() {
    // this.graphics = this.add.graphics({
    //   lineStyle: {
    //     width: 5,
    //     color: 0xdddddd,
    //   },
    //   fillStyle: {
    //     color: 0x888888,
    //   },
    // });

    this._initGroups();
    this._initMap();
    this._initChampion();
    // this.initStructures();
    // this.initEnemies();
    // this.initInterface();
    // 
    this._initInputs();

    this.physics.world.setBounds(0, 0, D.Map.tileW * D.Map.tilesize, D.Map.tileH * D.Map.tilesize);
    this.cameras.main.setBounds(0, 0, D.Map.tileW * D.Map.tilesize, D.Map.tileH * D.Map.tilesize);
    this.cameras.main.setZoom(3);
    this.cameras.main.startFollow(this.champion);
  }
  
  
  // INITIALIZATION FUNCTIONS
  _initGroups = () => {
    // Enemy Groups
    this.enemies = this.add.group();
    this.enemyHitboxes = this.add.group()
    this.enemyRanges = this.add.group();

    // Other Groups
    this.propsGroup = this.add.group();
  };
  
  _initMap = () => {
    this.map = new ProceduralMap(this, D.Map.tilesize, D.Map.tileW, D.Map.tileH, D.Map.borderTileW);
  };
  
  _initChampion = () => {
    this.champion = new Champion(this, 100, 100, C.Champions.TEEMO);
    this.champion.renderToScene();
  };
  
  _initInputs = () => {
    this.input.mouse.disableContextMenu();
    this.input.on('pointerdown', (pointer) => {
      if (pointer.rightButtonDown()) {
        const destination = this.cameras.main.getWorldPoint(pointer.x, pointer.y)
        this.champion.triggerMove(destination);
      }
    });
    
    const keylist = [
      C.Keycodes.ESC,
      C.Keycodes.Q,
      C.Keycodes.W,
      C.Keycodes.E,
      C.Keycodes.R,
      C.Keycodes.T,
      C.Keycodes.Y,
      C.Keycodes.U,
      C.Keycodes.I,
      C.Keycodes.O,
      C.Keycodes.P,
      C.Keycodes.ONE,
      C.Keycodes.TWO,
      C.Keycodes.THREE,
      C.Keycodes.FOUR,
      C.Keycodes.FIVE,
      C.Keycodes.SIX,
      C.Keycodes.SEVEN,
      C.Keycodes.EIGHT,
      C.Keycodes.NINE,
      C.Keycodes.ZERO,
    ];
    
    this.keys = {};
    keylist.forEach((keycode) => {
      this.keys[keycode] = this.input.keyboard.addKey(keycode);
    });
    
    this.keys[C.Keycodes.Q].on('down', () => {
      this.champion.triggerSpell(0);
    });
    this.keys[C.Keycodes.U].on('down', () => {
      this.champion.triggerSpell(0);
    });
    
    this.keys[C.Keycodes.W].on('down', () => {
      this.champion.triggerSpell(1);
    });
    this.keys[C.Keycodes.I].on('down', () => {
      this.champion.triggerSpell(1);
    });
    
    this.keys[C.Keycodes.E].on('down', () => {
      this.champion.triggerSpell(2);
    });
    this.keys[C.Keycodes.O].on('down', () => {
      this.champion.triggerSpell(2);
    });
    
    this.keys[C.Keycodes.R].on('down', () => {
      this.champion.triggerSpell(3);
    });
    this.keys[C.Keycodes.P].on('down', () => {
      this.champion.triggerSpell(3);
    });
  }
  
  // UPDATE FUNCTIONS
  update(time, delta) {
    // this.graphics.clear();
    
    this._updateMap(time, delta);
    this._updateChampion(time, delta);
  }
  
  _updateMap = (time, delta) => {
    this.map.update(time, delta);
  }
  
  _updateChampion = (time, delta) => {
    this.champion.update(time, delta);
  }

  // PUBLIC FUNCTIONS
  registerAnimations(animations) {
    animations.forEach((animation) => {
      this.anims.create({
        key: animation.key,
        frames: this.anims.generateFrameNumbers(animation.frameSource, { start: animation.frameStart, end: animation.frameEnd }),
        frameRate: animation.frameRate || 16,
        repeat: animation.repeat || -1,
        repeatDelay: animation.repeatDelay || 0,        
      })
    })
  }
}
