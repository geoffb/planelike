var math = require("./util/math");
var random = require("./util/random");

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
      row.push(1);
    }
    cells.push(row);
  }
};

proto.copy = function () {
  let copy = new exports(this.width, this.height);
  this.forEach(function (value, x, y) {
    copy.set(x, y, value);
  });
  return copy;
};

proto.valid = function (x, y) {
  return (
    x >= 0 &&
    y >= 0 &&
    x < this.width &&
    y < this.height);
};

proto.get = function (x, y) {
  if (this.valid(x, y)) {
    return this.cells[y][x];
  } else {
    return null;
  }
};

proto.set = function (x, y, value) {
  if (!this.valid(x, y)) {
    console.warn("Tried to set invalid cell: " + x + ", " + y);
    return;
  }
  this.cells[y][x] = value;
};

proto.setCircle = function (x, y, radius, value) {
  for (let oy = -radius; oy <= radius; ++oy) {
    for (let ox = -radius; ox <= radius; ++ox) {
      let dx = x + ox;
      let dy = y + oy;
      let dist = math.distance(x, y, dx, dy);
      if (dist <= radius) {
        this.set(dx, dy, value);
      }
    }
  }
};

proto.forEach = function (fn, context) {
  let cells = this.cells;
  for (let y = 0; y < this.height; ++y) {
    for (let x = 0; x < this.width; ++x) {
      if (fn.call(context, cells[y][x], x, y) === true) {
        return;
      }
    }
  }
};

proto.forEachNeighbor = function (x, y, fn, context) {
  let cells = this.cells;
  for (let oy = -1; oy < 2; ++oy) {
    for (let ox = -1; ox < 2; ++ox) {
      if (ox === 0 && oy === 0) { continue; }
      let nx = x + ox;
      let ny = y + oy;
      if (fn.call(context, this.get(nx, ny), nx, ny) === true) {
        return;
      }
    }
  }
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
