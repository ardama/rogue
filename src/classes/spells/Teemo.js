import Spell from './Spell.js';
import SpellInstance from './SpellInstance.js';
import Projectile from '../objects/Projectile.js';

import TeemoData from '../../data/units/champions/TeemoData';

const BlindingDartData = {
  name: 'BlindingDart',
  class: BlindingDartInstance,
  stats: {
    base: {
      charges: 1,
      chargeTime: 5000,
      cooldownTime: -1,
    },
  },
};
export class BlindingDartInstance extends SpellInstance {
  constructor(spell, stats, origin, destination, target) {
    super(spell, stats, origin, destination, target);
  };
  
  fire() {
    const onArrival = (projectile) => {
      delete this.objects[projectile.id];
    }
    
    const projectile = new Projectile(this.scene, this.origin.x, this.origin.y);
    projectile.renderToScene();
    projectile.triggerMove(this.destination);

    this.objects[projectile.id] = projectile;
  };
};
export class BlindingDart extends Spell {
  constructor(unit) {
    super(unit, BlindingDartData);
  };
  
  _createSpellInstance = (stats, origin, destination, target) => {
    return new BlindingDartInstance(this, stats, origin, destination, target);
  };
};

const MoveQuickData = {
  name: 'MoveQuick',
  class: MoveQuickInstance,
  stats: {
    base: {
      charges: 3,
      chargeTime: 8000,
      cooldownTime: 2000,
    },
  },
};
export class MoveQuickInstance extends SpellInstance {
  constructor(spell, stats, origin, destination, target) {
    super(spell, stats, origin, destination, target);
  };
};
export class MoveQuick extends Spell {
  constructor(unit) {
    super(unit, MoveQuickData);
  }
  
  _createSpellInstance = (stats, origin, destination, target) => {
    return new MoveQuickInstance(this, stats, origin, destination, target);
  };
};

const PoisonShotData = {
  name: 'PoisonShot',
  class: PoisonShotInstance,
  stats: {
    base: {
      charges: -1,
      chargeTime: -1,
      cooldownTime: -1,
    },
  },
};
export class PoisonShotInstance extends SpellInstance {
  constructor(spell, stats, origin, destination, target) {
    super(spell, stats, origin, destination, target);
  };
};
export class PoisonShot extends Spell {
  constructor(unit) {
    super(unit, PoisonShotData);
  }
  
  _createSpellInstance = (stats, origin, destination, target) => {
    return new PoisonShotInstance(this, stats, origin, destination, target);
  };
};

const NoxiousTrapData = {
  name: 'NoxiousTrap',
  class: NoxiousTrapInstance,
  stats: {
    base: {
      charges: -1,
      chargeTime: -1,
      cooldownTime: -1,
    },
  },
};
export class NoxiousTrapInstance extends SpellInstance {
  constructor(spell, stats, origin, destination, target) {
    super(spell, stats, origin, destination, target);
  };
};
export class NoxiousTrap extends Spell {
  constructor(unit) {
    super(unit, NoxiousTrapData);
  }
  
  _createSpellInstance = (stats, origin, destination, target) => {
    return new NoxiousTrapInstance(this, stats, origin, destination, target);
  };
};
