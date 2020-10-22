function mainMenuCreate(scene) {
  splash = game.add.image(0, 0, 'splash');
  splash.width = game.width;
  splash.height = game.height;
  maxxdaddy = game.add.image(game.width * 0.75, game.height * 0.91, 'maxxdaddy');
  game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function mainMenuUpdate() {
  
  if (game.spaceKey.isDown) {
    game.spaceKey = null;
    splash.visible = false;
    maxxdaddy.visible = false;
    gameCreate();
    buildLevel();
    startGame = true;
  }
}