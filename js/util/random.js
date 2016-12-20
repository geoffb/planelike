exports.normal = function () {
  return Math.random();
};

exports.integer = function (max) {
  return Math.round(exports.normal() * max);
};

exports.chance = function (chance) {
  return exports.normal() < chance;
};
