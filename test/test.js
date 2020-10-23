var game = new Phaser.Game(640, 480, Phaser.AUTO, 'phaser-example', 
{preload: preload, create: create, update: update});
const BASE_TILE_X = 40;
const BASE_TILE_Y = 44;
const TILE_MAP = {
  '#': 'brick',
  $: 'coin',
  '0': 'guard',
  '-': 'rope',
  H: 'ladder',
  S: 'hLadder',
  '@': 'block',
};
function preload() {
  this.load.path = '../assets/images/';
this.load.spritesheet('blocks', 'blocks.png', 22,19);
this.load.path = '../assets/json/';
this.load.json('levelData', 'levels.json');
}

var levelData;
var currLevel;
var block

function create() {
  levelData = game.cache.getJSON('levelData');
  currLevel = levelData.levels['level-001'];
  block = game.add.sprite(0, 0, 'blocks');
    buildLevel(currLevel);
  }

  function buildLevel(levelMap) {
    for (let y = 0; y < levelMap.length; y++) {
      for (let x = 0; x < levelMap[y].length; x++) {
        const tile = levelMap[y][x];
        const blockX = BASE_TILE_X * x;
        const blockY = -30 + BASE_TILE_Y * y;
        let sprite;
        if (tile === '$') totalCoins++;
        const value = TILE_MAP[tile];
        if (typeof value != 'undefined') {
          const objName = value + 's';
          const group = eval(objName);
          sprite = game.add.sprite(blockX, blockY, value);
          group.add(sprite);
          if (tile != '0') sprite.body.immovable = true;
        }
      }
    }
  }

function update() {
}