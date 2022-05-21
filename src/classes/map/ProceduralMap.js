import {
  createGrid,
  forEachGridCell,
  getGridCell,
  pointToString,
  stringToPoint,
} from '../../utils/helpers.js';

import C from '../../utils/constants.js';
import ProceduralMapTile from './ProceduralMapTile.js';
import Prop from '../objects/Prop.js';

export default class ProceduralMap {
  constructor(scene, tilesize, tileW, tileH, borderTileW) {
    this.scene = scene;
    
    this.tilesize = tilesize;
    
    this.dimensions = {};
    this.dimensions.tileW = tileW;
    this.dimensions.tileH = tileH;
    this.dimensions.w = this.dimensions.tileW * this.tilesize;
    this.dimensions.h = this.dimensions.tileH * this.tilesize;
    this.borderTileW = borderTileW;
    
    this.tilemap = this.scene.make.tilemap({
      tileWidth: this.tilesize,
      tileHeight: this.tilesize,
      width: this.dimensions.tileW,
      height: this.dimensions.tileH,
    });
    
    this.tilesets = {
      terrain: this.tilemap.addTilesetImage('terrain-extended-18', 'terrain-extended-18', this.tilesize, this.tilesize, 1, 2),
      foliage: this.tilemap.addTilesetImage('foliage', 'foliage', this.tilesize, this.tilesize, 0, 0),
    };
    
    this.state = {
      dirtyTilesSet: new Set(),
    };
    this._initializeMap()
  };
  
  _initializeMap = () => {
    this._initializeMapTiles();
    this._initializeLayers();
    
    this._generateTerrain();
    this._generateFoliage();
  };
  
  _initializeMapTiles = () => {
    this.mapTiles = createGrid(this.dimensions.tileH, this.dimensions.tileW, (y, x) => {
      const mapTile = new ProceduralMapTile(this, x, y);
      if (
        x < this.borderTileW
        || x >= this.dimensions.tileW - this.borderTileW
        || y < this.borderTileW
        || y >= this.dimensions.tileH - this.borderTileW
      ) {
        mapTile.setIsEdge(true);
      }
      return mapTile;
    }, true);
    
    forEachGridCell(this.mapTiles, (mapTile, x, y) => {
      const neighbors = [
        getGridCell(this.mapTiles, x - 1, y - 1),
        getGridCell(this.mapTiles, x - 1, y),
        getGridCell(this.mapTiles, x - 1, y + 1),
        getGridCell(this.mapTiles, x, y - 1),
        getGridCell(this.mapTiles, x, y + 1),
        getGridCell(this.mapTiles, x + 1, y - 1),
        getGridCell(this.mapTiles, x + 1, y),
        getGridCell(this.mapTiles, x + 1, y + 1),
      ];
      mapTile.setNeighbors(neighbors);
    });
  };
  
  // MAP GENERATION FUNCTIONS
  _initializeLayers = () => {
    this.layers = {};
    this._initializeTerrainLayer();
    this._initializeObjectLayer();
  }
  
  _initializeTerrainLayer = () => {
    this.layers.terrain = this.tilemap.createBlankLayer("terrain", this.tilesets.terrain);
    this.layers.terrain.depth = 0;
    // TODO: set terrain collision
    // this.layers.terrain.setCollision([this.tilesheets.terrain[C.Map.Terrain.Water]]);
  };
  
  _initializeObjectLayer = () => {
    this.layers.object = this.tilemap.createBlankLayer("object", this.tilesets.terrain);
    this.layers.object.setCollision([999]);
  };

  _generateTerrain = () => {
    forEachGridCell(this.mapTiles, (mapTile, tileX, tileY) => {
      mapTile.setTerrain(C.Map.Terrain.Forest);
    });
  }
  
  _generateFoliage = () => {
    forEachGridCell(this.mapTiles, (mapTile, tileX, tileY) => {
      if (mapTile.getIsEdge()) {
        const mapTileCoords = mapTile.getCoords();
        const propX = mapTileCoords.x * this.tilesize + this.tilesize / 2;
        const propY = mapTileCoords.y * this.tilesize;
        const prop = new Prop(this.scene, propX, propY, C.Map.Foliage.Tree.Pine.L1S1_A);
        mapTile.setObject(prop);
      }
    });
  }
  
  
  // UPDATE FUNCTIONS
  update(time, delta) {
    [...this.state.dirtyTilesSet].forEach((location) => {
      const coords = stringToPoint(location);
      const mapTile = this.getMapTile(coords.x, coords.y);
      mapTile.render();
    })
  };


  // UTILITY FUNCTIONS
  placeTerrainTile = (key, x, y) => {
    this.layers['terrain'].putTileAt(key, x, y);
  }
  placeObjectTile = (key, x, y) => {
    this.layers['object'].putTileAt(key, x, y);
  }
  
  setMapTileDirty = (mapTile, dirty) => {
    const pointStr = pointToString(mapTile);
    if (dirty) this.state.dirtyTilesSet.add(pointStr);
    else this.state.dirtyTilesSet.delete(pointStr);
  };
  
  getMapTile = (tileX, tileY, worldX, worldY) => {
    if (this.isValidTileCoords(tileX, tileY)) {
      return this.mapTiles[tileY][tileX];
    } else {
      const tileCoords = this.toTileCoords(worldX, worldY);
      if (this.isValidTileCoords(tileCoords.x, tileCoords.y)) {
        return this.mapTiles[tileCoords.y][tileCoords.x];
      }
    }
    return null;
  };

  toWorldCoords = (x, y) => {
    const half = this.tilesize / 2;
    return { x: half + x * this.tilesize, y: half + y * this.tilesize };
  }
  
  toTileCoords = (x, y) => {
    return { x: Math.floor(x / this.tilesize), y: Math.floor(y / this.tilesize) };
  }

  isValidTileCoords = (x, y) => {
    return x >= 0 && x < this.dimensions.tileW && y >= 0 && y < this.dimensions.tileH;
  }
}
