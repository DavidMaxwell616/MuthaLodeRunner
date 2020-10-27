var game = new Phaser.Game(BASE_TILE_WIDTH*MAP_WIDTH, BASE_TILE_HEIGHT*MAP_HEIGHT, 
  Phaser.AUTO, 'phaser-example', 
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
  blocks = game.add.sprite(0, 0, 'blocks');
  buildLevel(currLevel);
}

function buildLevel(currLevel) {
  for (let y = 0; y < currLevel.length; y++) {
    console.log(y);
    for (let x = 0; x < currLevel[y].length; x++) {
   const tile = currLevel[y][x];
     const blockX = BASE_TILE_WIDTH * x;
     const blockY = BASE_TILE_HEIGHT * y;
     let sprite;
     if (tile === '$') totalCoins++;
     const value = TILE_MAP[tile];
     if(value!=undefined){
        sprite = game.add.sprite(blockX, blockY, 'blocks', value);
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
