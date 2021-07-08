function preload() {
  game.load.onLoadStart.add(loadStart, this);
  game.load.onFileComplete.add(fileComplete, this);
  game.load.onLoadComplete.add(loadComplete, this);
  loadText = game.add.text(32, 32, '', {
    fill: '#ffffff',
  });
  game.load.path = '../assets/images/';
  game.load.spritesheet('player', 'player.png', 20,20);
  game.load.spritesheet('blocks', 'blocks.png', 21,19);
  game.load.image('splash', 'splash.png');
  game.load.image('maxxdaddy', 'maxxdaddy.gif');
  
  game.load.path = '../assets/json/';
  game.load.json('levelData', 'levels.json');
  game.load.start();
}

function loadStart (){
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