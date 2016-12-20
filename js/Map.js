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

proto.forEach = function (fn, context) {
  let cells = this.cells;
  for (let y = 0; y < this.height; ++y) {
    for (let x = 0; x < this.width; ++x) {
      if (fn.call(context, cells[y][x], x, y)) {
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
