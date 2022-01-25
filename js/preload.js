function preload() {
    game.load.onLoadStart.add(loadStart, this);
    game.load.onFileComplete.add(fileComplete, this);
    game.load.onLoadComplete.add(loadComplete, this);
    loadText = game.add.text(32, 32, '', {
      fill: '#ffffff',
    });
  
    game.load.path = 'assets/images/';
    game.load.image('splash', 'cover.png');
    game.load.image('maxxdaddy', 'maxxdaddy.gif');
    game.load.spritesheet('runner', 'runner.png', BASE_TILE_W, BASE_TILE_H);
    game.load.spritesheet('guard', 'guard.png', BASE_TILE_W, BASE_TILE_H);
    game.load.spritesheet('hole', 'hole.png', BASE_TILE_W, BASE_TILE_H);
    game.load.image("empty", "empty.png");
    game.load.image("brick", "brick.png");
    game.load.image("block", "block.png");
    game.load.image("ladder", "ladder.png");
    game.load.image("rope", "rope.png");
    game.load.image("trapBrick", "trap.png");
    game.load.image("hLadder", "hladder.png");
    game.load.image("gold", "gold.png");
    game.load.image("guard1", "guard1.png");
    game.load.image("runner1", "runner1.png");
    game.load.image("over", "over.png");
    game.load.image("text", "text.png");

    game.load.path = '../assets/json/';
    game.load.json('levelData', 'levels.json');
  
    game.load.start();
  }

  function loadStart() {
    loadText.setText('Loading ...');
  }
  
  function loadComplete() {
    loadText.setText('Load Complete');
    loadText.destroy();
  }
  //	This callback is sent the following parameters:
  function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
  
    loadText.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
  
  
  }