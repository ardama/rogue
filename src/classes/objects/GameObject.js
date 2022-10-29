import _ from 'lodash';
import C from '../../utils/constants.js';
import { Counter } from '../../utils/helpers.js';

const baseObjectData = {
  name: 'Unnamed object',
  appearance: {
    key: 'tiles',
    animations: [],
  },
  stats: {
    static: {
      hitbox: {
        w: 0,
        h: 0,
        shape: 'circle',
      },
    },
  },
};

const GameObjectCounter = new Counter();
export default class GameObject extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, objectData) {
    const data = _.merge({}, baseObjectData, objectData);
    
    scene.registerAnimations(data.appearance.animations);
    
    super(scene, x, y, data.appearance.key);
    this.id = `object_${GameObjectCounter.next()}`;
    this.gamedata = data;
    
    this._initState();
  };
  
  _initState = () => {
    this.state = {};
    this.queuedState = this._getInitialState();
    this._pushState();
  };
  
  _getInitialState = () => {
    return {
      rendered: false,
      destroyed: false,
      appearance: {},
      physics: {},
    };
  };
  
  _pushState = () => {
    const shouldUpdateStats = this._shouldUpdateStats();
    
    this.state = this.queuedState;
    this.queuedState = _.cloneDeep(this.state);
    
    if (shouldUpdateStats) this._updateStats();
  }
  
  update(time, delta) {
    this._pushState();
  };
  
  _shouldUpdateStats = () => {
    if (this.stats) return false;
    return true;
  };

  _updateStats = () => {
    this.stats = this._computeStats();
  };
  
  _computeStats = () => {
    const nextStats = {};
    
    const { base: baseStats } = (this.gamedata.stats || {});
    Object.keys(baseStats).forEach((stat) => {
      nextStats[stat] = this._computeStat(stat);
    });
    
    console.log(`Updated ${this.gamedata.name} stats:`, nextStats);
    return nextStats;
  };
  
  _computeStat = (stat) => {
    const { base = {}, scaling = {} } = this.gamedata.stats;
    const { modifiers = {}, level = 1 } = this.state;
    
    const baseStat = base[stat] || 0;
    const scalingStat = scaling[stat] || 0;
    const statModifiers = modifiers[stat] || {};
    const { flat = 0, percent = 0 } = modifiers;

    let value = baseStat;
    value += (level - 1) * scalingStat;
    value += flat;
    value *= (1 + percent);
    return value;
  };
  
  renderToScene() {
    this.scaleX = 1;
    this.scaleY = 1;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    
    this._initAnimation();
    this._initHitbox();

    this.queuedState.rendered = true;
  };
  
  _initAnimation = () => {
    this._renderAnimation(C.Animations.IDLE, C.Directions.D);
  };
  
  _renderAnimation = (animation, direction, repeat = -1) => {
    const { name } = this.gamedata;
    const animationKey = `${name}_${animation}_${direction}`;
    
    if (animationKey && animationKey !== this.queuedState.appearance.animation) {
      this.anims.play(animationKey);
      this.anims.setRepeat(repeat);      

      this.queuedState.appearance.animation = animationKey;
    }
  };
  
  _initHitbox = () => {
    const { hitbox: { h = 0, w = 0, shape = 'circle' } } = this.gamedata.stats.static;
    if (h <= 0 || w <= 0) return;
    
    this.body.setCollideWorldBounds(true);
    this.body.isCircle = shape === 'circle';
    this.body.setSize(w, h, false);
  };
  
  getHitboxCenter() {
    const { hitbox: { w = 0, h = 0 } } = this.gamedata.stats.static;
    return {
      x: this.body.x + w / 2,
      y: this.body.y + h / 2,
    };
  };
};  
