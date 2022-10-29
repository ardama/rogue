import _ from 'lodash';
import GameObject from './GameObject.js';

import C from '../../utils/constants.js';

const baseProjectileData = {
  name: 'Unnamed projectile',
  stats: {
    base: {
      [C.Stats.MS]: 100,
    },
  },
}
export default class Projectile extends GameObject {
  constructor(scene, x, y, projectileData, onHit, onArrival) {
    const data = _.merge({}, baseProjectileData, projectileData);
    super(scene, x, y, data);
    
    this.onHit = onHit;
    this.onArrival = onArrival;
  };


  update(time, delta) {
    this._updateMovement(time, delta);
    this._pushState();
  };
  
  _updateMovement = (time, delta) => {
    const { target } = this.queuedState.physics;
    
    if (target) {
      this._setTarget(target);
    }
    
    const { destination } = this.queuedState.physics;
    if (destination) {
      if (this._hasArrived(destination)) {
        this._handleHasArrived();
      } else {
        const { x: cx, y: cy } = this.body.center;
        this.scene.physics.moveTo(this, destination.x, destination.y, this.stats[C.Stats.MS]);
      }
    }
  };
  
  _hasArrived = (coords) => {
    const { x: cx, y: cy } = this.body.center;
    const { velocity: { x: vx, y: vy } } = this.body;
    
    const arrivedX = (Math.abs(cx - coords.x) <= 1) || (vx > 0 && cx > coords.x) || (vx < 0 && cx < coords.x);
    const arrivedY = (Math.abs(cy - coords.y) <= 1) || (vy > 0 && cy > coords.y) || (vy < 0 && cy < coords.y);
    
    return arrivedX && arrivedY;  
  };
  
  _handleHasArrived = () => {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    
    this.queuedState.physics.destination = null;
    this.queuedState.physics.target = null;
  
    if (this.onArrival) this.onArrival(this);
    this.destroy();
  }
  
  _setTarget = (target) => {
    const destination = target.getHitboxCenter();
    this._setDestination(destination);

    this.queuedState.physics.target = target;
  };
  
  _setDestination = (destination) => {
    this.queuedState.physics.destination = destination;
  };
  
  triggerMove(destination) {
    this._setDestination(destination);
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  };
};
