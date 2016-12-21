let draw = require("./util/draw");
let math = require("./util/math");
let Level = require("./Level");

const CONFIG = require("./config");

let TILES = [
  { color: "#CCCCCC" }, // Floor
  { color: "#666666" }, // Wall
];

let SPRITES = [
  { glyph: "@", color: "blue" }, // 0
  { glyph: "#", color: "#888888" }, // 1
  { glyph: "s", color: "darkgreen" }, // 2
  { glyph: "r", color: "brown" }, // 3
  { glyph: "$", color: "gold" }, // 4
  { glyph: "*", color: "purple" }, // 5
  { glyph: "g", color: "green" }, // 6
  { glyph: "&", color: "darkgreen" }, // 7
  { glyph: "D", color: "brown" }, // 8
  { glyph: "^", color: "#000000" }, // 9
  { glyph: "v", color: "#000000" } // 10
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

var render = function () {
  var ctx = stage.getContext("2d");

  let map = level.map;

  // Clear with black
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, stage.width, stage.height);

  let maxX = map.width - CONFIG.MAP_VIEW_WIDTH;
  let maxY = map.height - CONFIG.MAP_VIEW_HEIGHT;

  // Center camera on player
  let mapX = math.clamp(level.player.x - Math.floor(CONFIG.MAP_VIEW_WIDTH / 2), 0, maxX);
  let mapY = math.clamp(level.player.y - Math.floor(CONFIG.MAP_VIEW_HEIGHT / 2), 0, maxY);

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
  for (let i = 0; i < level.entities.length; ++i) {
    let entity = level.entities[i];
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

  ctx.fillText("HP: " + level.player.hp, textX, 4);

  // Render log
  ctx.fillStyle = "#000000";
  let lineHeight = 16;
  let y = stage.height - (lineHeight * level.log.length) - 4;
  for (let i = 0; i < level.log.length; ++i) {
    ctx.fillText(level.log[i], 4, y);
    y += lineHeight;
  }
};

let keyDown = function (e) {
  switch (e.keyCode) {
    case 37: // Left
      level.movePlayer(-1, 0);
      render();
      break;
    case 38: // Up
      level.movePlayer(0, -1);
      render();
      break;
    case 39: // Right
      level.movePlayer(1, 0);
      render();
      break;
    case 40: // Down
      level.movePlayer(0, 1);
      render();
      break;
    default:
      console.info("No key bind: " + e.keyCode);
      break;
  }
};

window.addEventListener("keydown", keyDown, false);

createTiles();
createSprites();

let level = new Level();
level.generate();

render();
