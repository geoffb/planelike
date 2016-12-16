let draw = {};

draw.createCanvas = function (width, height, visible) {
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  if (visible) {
    document.body.appendChild(canvas);
  }
  return canvas;
};
