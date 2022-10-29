import { Counter } from '../../utils/helpers.js';

const SpellInstanceCounter = new Counter();
export default class SpellInstance {
  constructor(spell, stats, origin, destination, target) {
    this.id = `spell_instance_${SpellInstanceCounter.next()}`;
    this.spell = spell;
    this.stats = stats;
    this.scene = this.spell.scene;
    
    this.origin = origin;
    this.destination = destination;
    this.target = target;
    
    this._initState();
    this._initObjects();
    this._initEffects();
  };
  
  _initState = () => {
    this.state = {};
    this.queuedState = this._getInitialState();
    this._pushState();
  };
  
  _getInitialState = () => {
    return {};
  };
  
  _pushState = () => {
    this.state = this.queuedState;
    this.queuedState = _.cloneDeep(this.state);
  };
  
  _initObjects = () => {
    this.objects = {};
  };
  
  _initEffects = () => {
    this.effects = {};
  };
  
  fire() {};
  
  update(time, delta) {
    this._updateObjects();
    this._updateEffects();
    
    this._pushState();
    this._checkForCompletion();
  };
  
  _updateObjects = (time, delta) => {
    Object.values(this.objects).forEach((object) => {
      object.update(time, delta);
    });
  };
  
  _updateEffects = (time, delta) => {
    Object.values(this.effects).forEach((effect) => {
      effect.update(time, delta);
    });
  };
  
  _checkForCompletion = () => {
    if (this._isComplete()) {
      this._clean();
    }
  }
  
  _checkForCompletion = () => {
    if (!_.isEmpty(this.objects)) return false;
    if (!_.isEmpty(this.effects)) return false;
    return true;
  };
  
  _clean = () => {    
    this.spell.onInstanceComplete(this);
  };
};
