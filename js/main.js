const GRID_SIZE = 32;

const MAP_VIEW_WIDTH = 9;
const MAP_VIEW_HEIGHT = 9;

const STAGE_WIDTH = MAP_VIEW_WIDTH * GRID_SIZE;
const STAGE_HEIGHT = MAP_VIEW_HEIGHT * GRID_SIZE;

let TILES = [
  { color: "#CCCCCC" }, // Floor
  { color: "#999999" }, // Wall
];

let SPRITES = [
  { glyph: "@", color: "blue" }, // Player
  { glyph: "#", color: "#888888" },
  { glyph: "s", color: "#00FF00" },
  { glyph: "r", color: "brown" },
  { glyph: "$", color: "gold" },
  { glyph: "*", color: "purple" },
  { glyph: "g", color: "green" },
  { glyph: "&", color: "darkgreen" }
];

var sprites = draw.createCanvas(SPRITES.length * GRID_SIZE, GRID_SIZE);
let tiles = draw.createCanvas(TILES.length * GRID_SIZE, GRID_SIZE);
var stage = draw.createCanvas(STAGE_WIDTH, STAGE_HEIGHT, true);

let createTiles = function () {
  let ctx = tiles.getContext("2d");
  for (let i = 0; i < TILES.length; ++i) {
    let tile = TILES[i];
    ctx.fillStyle = tile.color;
    ctx.fillRect(i * GRID_SIZE, 0, GRID_SIZE, GRID_SIZE);
  }
};

let createSprites = function () {
  let ctx = sprites.getContext("2d");
  ctx.font = "32px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < SPRITES.length; ++i) {
    let sprite = SPRITES[i];
    let x = Math.round(i * GRID_SIZE + GRID_SIZE / 2);
    let y = Math.round(GRID_SIZE / 2);
    ctx.fillStyle = sprite.color;
    ctx.fillText(sprite.glyph, x, y);
  }
};

let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let entities = [];

let player = { sprite: 0, x: 2, y: 2 };

entities.push(player);

var render = function () {
  var ctx = stage.getContext("2d");

  // Clear with black
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, stage.width, stage.height);

  let maxX = map[0].length - MAP_VIEW_WIDTH;
  let maxY = map.length - MAP_VIEW_HEIGHT;
  let mapX = math.clamp(player.x - Math.floor(MAP_VIEW_WIDTH / 2), 0, maxX);
  let mapY = math.clamp(player.y - Math.floor(MAP_VIEW_HEIGHT / 2), 0, maxY);

  // Render map
  for (let y = mapY; y < mapY + MAP_VIEW_HEIGHT; ++y) {
    for (let x = mapX; x < mapX + MAP_VIEW_WIDTH; ++x) {
      let index = map[y][x];
      ctx.drawImage(tiles,
        index * GRID_SIZE, 0, GRID_SIZE, GRID_SIZE,
        (x - mapX) * GRID_SIZE, (y - mapY) * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
  }

  // Render entities
  for (let i = 0; i < entities.length; ++i) {
    let entity = entities[i];
    ctx.drawImage(sprites,
      entity.sprite * GRID_SIZE, 0, GRID_SIZE, GRID_SIZE,
      (entity.x - mapX) * GRID_SIZE, (entity.y - mapY) * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  }
};

createTiles();
createSprites();

let moveEntity = function (entity, dirX, dirY) {
  let newX = entity.x + dirX;
  let newY = entity.y + dirY;

  // Check for OOB
  if (newX < 0 || newY < 0 || newX >= map[0].length || newY >= map.length) {
    return;
  }

  let tile = map[newY][newX];
  if (tile !== 0) { return; }

  // TODO: Check for entities

  entity.x = newX;
  entity.y = newY;
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
