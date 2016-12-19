exports.sprintf = function () {
  let string = arguments[0];
  for (let i = 1; i < arguments.length; ++i) {
    string = string.replace(/%s/, arguments[i]);
  }
  return string;
};
