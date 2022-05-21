import { randomInt } from '../../utils/helpers.js';

export default class ProceduralMapTile {
  constructor(map, x, y) {
    this.coords = {};
    this.coords.x = x;
    this.coords.y = y;
    
    this.coords.tileX = x;
    this.coords.tileY = y;
    
    this.isEdge = false;
    
    const worldCoords = map.toWorldCoords(x, y);
    this.coords.worldX = worldCoords.x;
    this.coords.worldY = worldCoords.y;
    
    this.state = {
      layers: {
        terrain: undefined,
        object: undefined,
      },
      dirty: {
        terrain: false,
        object: false,
      },
    }
    
    this.neighbors = [];
    
    // extract functions from map object
    this._placeTerrainTile = (key) => { map.placeTerrainTile(key, this.coords.x, this.coords.y); };
    this._placeObjectTile = (key) => { map.placeObjectTile(key, this.coords.x, this.coords.y); };
    this._setMapTileDirty = (dirty) => { map.setMapTileDirty(this.coords, dirty); }
  }
  
  // RENDERING FUNCTIONS
  render = () => {
    if (this.state.dirty.terrain) {
      this._renderTerrain();
    }
    if (this.state.dirty.object) {
      this._renderObject();
    }
    
    this._setDirty(null);
  }
  _setDirty = (layer) => {
    if (layer) {
      this.state.dirty[layer] = true;
      this._setMapTileDirty(true);
    } else {
      this.state.dirty = { terrain: false, object: false };
      this._setMapTileDirty(false);
    }
  }
  
  
  // TERRAIN RENDERING FUNCTIONS
  _renderTerrain = () => {
    const terrainKey = this._getTerrainTile();
    this._placeTerrainTile(terrainKey);
  }
  _getTerrainTile = () => {
    return randomInt(3, 5);
  }
  getTerrain = () => {
    return this.state.layers.terrain;
  }
  setTerrain = (terrain) => {
    if (this.state.layers.terrain !== terrain) {
      this.state.layers.terrain = terrain;
      this._setDirty('terrain');
    }
  }


  // OBJECT RENDERING FUNCTIONS
  _renderObject = () => {
    if (this.state.layers.object) {
      this._placeObjectTile(999);
    } else {
      this._placeObjectTile(-1);
    }
  }
  getObject = () => {
    return this.state.layers.object;
  }
  setObject = (prop) => {
    if (this.state.layers.object !== prop) {
      this.state.layers.object = prop;
      this._setDirty('object');
    }
  }


  // ATTRIBUTE FUNCTIONS
  getIsEdge = () => {
    return this.isEdge;
  }
  setIsEdge = (isEdge) => {
    this.isEdge = isEdge;
  }
  
  getNeighbor = (direction) => {};
  setNeighbors = (neighbors) => {
    this.neighbors = neighbors;
  };
  
  getCoords = () => {
    return this.coords;
  }
}
