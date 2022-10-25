import Spell from './Spell.js';

const BlindingDartData = {
  name: 'BlindingDart',
  stats: {
    base: {
      charges: 1,
      chargeTime: 5000,
      cooldownTime: -1,
    },
  },
};
export class BlindingDart extends Spell {
  constructor(unit) {
    super(unit, BlindingDartData);
  }
  
  fire() {
    super.fire();
  }
};

const MoveQuickData = {
  name: 'MoveQuick',
  stats: {
    base: {
      charges: 3,
      chargeTime: 8000,
      cooldownTime: 2000,
    },
  },
};
export class MoveQuick extends Spell {
  constructor(unit) {
    super(unit, MoveQuickData);
  }
  
  fire() {
    super.fire();
  }
};

const PoisonShotData = {
  name: 'PoisonShot',
  stats: {
    base: {
      charges: -1,
      chargeTime: -1,
      cooldownTime: -1,
    },
  },
};
export class PoisonShot extends Spell {
  constructor(unit) {
    super(unit, PoisonShotData);
  }
  
  fire() {
    super.fire();
  }
};

const NoxiousTrapData = {
  name: 'NoxiousTrap',
  stats: {
    base: {
      charges: -1,
      chargeTime: -1,
      cooldownTime: -1,
    },
  },
};
export class NoxiousTrap extends Spell {
  constructor(unit) {
    super(unit, NoxiousTrapData);
  }
  
  fire() {
    super.fire();
  }
};
