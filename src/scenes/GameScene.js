import ProceduralMap from '../classes/map/ProceduralMap.js';
import D from '../data/GameData.js';
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
    // this.load.spritesheet("teemo-base", "assets/images/animations/teemo-base-16.png", {
    //   frameWidth: 16,
    //   frameHeight: 16,
    // });
    // this.load.spritesheet("teemo-base", "assets/images/animations/teemo-base.png", {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });

    // this.load.on('complete', () => {
    //   A.createAnimations(this);
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

    this._createGroups();
    // this.createCharacter();
    this._createMap();
    // this.createStructures();
    // this.createEnemies();
    // this.createInterface();
    // 
    // this.initializeInputs();

    this.physics.world.setBounds(0, 0, D.Map.tileW * D.Map.tilesize, D.Map.tileH * D.Map.tilesize);
    this.cameras.main.setBounds(0, 0, D.Map.tileW * D.Map.tilesize, D.Map.tileH * D.Map.tilesize);
    this.cameras.main.setZoom(3);
  }
  
  _createGroups = () => {
    // Enemy Groups
    this.enemies = this.add.group();
    this.enemyHitboxes = this.add.group()
    this.enemyRanges = this.add.group();

    // Other Groups
    this.propsGroup = this.add.group();
  };
  
  _createMap = () => {
    this.map = new ProceduralMap(this, D.Map.tilesize, D.Map.tileW, D.Map.tileH, D.Map.borderTileW);
  };
  
  
  // UPDATE FUNCTIONS
  update(time, delta) {
    // this.graphics.clear();
    this._updateMap(time, delta)
  }
  
  _updateMap = (time, delta) => {
    this.map.update(time, delta);
  }
}
