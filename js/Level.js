var math = require("./util/math");
var string = require("./util/string");
var Map = require("./Map");
var generate = require("./generate");
var prefabs = require("./prefabs");
var ai = require("./ai");

var exports = module.exports = function () {
  this.map = new Map(10, 10);
  this.entities = [];
  this.player = this.createEntity("player");
  this.log = [];
};

var proto = exports.prototype;

proto.generate = function () {
  this.log.length = 0;

  this.map.resize(55, 55);
  generate.cellular(this.map);

  this.entities.length = 0;

  this.map.forEach(function (value, x, y) {
    if (value === 0) {
      this.player.x = x;
      this.player.y = y;
      return true;
    }
  }, this);
  this.addEntity(this.player);
};

proto.addLog = function () {
  let message = string.sprintf.apply(null, arguments);
  this.log.push(message);
  console.info(message);
};

proto.createEntity = function (type) {
  if (!prefabs[type]) {
    console.warn("Invalid entity type: " + type);
    return null;
  }
  let entity = JSON.parse(JSON.stringify(prefabs[type]));
  entity.type = type;
  return entity;
};

proto.addEntity = function (entity) {
  this.entities.push(entity);
};

proto.removeEntity = function (entity) {
  let index = this.entities.indexOf(entity);
  if (index !== -1) {
    this.entities.splice(index, 1);
  }
};

proto.getEntityAt = function (x, y) {
  for (let i = 0; i < this.entities.length; ++i) {
    let entity = this.entities[i];
    if (entity.x === x && entity.y === y) {
      return entity;
    }
  }
  return null;
};

proto.movePlayer = function (dx, dy) {
  this.log.length = 0;
  this._moveEntity(this.player, dx, dy);
  this._step();
};

proto._moveEntity = function (entity, dirX, dirY) {
  let newX = entity.x + dirX;
  let newY = entity.y + dirY;

  // Check for OOB
  if (!this.map.valid(newX, newY)) {
    return;
  }

  // Check for walls
  if (this.map.get(newX, newY) !== 0) {
    return;
  }

  let target = this.getEntityAt(newX, newY);
  if (target === entity) {
    console.warn("Cannot move/attack self: " + entity.type);
    return;
  }

  if (target === null) {
    // Nothing here, free to move
    entity.x = newX;
    entity.y = newY;
  } else {
    // Attack target
    let damage = entity.attack;
    target.hp -= damage;
    this.addLog("%s attacked %s for %s damage", entity.name, target.name, damage);
    if (target.hp <= 0) {
      this.removeEntity(target);
      this.addLog("%s died", target.name);
    }
  }
};

proto._step = function () {
  for (let i = 0; i < this.entities.length; ++i) {
    let entity = this.entities[i];
    if (entity.ai && ai[entity.ai]) {
      ai[entity.ai].call(this, entity);
    }
  }
};
