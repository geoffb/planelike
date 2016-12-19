var random = require("./util/random.js");

var exports = module.exports = function (width, height) {
  this.cells = null;
  this.resize(width, height);
};

var proto = exports.prototype;

proto.resize = function (width, height) {
  let cells = this.cells = [];
  for (let y = 0; y < height; ++y) {
    let row = [];
    for (let x = 0; x < width; ++x) {
      row.push(0);
    }
    cells.push(row);
  }
};

proto.generate = function () {
  for (let y = 0; y < this.height; ++y) {
    for (let x = 0; x < this.width; ++x) {
      this.set(x, y, random.integer(1));
    }
  }
  this.evolve(1);
};

proto.copy = function () {
  let copy = new exports(this.width, this.height);
  for (let y = 0; y < this.height; ++y) {
    for (let x = 0; x < this.width; ++x) {
      copy.cells[y][x] = this.cells[y][x];
    }
  }
  return copy;
};

proto.valid = function (x, y) {
  return x > -1 && y > -1 && x < this.width && y < this.height;
};

proto.get = function (x, y) {
  if (this.valid(x, y)) {
    return this.cells[y][x];
  } else {
    return null;
  }
};

proto.set = function (x, y, value) {
  if (!this.valid(x, y)) { return; }
  this.cells[y][x] = value;
};

proto.evolve = function (iterations) {
  for (let i = 0; i < iterations; ++i) {
    let copy = this.copy();
    for (let y = 0; y < copy.height; ++y) {
      for (let x = 0; x < copy.width; ++x) {
        let count = copy.countNeighbors(x, y);
        let value = count > 5 ? 1 : 0;
        this.set(x, y, value);
      }
    }
  }
};

proto.countNeighbors = function (x, y) {
  let count = 0;
  for (let sy = y - 1; sy <= (y + 1); ++sy) {
    for (let sx = x - 1; sx <= (x + 1); ++sx) {
      if (sx === 0 && sy === 0) { continue; }
      let cx = x + sx;
      let cy = y + sy;
      let tile = this.get(cx, cy);
      if (tile === null) {
        count += 2;
      } else if (tile === 1) {
        ++count;
      }
    }
  }
  return count;
};

Object.defineProperty(proto, "width", {
  get: function () {
    return this.cells[0].length;
  }
});

Object.defineProperty(proto, "height", {
  get: function () {
    return this.cells.length;
  }
});
