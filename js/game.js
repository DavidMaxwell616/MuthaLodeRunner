const game = new Phaser.Game(BASE_SCREEN_W, BASE_SCREEN_H, Phaser.ARCADE, 'game', {
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
  guard = [];
  keyAction = ACT_STOP;
  goldCount = guardCount = goldComplete = 0;
  dspTrapTile = 0;
  runner = game.add.sprite(0, 0, 'runner');
  runner.anchor.setTo(0.5, 0.5);
  runner.pos = {x:0,y:0};
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
    map[y] = [];
   for (let x = 0; x < levelMap[y].length; x++) {
    map[y][x] = {};
    const tile = levelMap[y][x];
     const blockX = BASE_TILE_W * x+20;
     const blockY = BASE_TILE_H * y;
     let sprite;
     if (tile === '$') totalCoins++;
     const value = OBJECT_MAP[tile];
     if(tile!=' '){
       sprite = game.add.sprite(blockX, blockY, value);
       blockSizeX = sprite.width; 
       blockSizeY = sprite.height;
       sprite.anchor.setTo(0.5);
       switch (tile) {
         case ' ':
          map[y][x].base = EMPTY_T;
          map[y][x].act = EMPTY_T;
          break;
         case '#':
          map[y][x].base = BLOCK_T;
          map[y][x].act = BLOCK_T;
           blocks.add(sprite);
           break;
         case 'H':
          map[y][x].base = LADDR_T;
          map[y][x].act = LADDR_T;
           ladders.add(sprite);
           break;
         case 'S':
          map[y][x].base = HLADR_T;
          map[y][x].act = EMPTY_T;
          sprite.visible = false;
           hLadders.add(sprite);
           break;
         case '$':
          map[y][x].base = GOLD_T;
          map[y][x].act = EMPTY_T;
           lode.add(sprite);
           break;
         case '@':
          map[y][x].base = SOLID_T;
          map[y][x].act = SOLID_T;
          solids.add(sprite);
           break;
           case '-':
            map[y][x].base = BAR_T;
            map[y][x].act = BAR_T;
           rope.add(sprite);
           break;
           case '&':
            map[y][x].base = EMPTY_T;
            map[y][x].act = RUNNER_T;
            runner.pos.x = x;
            runner.pos.y = y;
            runner.position.setTo(blockX,blockY);
            runner.action = ACT_UNKNOWN;
            break;
           case '0':
            map[y][x].base = EMPTY_T;
            map[y][x].act = GUARD_T;
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
  if (!startGame)
    return;
  // if (showintro) {
  //   Do_Intro();
  //   showintro = false;
  // } else {
  moveRunner();
    //      goldComplete && 0 == runner.pos.y && 0 == runner.pos.yOffset ? gameState = GAME_FINISH : (++playTickTimer >= TICK_COUNT_PER_TIME && (playMode != PLAY_CLASSIC && playMode != PLAY_AUTO && playMode != PLAY_DEMO ? drawTime(1) : countTime(1), playTickTimer = 0), playMode != PLAY_AUTO && playMode != PLAY_DEMO && playMode != PLAY_DEMO_ONCE || playDemo(), recordMode && processRecordKey(), isDigging() ? processDigHole() : moveRunner(), gameState != GAME_RUNNER_DEAD && moveGuard(), 3 <= curAiVersion && (processGuardShake(), processFillHole(), processReborn()))
}