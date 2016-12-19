let draw = require("./util/draw");
let math = require("./util/math");
let string = require("./util/string");
let Map = require("./Map");
let prefabs = require("./prefabs");

const CONFIG = require("./config");

let TILES = [
  { color: "#CCCCCC" }, // Floor
  { color: "#666666" }, // Wall
];

let SPRITES = [
  { glyph: "@", color: "blue" },
  { glyph: "#", color: "#888888" },
  { glyph: "s", color: "darkgreen" },
  { glyph: "r", color: "brown" },
  { glyph: "$", color: "gold" },
  { glyph: "*", color: "purple" },
  { glyph: "g", color: "green" },
  { glyph: "&", color: "darkgreen" },
  { glyph: "D", color: "brown" }
];

var sprites = draw.createCanvas(SPRITES.length * CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
let tiles = draw.createCanvas(TILES.length * CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
var stage = draw.createCanvas(CONFIG.STAGE_WIDTH, CONFIG.STAGE_HEIGHT, true);

let createTiles = function () {
  let ctx = tiles.getContext("2d");
  for (let i = 0; i < TILES.length; ++i) {
    let tile = TILES[i];
    ctx.fillStyle = tile.color;
    ctx.fillRect(i * CONFIG.GRID_SIZE, 0, CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
  }
};

let createSprites = function () {
  let ctx = sprites.getContext("2d");
  ctx.font = "32px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < SPRITES.length; ++i) {
    let sprite = SPRITES[i];
    let x = Math.round(i * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2);
    let y = Math.round(CONFIG.GRID_SIZE / 2);
    ctx.fillStyle = sprite.color;
    ctx.fillText(sprite.glyph, x, y);
  }
};

let createEntity = function (type) {
  if (!prefabs[type]) {
    console.warn("Invalid entity type: " + type);
    return null;
  }
  let entity = JSON.parse(JSON.stringify(prefabs[type]));
  entity.type = type;
  return entity;
};

let map = new Map(55, 55);
map.generate();

let entities = [];

let player = createEntity("player");
player.x = 1;
player.y = 1;

let monster = createEntity("snake");
monster.x = 2;
monster.y = 2;

entities.push(player, monster);

var render = function () {
  var ctx = stage.getContext("2d");

  // Clear with black
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, stage.width, stage.height);

  let maxX = map.width - CONFIG.MAP_VIEW_WIDTH;
  let maxY = map.height - CONFIG.MAP_VIEW_HEIGHT;
  let mapX = math.clamp(player.x - Math.floor(CONFIG.MAP_VIEW_WIDTH / 2), 0, maxX);
  let mapY = math.clamp(player.y - Math.floor(CONFIG.MAP_VIEW_HEIGHT / 2), 0, maxY);

  // Render map
  for (let y = mapY; y < mapY + CONFIG.MAP_VIEW_HEIGHT; ++y) {
    for (let x = mapX; x < mapX + CONFIG.MAP_VIEW_WIDTH; ++x) {
      let index = map.get(x, y);
      ctx.drawImage(tiles,
        index * CONFIG.GRID_SIZE, 0, CONFIG.GRID_SIZE, CONFIG.GRID_SIZE,
        (x - mapX) * CONFIG.GRID_SIZE, (y - mapY) * CONFIG.GRID_SIZE, CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    }
  }

  // Render entities
  for (let i = 0; i < entities.length; ++i) {
    let entity = entities[i];
    let ex = entity.x - mapX;
    let ey = entity.y - mapY;
    if (ex < 0 || ey < 0 || ex > CONFIG.MAP_VIEW_WIDTH || ey > CONFIG.MAP_VIEW_HEIGHT) {
      continue;
    }
    ctx.drawImage(sprites,
      entity.sprite * CONFIG.GRID_SIZE, 0, CONFIG.GRID_SIZE, CONFIG.GRID_SIZE,
      ex * CONFIG.GRID_SIZE, ey * CONFIG.GRID_SIZE, CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
  }

  // Render sidebar
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "16px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  let textX = CONFIG.STAGE_WIDTH - CONFIG.SIDEBAR_WIDTH + 4;

  ctx.fillText("HP: " + player.hp, textX, 4);
};

createTiles();
createSprites();

let getEntityAt = function (x, y) {
  for (let i = 0; i < entities.length; ++i) {
    let entity = entities[i];
    if (entity.x === x && entity.y === y) {
      return entity;
    }
  }
  return null;
};

let moveEntity = function (entity, dirX, dirY) {
  let newX = entity.x + dirX;
  let newY = entity.y + dirY;

  // Check for OOB
  if (!map.valid(newX, newY)) {
    console.warn("Out of bounds: " + newX + ", " + newY);
    return;
  }

  // Check for walls
  if (map.get(newX, newY) !== 0) {
    console.warn("Hit a wall: " + newX + ", " + newY);
    return;
  }

  let target = getEntityAt(newX, newY);
  if (target === null) {
    // Nothing here, free to move
    entity.x = newX;
    entity.y = newY;
  } else {
    // Attack target
    target.hp -= entity.attack;
    console.log(string.sprintf("%s attacked %s for %s damage", entity.type, target.type, entity.attack));
    if (target.hp <= 0) {
      console.log(string.sprintf("%s died", target.type));
      let index = entities.indexOf(target);
      if (index !== -1) {
        entities.splice(index, 1);
      }
    }
  }
};

let keyDown = function (e) {
  switch (e.keyCode) {
    case 37: // Left
      moveEntity(player, -1, 0);
      render();
      break;
    case 38: // Up
      moveEntity(player, 0, -1);
      render();
      break;
    case 39: // Right
      moveEntity(player, 1, 0);
      render();
      break;
    case 40: // Down
      moveEntity(player, 0, 1);
      render();
      break;
    default:
      console.info("No key bind: " + e.keyCode);
      break;
  }
};

window.addEventListener("keydown", keyDown, false);

render();
