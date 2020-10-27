var game = new Phaser.Game(BASE_TILE_WIDTH*MAP_WIDTH, BASE_TILE_HEIGHT*MAP_HEIGHT, 
                            Phaser.AUTO, 'phaser-example', 
{preload: preload, create: create, update: update});

function preload() {
  this.load.path = '../assets/images/';
this.load.spritesheet('blocks', 'blocks.png', 21,19);
this.load.path = '../assets/json/';
this.load.json('levelData', 'levels.json');
}

function create() {
  levelData = game.cache.getJSON('levelData');
  currLevel = levelData.levels['level-001'];
  blocks = game.add.sprite(0, 0, 'blocks');
   buildLevel(currLevel);
  }

  function buildLevel(levelMap) {
     for (let y = 0; y < levelMap.length; y++) {
      for (let x = 0; x < levelMap[y].length; x++) {
         const tile = levelMap[y][x];
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
}