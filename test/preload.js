//function to preload all our game sprites
function preload() {
    //this is for codepen to allow images hosted on my website
    game.load.crossOrigin = "anonymous";
    
    game.load.image('ground', assetRoot + 'assets/platform.png');
    game.load.image('coin', assetRoot + 'assets/coin.png');
    game.load.image('hero', assetRoot + 'assets/hero.png');
    game.load.image('baddie', assetRoot + 'assets/baddie.png');
    game.load.image('ladder', assetRoot + 'assets/ladder.png');
  }