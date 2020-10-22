var game = new Phaser.Game(640, 480, Phaser.AUTO, 'phaser-example', 
{preload: preload, create: create, update: update});
var _scene;

function create() {
  _scene = this;
  if (!startGame) 
    mainMenuCreate(this);
  else 
    gameCreate();
}

function gameCreate() {
  score = 0;

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.enableBody = true;

  levelData = game.cache.getJSON('levelData');
  currLevel = levelData.levels['level-001'];
  block = game.add.sprite(0, 0, 'blocks');
    buildLevel(currLevel);
}

function buildLevel(levelMap) {
  if(levelMap!=undefined){
  for (let y = 0; y < levelMap.length; y++) {
    for (let x = 0; x < levelMap[y].length; x++) {
      const tile = levelMap[y][x];
      const blockX = BASE_TILE_X * x;
      const blockY = BASE_TILE_Y * y;
      const value = TILE_MAP[tile];
      if (value === '#'){
         var sprite = game.add.sprite(blockX, blockY, value);
      }
    }
    }
  }
}

function update() {
  if (!startGame) {
    mainMenuUpdate();
    return;
  }


}

function render() {
}
