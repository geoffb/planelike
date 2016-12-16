let math = {};

math.clamp = function (n, min, max) {
  return Math.max(min, Math.min(n, max));
};
