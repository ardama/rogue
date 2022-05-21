const Constants = {
  Keycodes: Phaser.Input.Keyboard.KeyCodes,
  Classes: {
    Mushroom: 'Mushroom',
    Prop: 'Prop',
  },
  Map: {
    Terrain: {
      Forest: 'forest',
      Jungle: 'jungle',
      Plains: 'plains',
      River: 'river',
      Lake: 'lake',
      Beach: 'beach',
      Mountain: 'mountain',
      Town: 'town',
      Path: 'path',
    },
    Foliage: {
      Tree: {
        Pine: {
          // "L1_A": "tree__pine__L1__A",
          // "L1_B": "tree__pine__L1__B",
          // "L1M1_A": "tree__pine__L1M1__A",
          // "M2_A": "tree__pine__M2__A",
          // "M2_B": "tree__pine__M2__B",
          // "M3_A": "tree__pine__M3__A",
          "L1S1_A": "tree__pine__L1S1__A",
          "L1S1_B": "tree__pine__L1S1__B",
          "M1S1_A": "tree__pine__M1S1__A",
          "M1S2_A": "tree__pine__M1S2__A",
          "M1S2_B": "tree__pine__M1S2__B",
        }
      },
    },
  },
  Monsters: {
    MELEE: 'melee',
    RANGED: 'ranged',
    CANNON: 'cannon',
    RAZORBEAK_L: 'razorbeak_l',
    RAZORBEAK_S: 'razorbeak_s',
    WOLF_L: 'wolf_l',
    WOLF_S: 'wolf_s',
    KRUG_L: 'krug_l',
    KRUG_M: 'krug_m',
    KRUG_S: 'krug_s',
    GROMP: 'gromp',
    RED: 'red_sentinel',
    BLUE: 'blue_sentinel',
    D_INFERNAL: 'drake_infernal',
    D_OCEAN: 'drake_ocean',
    D_CLOUD: 'drake_cloud',
    D_MOUNTAIN: 'drake_mountain',
    D_HEXTECH: 'drake_hextech',
    D_ELDER: 'drake_elder',
    RIFT: 'rift_herald',
    BARON: 'baron_nashor', 
  },  
};

export default Constants;
