let random = require("../util/random");

let countWalls = function (map, x, y) {
  let count = 0;
  for (let oy = -1; oy < 2; ++oy) {
    for (let ox = -1; ox < 2; ++ox) {
      let tile = map.get(x + ox, y + oy);
      if (tile === null || tile === 1) {
        ++count;
      }
    }
  }
  return count;
};

exports.generate = function (map) {
  let wallChance = 0.45;
  let iterations = 5;
  let threshold = 5;

  // Fill map with random values
  map.forEach(function (value, x, y) {
    map.set(x, y, random.chance(wallChance) ? 1 : 0);
  });

  // Advance the simulation N iterations, deciding which cells become walls
  for (let i = 0; i < iterations; ++i) {
    let copy = map.copy();
    copy.forEach(function (value, x, y) {
      let count = countWalls(copy, x, y);
      let v = count >= threshold ? 1 : 0;
      map.set(x, y, v);
    });
  }
};
