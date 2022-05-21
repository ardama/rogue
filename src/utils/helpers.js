export function randomInt(a, b) {
  if (b < a) {
    return 0;
  }

  const min = b ? a : 0;
  const max = b ? b : a;

  const delta = (max - min) + 1;
  return min + Math.floor(delta * Math.random());
}

export function pointToString({x, y}) {
  return `${x},${y}`;
}

export function stringToPoint(str) {
  const [x, y] = str.split(',');
  return { x: parseInt(x, 10), y: parseInt(y, 10) };
}

export function createGrid(rows, columns, defaultValue, seal) {
  const s = seal && !!Object.seal;
  const grid = [...Array(rows)].map((_, r) => {
      const row = [...Array(columns)].map((_, c) => {
        if (typeof defaultValue === 'function') {
          return defaultValue(r, c);
        }
        return defaultValue;
      });

      return seal ? Object.seal(row) : row;
  });
  return seal ? Object.seal(grid) : grid;
};

export function forEachGridCell(grid, callback, xFilter, yFilter) {
  grid.forEach((row, r) => {
    if (!yFilter || yFilter(r)) {
      row.forEach((cell, c) => {
        if (!xFilter || xFilter(c)) {
          callback(cell, c, r);
        }
      });
    }
  });
};

export function getGridCell(grid, x, y) {
  if (x < 0 || y < 0 || x >= grid[0].length || y >= grid.length) {
    return null;
  }
  
  return grid[y][x];
}

export class Counter {
  constructor(start) {
    this.count = start || 0;
  };

  next = () => this.count++;
};
