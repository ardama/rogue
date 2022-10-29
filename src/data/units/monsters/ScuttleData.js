import C from '../../../utils/constants.js';
import Attack from '../../../classes/attacks/Attack.js';

const ScuttleData = {
  name: C.Monsters.SCUTTLE,
  appearance: {
    animations: [
      {
        key: `${C.Monsters.SCUTTLE}_${C.Animations.IDLE}_${C.Directions.U}`,
        frameSource: 'teemo-base',
        frameStart: 8,
        frameEnd: 8,
        frameRate: 1,
      },
      {
        key: `${C.Monsters.SCUTTLE}_${C.Animations.IDLE}_${C.Directions.D}`,
        frameSource: 'teemo-base',
        frameStart: 0,
        frameEnd: 0,
        frameRate: 1,
      },
      {
        key: `${C.Monsters.SCUTTLE}_${C.Animations.IDLE}_${C.Directions.L}`,
        frameSource: 'teemo-base',
        frameStart: 24,
        frameEnd: 24,
        frameRate: 1,
      },
      {
        key: `${C.Monsters.SCUTTLE}_${C.Animations.IDLE}_${C.Directions.R}`,
        frameSource: 'teemo-base',
        frameStart: 16,
        frameEnd: 16,
        frameRate: 1,
      },
      {
        key: `${C.Monsters.SCUTTLE}_${C.Animations.MOVE}_${C.Directions.U}`,
        frameSource: 'teemo-base',
        frameStart: 8,
        frameEnd: 15,
        frameRate: 20,
      },
      {
        key: `${C.Monsters.SCUTTLE}_${C.Animations.MOVE}_${C.Directions.D}`,
        frameSource: 'teemo-base',
        frameStart: 0,
        frameEnd: 7,
        frameRate: 20,
      },
      {
        key: `${C.Monsters.SCUTTLE}_${C.Animations.MOVE}_${C.Directions.L}`,
        frameSource: 'teemo-base',
        frameStart: 24,
        frameEnd: 31,
        frameRate: 20,
      },
      {
        key: `${C.Monsters.SCUTTLE}_${C.Animations.MOVE}_${C.Directions.R}`,
        frameSource: 'teemo-base',
        frameStart: 16,
        frameEnd: 23,
        frameRate: 20,
      },
    ],
  },
  stats: {
    static: {
      hitbox: {
        h: 16,
        w: 16,
        shape: 'circle',
      },
    },
    base: {
      [C.Stats.AD]: 50,
      [C.Stats.AS]: 0.75,
      [C.Stats.RG]: 60,
      [C.Stats.AP]: 0,
      [C.Stats.AH]: 0,
      [C.Stats.MS]: 60,
      [C.Stats.HP]: 500,
      [C.Stats.MR]: 20,
      [C.Stats.AR]: 20,
    },
    scaling: {
      [C.Stats.AD]: 0,
      [C.Stats.AS]: 0,
      [C.Stats.RG]: 0,
      [C.Stats.AP]: 0,
      [C.Stats.AH]: 0,
      [C.Stats.MS]: 0,
      [C.Stats.HP]: 0,
      [C.Stats.MR]: 0,
      [C.Stats.AR]: 0,
    },
  },
  attack: Attack,
  spells: [],
};

export default ScuttleData;
