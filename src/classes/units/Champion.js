import Unit from './Unit.js';
import ChampionData from '../../data/units/ChampionData.js';
import _ from 'lodash';


const baseChampionData = {
  
};

export default class Champion extends Unit {
  constructor(scene, x, y, championName) {
    const championData = ChampionData[championName];
    const unitData = _.merge({}, baseChampionData, championData);

    super(scene, x, y, unitData);
  };
  
  // triggerAttack() {
  // };
  // 
  // triggerSpell() {
  // };
}
