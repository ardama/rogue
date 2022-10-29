import _ from 'lodash';
import C from '../../utils/constants.js';

const baseUnitData = {
  name: 'Unnamed unit',
  appearance: {
    key: 'tiles',
    animations: [],
  },
  stats: {
    base: {},
    scaling: {},
  },
};

export default class Unit extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, unitData) {
    const data = _.merge({}, baseUnitData, unitData);
    scene.registerAnimations(data.appearance.animations);
    
    super(scene, x, y, data.appearance.key);
  
    this.gamedata = data;
    this._initState();
    this._initAttack();
    this._initSpells();
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
      effects: {},
      modifiers: {},
      level: 1,
    }
  };
  
  _pushState = () => {
    const shouldUpdateStats = this._shouldUpdateStats();
    
    this.state = this.queuedState;
    this.queuedState = _.cloneDeep(this.state);
    
    if (shouldUpdateStats) this._updateStats();
  };
  
  _initAttack = () => {
    const AttackClass = this.gamedata.attack;
    this.attack = new AttackClass(this);
  };
  
  _initSpells = () => {
    this.spells = [];
    
    (this.gamedata.spells || []).forEach((SpellClass) => {
      this.spells.push(new SpellClass(this));
    });
  };
  
  update(time, delta) {
    this._updateMovement(time, delta);
    this._updateSpells(time, delta);
    
    
    
    
    
    this._pushState();
  };
  
  _updateMovement = (time, delta) => {
    const { target, targetRadius, destination } = this.queuedState.physics;
    
    // recompute path data if we have a target or destination set
    if (target) {
      this._setTarget(target, targetRadius);
    } else if (destination) {
      this._setDestination(destination);
    }
    
    const { path = [] } = this.queuedState.physics;
    let coords;
    for (let i = 0; i < path.length; i++) {
      if (!this._hasArrived(path[i])) {
        coords = path[i];
        break;
      }
    }
    
    if (coords) {
      const { x: cx, y: cy } = this.body.center;
      this.scene.physics.moveTo(this, coords.x, coords.y, this.stats[C.Stats.MS]);
      this._updateDirection();
      this._performWalk();
    } else {
      this._performStop();
    }
  };
  
  _hasArrived = (coords) => {
    const { x: cx, y: cy } = this.body.center;
    const { velocity: { x: vx, y: vy } } = this.body;
    
    const arrivedX = (Math.abs(cx - coords.x) <= 1) || (vx > 0 && cx > coords.x) || (vx < 0 && cx < coords.x);
    const arrivedY = (Math.abs(cy - coords.y) <= 1) || (vy > 0 && cy > coords.y) || (vy < 0 && cy < coords.y);
    
    return arrivedX && arrivedY;
  };
  
  _updateDirection = () => {
    const { x: vx, y: vy } = this.body.velocity;
    const vertical = Math.abs(vy) > 1.5 * Math.abs(vx);

    if (vertical && vy > 0) this.queuedState.physics.direction = C.Directions.D;
    else if (vertical && vy < 0) this.queuedState.physics.direction = C.Directions.U;
    else if (vx < 0) this.queuedState.physics.direction = C.Directions.L;
    else if (vx > 0) this.queuedState.physics.direction = C.Directions.R;
  };
  
  _updateSpells = (time, delta) => {
    this.spells.forEach((spell) => {
      spell.update(time, delta);
    })
  };
  
  _shouldUpdateStats = () => {
    if (this.state.level !== this.queuedState.level) return true;
    return false;
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
    this.body.setCollideWorldBounds(true);
    this.body.isCircle = shape === 'circle';
    this.body.setSize(w, h, false);
    // this.body.setOffset((16 - this.hitboxW) / 2, 4 + (16 - this.hitboxH) / 2);
  };
  
  triggerAttack() {
    
  };
  
  _performAttack = () => {
    
  };
  
  triggerSpell(index, destination, target) {
    const spell = this.spells[index];
    if (this._canPerformSpell(spell)) {
      this._performSpell(spell, destination, target);
    }
    
    // TODO: create spell queue
  };
  
  _canPerformSpell = (spell) => {
    if (!spell || !spell.isReady()) return false;
    
    // TODO: handle the following:
    //  - crowd control effects
    //  - spell casttime lockouts
    //  - dashing lockouts
    
    return true;
  }
  
  _performSpell = (spell, destination, target) => {
    const origin = this.getHitboxCenter();
    spell.fire(origin, destination, target);
  };
  
  triggerMove(destination) {
    this._setDestination(destination);
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  };
  
  _performWalk() {
    const { direction = C.Directions.D } = this.queuedState.physics;
    this._renderAnimation(C.Animations.MOVE, direction);
  };
  
  _performStop() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    
    this.queuedState.physics.path = [];
    this.queuedState.physics.destination = null;
    this.queuedState.physics.target = null;
    this.queuedState.physics.targetRadius = null;
    
    const { direction = C.Directions.D } = this.queuedState.physics;
    this._renderAnimation(C.Animations.IDLE, direction);
  };
  
  applyDamage() {
    
  };
  
  applyEffect() {
    
  };
  
  levelUp() {
    this.queuedState.level += 1;
  };
  

  getHitboxCenter() {
    const { hitbox: { w = 0, h = 0 } } = this.gamedata.stats.static;
    return {
      x: this.body.x + w / 2,
      y: this.body.y + h / 2,
    };
  };
  
  _setTarget = (target, radius) => {
    // TODO: if within radius, clear destination
    //       otherwise, set destination to closest point within that distance of the target
    const destination = target.getHitboxCenter();
    this._setDestination(destination);

    this.queuedState.physics.target = target;
    this.queuedState.physics.targetRadius = radius;
  };
  
  _setDestination = (destination) => {
    this._setPath(destination);
    this.queuedState.physics.destination = destination;

  };
  
  _setPath = (destination) => {
    const path = [destination];
    this.queuedState.physics.path = path;
  };
}
