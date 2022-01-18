const game = new Phaser.Game(BASE_SCREEN_X, BASE_SCREEN_Y, Phaser.ARCADE, 'game', {
  preload,
  create,
  update,
 });

function create() {
  if (!startGame) mainMenuCreate(this);
  else gameCreate();
}

function gameCreate() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  runner = game.add.sprite(0, 0, 'runner');
  runner.anchor.setTo(0.5, 0.5);
  runner.animations.add('runRight',[0,2], RUNNER_SPEED);
  runner.animations.add('runLeft', [3,5],RUNNER_SPEED);
  runner.animations.add('runUpDn',[6,7],RUNNER_SPEED);
  runner.animations.add('barRight',[18, 19, 19, 20, 20],RUNNER_SPEED);
  runner.animations.add('barLeft',[21, 22, 22, 23, 23],RUNNER_SPEED);
  runner.animations.add('digRight',24,RUNNER_SPEED);
  runner.animations.add('digLeft',25,RUNNER_SPEED);
  runner.animations.add('barLeft',8,RUNNER_SPEED);
  runner.animations.add('fallLeft',26,RUNNER_SPEED);
  blocks = game.add.group();
  ladders = game.add.group();
  hLadders = game.add.group();
  lode = game.add.group();
  lode.enableBody = true;
  solids = game.add.group();
  enemies = game.add.group();
  rope = game.add.group();
  levelData = game.cache.getJSON('levelData');
  currLevel = levelData.levels['level-001'];
  buildLevel(currLevel);
}

function buildLevel(levelMap) {
  for (let y = 0; y < levelMap.length; y++) {
   for (let x = 0; x < levelMap[y].length; x++) {
      const tile = levelMap[y][x];
     const blockX = BASE_TILE_X * x+20;
     const blockY = BASE_TILE_Y * y;
     let sprite;
     if (tile === '$') totalCoins++;
     const value = OBJECT_MAP[tile];
     if(tile!=' '){
       sprite = game.add.sprite(blockX, blockY, value);
       blockSizeX = sprite.width; 
       blockSizeY = sprite.height;
       sprite.anchor.setTo(0.5);
       switch (tile) {
         case '#':
           blocks.add(sprite);
           break;
         case 'H':
           ladders.add(sprite);
           break;
         case 'S':
           sprite.visible = false;
           hLadders.add(sprite);
           break;
         case '$':
           lode.add(sprite);
           break;
         case '@':
              solids.add(sprite);
           break;
           case '-':
             rope.add(sprite);
           break;
           case '&':
             runner.position.setTo(blockX,blockY);
             break;
           case '0':
             createEnemy(blockX,blockY);  
           break;
          
         default:
           break;
       } 
     }
       
       //   if (DEBUG_MODE) drawRectangle(sprite.x-sprite.width/2,sprite.y-sprite.height/2,sprite.width,sprite.height,0xffffff);
       //   gameObjects.push(sprite);
   }
 }
}

function createEnemy(x,y)
  {

  }

function update() {
  if (!gameStart)
    return;

  if (showintro) {
    Do_Intro();
    showintro = false;
  } else {
  }
}