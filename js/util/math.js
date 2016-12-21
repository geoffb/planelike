exports.clamp = function (n, min, max) {
  return Math.max(min, Math.min(n, max));
};

exports.sign = function (n) {
  if (n === 0) {
    return 0;
  } else {
    return n > 0 ? 1 : -1;
  }
};

exports.distance = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
