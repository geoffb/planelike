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
