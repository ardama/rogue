import Unit from './Unit.js';
import MonsterData from '../../data/units/monsters/MonsterData.js';
import _ from 'lodash';


const baseMonsterData = {
  
};

export default class Monster extends Unit {
  constructor(scene, x, y, championName) {
    const championData = MonsterData[championName];
    const unitData = _.merge({}, baseMonsterData, championData);

    super(scene, x, y, unitData);
  };
}
