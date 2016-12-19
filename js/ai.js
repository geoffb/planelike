var math = require("./util/math");

exports.monster = function (entity) {
  let dx = this.player.x - entity.x;
  let dy = this.player.y - entity.y;
  if (dx === 0 && dy === 0) { return; }
  if (Math.abs(dx) > Math.abs(dy)) {
    this._moveEntity(entity, math.sign(dx), 0);
  } else {
    this._moveEntity(entity, 0, math.sign(dy));
  }
};
