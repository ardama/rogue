import _ from 'lodash';
import SpellInstance from './SpellInstance.js';

const baseSpellData = {
  name: 'Unnamed spell',
  class: SpellInstance,
  stats: {
    base: {
      charges: -1,
      chargeTime: -1,
      cooldownTime: -1,
    },
    scaling: {},
  },
}

export default class Spell {
  constructor(unit, spellData) {
    this.unit = unit;
    this.scene = this.unit.scene;
    
    this.gamedata = _.merge({}, baseSpellData, spellData);
    this._initState();
    this._initInstances();
  };
  
  _initState = () => {
    this.state = {};
    this.queuedState = this._getInitialState();
    this._pushState();
  };
  
  _getInitialState = () => {
    const { charges, chargeTime, cooldownTime } = this.gamedata.stats.base;
    return {
      level: 1,
      charges: charges,
      chargeTime: chargeTime === -1 ? -1 : 0,
      cooldownTime: cooldownTime === -1 ? -1 : 0,
    };
  };
  
  _pushState = () => {
    const shouldUpdateStats = this._shouldUpdateStats();
    
    this.state = this.queuedState;
    this.queuedState = _.cloneDeep(this.state);
    
    if (shouldUpdateStats) this._updateStats();
  };
  
  _initInstances = () => {
    this.instances = {};
  };

  update(time, delta) {
    this._updateCooldown(delta);
    this._updateCharges(delta);
    this._updateInstances(time, delta);
    
    this._pushState();
  };
  
  _updateCooldown = (delta) => {
    if (this.queuedState.cooldownTime > 0) {
      this.queuedState.cooldownTime = Math.max(0, this.queuedState.cooldownTime - delta);
    }
  }
  
  _updateCharges = (delta) => {
    if (this.queuedState.chargeTime > 0) {
      // update amount of time until next charge
      this.queuedState.chargeTime -= delta;
      
      if (this.queuedState.chargeTime <= 0) {
        // grant another charge if time remaining has expired
        this.queuedState.charges += 1;
        console.log(`Charge granted for ${this.gamedata.name} (${this.queuedState.charges})`);
        
        // restart the timer unless we're at max charges
        if (this.queuedState.charges === this.stats.charges) {
          this.queuedState.chargeTime = 0;
        } else {
          this.queuedState.chargeTime += this.stats.chargeTime;
        }
      }
    }
  }
  
  _updateInstances = (time, delta) => {
    Object.values(this.instances).forEach((instance) => {
      instance.update(time, delta);
    });
  };
  
  fire(origin, destination, target) {
    if (this.queuedState.charges > 0) {
      // expend a charge
      this.queuedState.charges -= 1;
      
      // start cooldown timer between charges
      this.queuedState.cooldownTime = this.stats.cooldownTime;
      
      // start recharge timer if it's not already in progress
      if (this.queuedState.chargeTime === 0) {
        this.queuedState.chargeTime = this.stats.chargeTime;
      }
      
      this._fireInstance(origin, destination, target);
    }
    console.log(`${this.gamedata.name} cast (${this.queuedState.charges})`);
  };
  
  isReady() {
    if (this.queuedState.charges === 0) return false;
    if (this.queuedState.cooldownTime > 0) return false;

    return true;
  }
  
  _fireInstance = (origin, destination, target) => {
    const stats = _.cloneDeep(this.stats);
    const instance = this._createSpellInstance(stats, origin, destination, target);

    instance.fire();
    this.instances[instance.id] = instance;
  };

  _createSpellInstance = (stats, origin, destination, target) => {
    return new SpellInstance(this, origin, destination, target);
  }
  
  onInstanceComplete(instance) {
    delete this.instances[instance.id];
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
    
    const { base: baseStats } = this.gamedata.stats;
    Object.keys(baseStats).forEach((stat) => {
      nextStats[stat] = this._computeStat(stat);
    });
    
    console.log(`Updated ${this.gamedata.name} stats:`, nextStats);
    return nextStats;
  };
  
  _computeStat = (stat) => {
    const { base, scaling } = this.gamedata.stats;
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
  }
}
