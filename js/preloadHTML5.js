function showLoadingPage() {
    var a = [{
        src: "image/cover.png" + noCache,
        id: "cover"
    }, {
        src: themeImagePath + THEME_APPLE2 + "/runner.png" + noCache,
        id: "runner"
    }];
    coverPageLoad = new createjs.LoadQueue(!0);
    coverPageLoad.on("error", function(c) {
        console.log("error", c)
    });
    coverPageLoad.on("fileload", function(c) {
        switch (c.item.id) {
            case "cover":
                coverBitmap = new createjs.Bitmap(c.result);
                coverBitmap.setTransform(0, 0, tileScale, tileScale);
                c = coverBitmap.getBounds().width * tileScale | 0;
                var f = coverBitmap.getBounds().height * tileScale |
                    0;
                titleBackground = new createjs.Shape;
                titleBackground.graphics.beginFill("white").drawRect(0, 0, c, f);
                mainStage.addChild(titleBackground);
                mainStage.addChild(coverBitmap);
                mainStage.update();
                break;
            case "runner":
                createRunnerSpriteSheet(c.result)
        }
    });
    coverPageLoad.on("complete", function(c) {
        preloadResource()
    });
    coverPageLoad.loadManifest(a)
}

function createRunnerSpriteSheet(a) {
    runnerData = new createjs.SpriteSheet({
        images: [a],
        frames: {
            regX: 0,
            height: BASE_TILE_Y,
            regY: 0,
            width: BASE_TILE_X
        },
        animations: {
            runRight: [0, 2, "runRight", RUNNER_SPEED],
            runLeft: [3, 5, "runLeft", RUNNER_SPEED],
            runUpDn: [6, 7, "runUpDn", RUNNER_SPEED],
            barRight: {
                frames: [18, 19, 19, 20, 20],
                next: "barRight",
                speed: RUNNER_SPEED
            },
            barLeft: {
                frames: [21, 22, 22, 23, 23],
                next: "barLeft",
                speed: RUNNER_SPEED
            },
            digRight: 24,
            digLeft: 25,
            fallRight: 8,
            fallLeft: 26
        }
    })
}
var preload, firstPlay = 0,
    runnerData, guardData = {},
    redhatData = {},
    holeData, holeObj = {},
    textData, countryFlagData, soundFall, soundDig, soundPass, soundEnding, themeImagePath = "image/Theme/",
    themeSoundPath = "sound/Theme/";

function preloadResource() {
    function a() {
        mainStage.removeChild(f, g, h, d);
        var b = coverBitmap.getBounds().width * tileScale | 0,
            e = coverBitmap.getBounds().height * tileScale | 0;
        titleBackground.graphics.clear().beginLinearGradientFill("#FF0000 #FF7F00 #FFFF00 #00FF00 #0000FF #4B0082 #8B00FF".split(" "), [0, .14, .28, .42, .56, .7, .84, .98], 0, e / 5, 6 * b / 5, 2 * e / 5).drawRect(0, 0, b, e);
        signetBitmap = new createjs.Bitmap(preload.getResult("signet"));
        b = (BASE_SCREEN_X - SIGNET_UNDER_X - signetBitmap.getBounds().width) * tileScale;
        e = (BASE_SCREEN_Y -
            SIGNET_UNDER_Y - signetBitmap.getBounds().height) * tileScale;
        signetBitmap.setTransform(b, e, tileScale, tileScale);
        signetBitmap.set({
            alpha: .8
        });
        createjs.Tween.get(signetBitmap).set({
            alpha: .8
        }).to({
            alpha: 1
        }, 500);
        mainStage.addChild(signetBitmap);
        b = 372 * tileScale;
        e = 130 * tileScale;
        remakeBitmap = new createjs.Bitmap(preload.getResult("remake"));
        remakeBitmap.setTransform(b, e, tileScale, tileScale);
        remakeBitmap.rotation = -5;
        remakeBitmap.set({
            alpha: .6
        });
        createjs.Tween.get(remakeBitmap).set({
            alpha: .6
        }).to({
            alpha: 1
        }, 800).call(c);
        mainStage.addChild(remakeBitmap);
        mainStage.update()
    }

    function c() {
        helpBitmap = new createjs.Bitmap(preload.getResult("help"));
        editHelpBitmap = new createjs.Bitmap(preload.getResult("editHelp"));
        helpObj = new helpMenuClass(mainStage, helpBitmap, editHelpBitmap, tileScale);
        mainMenuIconBitmap = new createjs.Bitmap(preload.getResult("menu"));
        mainMenuIconObj = new mainMenuIconClass(screenX1, screenY1, tileScale, mainMenuIconBitmap);
        selectIconBitmap = new createjs.Bitmap(preload.getResult("select"));
        selectIconObj = new selectIconClass(screenX1,
            screenY1, tileScale, selectIconBitmap);
        champIconBitmap = new createjs.Bitmap(preload.getResult("champ"));
        champIconObj = new champIconClass(screenX1, screenY1, tileScale, champIconBitmap);
        demoIconBitmap = new createjs.Bitmap(preload.getResult("demo"));
        demoIconObj = new demoIconClass(screenX1, screenY1, tileScale, demoIconBitmap);
        shareIconBitmap = new createjs.Bitmap(preload.getResult("share"));
        shareIconObj = new shareIconClass(screenX1, screenY1, tileScale, shareIconBitmap);
        pasteIconBitmap = new createjs.Bitmap(preload.getResult("paste"));
        pasteIconObj = new pasteIconClass(screenX1, screenY1, tileScale, pasteIconBitmap);
        soundOnIconBitmap = new createjs.Bitmap(preload.getResult("soundOn"));
        soundOffIconBitmap = new createjs.Bitmap(preload.getResult("soundOff"));
        soundIconObj = new soundIconClass(screenX1, screenY1, tileScale, soundOnIconBitmap, soundOffIconBitmap);
        infoIconBitmap = new createjs.Bitmap(preload.getResult("infoIcon"));
        infoIconObj = new infoIconClass(screenX1, screenY1, tileScale, infoIconBitmap);
        infoObj = new infoMenuClass(mainStage, tileScale);
        helpIconBitmap =
            new createjs.Bitmap(preload.getResult("helpIcon"));
        helpIconObj = new helpIconClass(screenX1, screenY1, tileScale, helpIconBitmap);
        repeatActionOnIconBitmap = new createjs.Bitmap(preload.getResult("repeatOn"));
        repeatActionOffIconBitmap = new createjs.Bitmap(preload.getResult("repeatOff"));
        repeatActionIconObj = new repeatActionIconClass(screenX1, screenY1, tileScale, repeatActionOnIconBitmap, repeatActionOffIconBitmap);
        apple2IconBitmap = new createjs.Bitmap(preload.getResult("apple2"));
        C64IconBitmap = new createjs.Bitmap(preload.getResult("C64"));
        themeIconObj = new themeIconClass(screenX1, screenY1, tileScale, apple2IconBitmap, C64IconBitmap);
        themeColorObj = new colorSelectorClass(screenX1, screenY1, tileWScale);
        checkBitmap = new createjs.Bitmap(preload.getResult("check"));
        returnBitmap = new createjs.Bitmap(preload.getResult("return"));
        select1Bitmap = new createjs.Bitmap(preload.getResult("select1"));
        nextBitmap = new createjs.Bitmap(preload.getResult("next"));
        editBitmap = new createjs.Bitmap(preload.getResult("edit"));
        facebookBitmap = new createjs.Bitmap(preload.getResult("facebook"));
        twitterBitmap = new createjs.Bitmap(preload.getResult("twitter"));
        linkBitmap = new createjs.Bitmap(preload.getResult("link"));
        openFolderBitmap = new createjs.Bitmap(preload.getResult("openFolder"));
        nextMapBitmap = new createjs.Bitmap(preload.getResult("nextMap"));
        prevMapBitmap = new createjs.Bitmap(preload.getResult("prevMap"));
        yesBitmap = new createjs.Bitmap(preload.getResult("yes"));
        noBitmap = new createjs.Bitmap(preload.getResult("no"));
        getFirstPlayInfo();
        createjs.Ticker.off("tick", m);
        waitIdleDemo(4E3)
    }
    var f =
        new createjs.Sprite(runnerData, "runRight"),
        g = new createjs.Shape,
        h = new createjs.Shape,
        d = new createjs.Text("0", COVER_PROGRESS_BAR_H * tileScale + "px Arial", "#FF0000"),
        n = [{
                src: "image/remake.png" + noCache,
                id: "remake"
            }, {
                src: "image/signet.png" + noCache,
                id: "signet"
            }, {
                src: themeImagePath + THEME_APPLE2 + "/empty.png" + noCache,
                id: "empty" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/brick.png" + noCache,
                id: "brick" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/block.png" + noCache,
                id: "solid" + THEME_APPLE2
            }, {
                src: themeImagePath +
                    THEME_APPLE2 + "/ladder.png" + noCache,
                id: "ladder" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/rope.png" + noCache,
                id: "rope" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/trap.png" + noCache,
                id: "trapBrick" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/hladder.png" + noCache,
                id: "hladder" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/gold.png" + noCache,
                id: "gold" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/guard1.png" + noCache,
                id: "guard1" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/runner1.png" +
                    noCache,
                id: "runner1" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/runner.png" + noCache,
                id: "runner" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/guard.png" + noCache,
                id: "guard" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/redhat.png" + noCache,
                id: "redhat" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/hole.png" + noCache,
                id: "hole" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/ground.png" + noCache,
                id: "ground" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_APPLE2 + "/over.png" + noCache,
                id: "over" + THEME_APPLE2
            },
            {
                src: themeImagePath + THEME_APPLE2 + "/text.png" + noCache,
                id: "text" + THEME_APPLE2
            }, {
                src: themeImagePath + THEME_C64 + "/empty.png" + noCache,
                id: "empty" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/brick.png" + noCache,
                id: "brick" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/block.png" + noCache,
                id: "solid" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/ladder.png" + noCache,
                id: "ladder" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/rope.png" + noCache,
                id: "rope" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/trap.png" + noCache,
                id: "trapBrick" +
                    THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/hladder.png" + noCache,
                id: "hladder" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/gold.png" + noCache,
                id: "gold" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/guard1.png" + noCache,
                id: "guard1" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/runner1.png" + noCache,
                id: "runner1" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/runner.png" + noCache,
                id: "runner" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/guard.png" + noCache,
                id: "guard" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/redhat.png" +
                    noCache,
                id: "redhat" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/hole.png" + noCache,
                id: "hole" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/ground.png" + noCache,
                id: "ground" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/over.png" + noCache,
                id: "over" + THEME_C64
            }, {
                src: themeImagePath + THEME_C64 + "/text.png" + noCache,
                id: "text" + THEME_C64
            }, {
                src: "image/eraser.png" + noCache,
                id: "eraser"
            }, {
                src: "image/help.png" + noCache,
                id: "help"
            }, {
                src: "image/editHelp.png" + noCache,
                id: "editHelp"
            }, {
                src: "image/menu.png" + noCache,
                id: "menu"
            }, {
                src: "image/select.png" +
                    noCache,
                id: "select"
            }, {
                src: "image/check.png" + noCache,
                id: "check"
            }, {
                src: "image/champ.png" + noCache,
                id: "champ"
            }, {
                src: "image/return.png" + noCache,
                id: "return"
            }, {
                src: "image/select1.png" + noCache,
                id: "select1"
            }, {
                src: "image/next.png" + noCache,
                id: "next"
            }, {
                src: "image/edit.png" + noCache,
                id: "edit"
            }, {
                src: "image/facebook.png" + noCache,
                id: "facebook"
            }, {
                src: "image/twitter.png" + noCache,
                id: "twitter"
            }, {
                src: "image/link.png" + noCache,
                id: "link"
            }, {
                src: "image/openFolder.png" + noCache,
                id: "openFolder"
            }, {
                src: "image/nextMap.png" + noCache,
                id: "nextMap"
            }, {
                src: "image/prevMap.png" + noCache,
                id: "prevMap"
            }, {
                src: "image/yes.png" + noCache,
                id: "yes"
            }, {
                src: "image/no.png" + noCache,
                id: "no"
            }, {
                src: "image/demo.png" + noCache,
                id: "demo"
            }, {
                src: "image/share.png" + noCache,
                id: "share"
            }, {
                src: "image/paste.png" + noCache,
                id: "paste"
            }, {
                src: "image/soundOn.png" + noCache,
                id: "soundOn"
            }, {
                src: "image/soundOff.png" + noCache,
                id: "soundOff"
            }, {
                src: "image/infoIcon.png" + noCache,
                id: "infoIcon"
            }, {
                src: "image/helpIcon.png" + noCache,
                id: "helpIcon"
            }, {
                src: "image/repeatOn.png" + noCache,
                id: "repeatOn"
            },
            {
                src: "image/repeatOff.png" + noCache,
                id: "repeatOff"
            }, {
                src: "image/apple2.png" + noCache,
                id: "apple2"
            }, {
                src: "image/commodore64.png" + noCache,
                id: "C64"
            }, {
                src: "image/flags32.png" + noCache,
                id: "flag"
            }, {
                src: themeSoundPath + THEME_APPLE2 + "/born.ogg" + noCache,
                id: "reborn" + THEME_APPLE2
            }, {
                src: themeSoundPath + THEME_APPLE2 + "/dead.ogg" + noCache,
                id: "dead" + THEME_APPLE2
            }, {
                src: themeSoundPath + THEME_APPLE2 + "/dig.ogg" + noCache,
                id: "dig" + THEME_APPLE2
            }, {
                src: themeSoundPath + THEME_APPLE2 + "/getGold.ogg" + noCache,
                id: "getGold" + THEME_APPLE2
            },
            {
                src: themeSoundPath + THEME_APPLE2 + "/fall.ogg" + noCache,
                id: "fall" + THEME_APPLE2
            }, {
                src: themeSoundPath + THEME_APPLE2 + "/down.ogg" + noCache,
                id: "down" + THEME_APPLE2
            }, {
                src: themeSoundPath + THEME_APPLE2 + "/pass.ogg" + noCache,
                id: "pass" + THEME_APPLE2
            }, {
                src: themeSoundPath + THEME_APPLE2 + "/trap.ogg" + noCache,
                id: "trap" + THEME_APPLE2
            }, {
                src: themeSoundPath + THEME_C64 + "/born.ogg" + noCache,
                id: "reborn" + THEME_C64
            }, {
                src: themeSoundPath + THEME_C64 + "/dead.ogg" + noCache,
                id: "dead" + THEME_C64
            }, {
                src: themeSoundPath + THEME_C64 + "/dig.ogg" + noCache,
                id: "dig" + THEME_C64
            }, {
                src: themeSoundPath + THEME_C64 + "/getGold.ogg" + noCache,
                id: "getGold" + THEME_C64
            }, {
                src: themeSoundPath + THEME_C64 + "/fall.ogg" + noCache,
                id: "fall" + THEME_C64
            }, {
                src: themeSoundPath + THEME_C64 + "/down.ogg" + noCache,
                id: "down" + THEME_C64
            }, {
                src: themeSoundPath + THEME_C64 + "/pass.ogg" + noCache,
                id: "pass" + THEME_C64
            }, {
                src: themeSoundPath + THEME_C64 + "/trap.ogg" + noCache,
                id: "trap" + THEME_C64
            }, {
                src: themeSoundPath + THEME_C64 + "/goldFinish1.ogg" + noCache,
                id: "goldFinish1"
            }, {
                src: themeSoundPath + THEME_C64 + "/goldFinish2.ogg" +
                    noCache,
                id: "goldFinish2"
            }, {
                src: themeSoundPath + THEME_C64 + "/goldFinish3.ogg" + noCache,
                id: "goldFinish3"
            }, {
                src: themeSoundPath + THEME_C64 + "/goldFinish4.ogg" + noCache,
                id: "goldFinish4"
            }, {
                src: themeSoundPath + THEME_C64 + "/goldFinish5.ogg" + noCache,
                id: "goldFinish5"
            }, {
                src: themeSoundPath + THEME_C64 + "/goldFinish6.ogg" + noCache,
                id: "goldFinish6"
            }, {
                src: "sound/goldFinish.ogg" + noCache,
                id: "goldFinish"
            }, {
                src: "sound/ending.ogg" + noCache,
                id: "ending"
            }, {
                src: "sound/scoreBell.ogg" + noCache,
                id: "scoreBell"
            }, {
                src: "sound/scoreCount.ogg" +
                    noCache,
                id: "scoreCount"
            }, {
                src: "sound/scoreEnding.ogg" + noCache,
                id: "scoreEnding"
            }, {
                src: "sound/beep.ogg" + noCache,
                id: "beep"
            }, {
                src: "cursor/openhand.cur" + noCache,
                id: "openHand"
            }, {
                src: "cursor/closedhand.cur" + noCache,
                id: "closeHand"
            }
        ];
    preload = new createjs.LoadQueue(!0);
    createjs.Sound.alternateExtensions = ["mp3"];
    preload.installPlugin(createjs.Sound);
    preload.on("error", function(b) {
        console.log("error", b)
    });
    preload.on("progress", function(b) {
        g.graphics.clear();
        g.graphics.beginFill("gold").drawRect(0, 0, b.loaded /
            b.total * l, k);
        d.text = (b.loaded / b.total * 100 | 0) + "%";
        d.x = (canvas.width - d.getBounds().width) / 2 | 0
    });
    preload.on("complete", function(b) {
        d.text = "100%";
        mainStage.update();
        createSoundInstance();
        createBaseBitmapInstance();
        setTimeout(a, 500)
    });
    preload.loadManifest(n);
    createjs.Ticker.setFPS(30);
    var m = createjs.Ticker.on("tick", mainStage);
    f.setTransform(COVER_SIDE_X * tileScale, (BASE_SCREEN_Y - COVER_RUNNER_UNDER_Y) * tileScale, tileScale, tileScale);
    f.gotoAndPlay();
    var l = canvas.width - 2 * COVER_SIDE_X * tileScale,
        k = COVER_PROGRESS_BAR_H *
        tileScale;
    h.graphics.beginStroke("gold").drawRect(0, 0, l, k);
    g.x = h.x = COVER_SIDE_X * tileScale;
    g.y = h.y = (BASE_SCREEN_Y - COVER_PROGRESS_UNDER_Y) * tileScale;
    d.x = (canvas.width - d.getBounds().width) / 2 | 0;
    d.y = (BASE_SCREEN_Y - COVER_PROGRESS_UNDER_Y) * tileScale + k / 12;
    mainStage.addChild(f, g, h, d)
}

function createSoundInstance() {
    soundFall = createjs.Sound.createInstance("fall" + curTheme);
    soundDig = createjs.Sound.createInstance("dig" + curTheme);
    soundPass = createjs.Sound.createInstance("pass" + curTheme);
    soundEnding = createjs.Sound.createInstance("ending")
}
var spriteSpeed = [{
        runnerSpeed: .65,
        guardSpeed: .3,
        digSpeed: .68,
        fillSpeed: .24,
        xMoveBase: 8,
        yMoveBase: 8
    }, {
        runnerSpeed: .7,
        guardSpeed: .35,
        digSpeed: .68,
        fillSpeed: .27,
        xMoveBase: 8,
        yMoveBase: 9
    }, {
        runnerSpeed: .8,
        guardSpeed: .4,
        digSpeed: 1,
        fillSpeed: 1,
        xMoveBase: 8,
        yMoveBase: 9
    }],
    curAiVersion = AI_VERSION,
    maxGuard = MAX_NEW_GUARD;

function setSpeedByAiVersion() {
    var a = spriteSpeed[curAiVersion > spriteSpeed.length ? spriteSpeed.length - 1 : curAiVersion - 1];
    RUNNER_SPEED = a.runnerSpeed;
    GUARD_SPEED = a.guardSpeed;
    DIG_SPEED = a.digSpeed;
    FILL_SPEED = a.fillSpeed;
    xMove = a.xMoveBase;
    yMove = a.yMoveBase;
    3 > curAiVersion ? (movePolicy[1] = [0, 1, 1, 0, 1, 1], maxGuard = MAX_OLD_GUARD) : (movePolicy[1] = [0, 1, 0, 1, 0, 1], maxGuard = MAX_NEW_GUARD);
    themeDataReset(1);
    createHoleObj()
}

function themeDataReset(a) {
    a && createSoundInstance();
    createSpriteSheet()
}

function createSpriteSheet() {
    createRunnerSpriteSheet(getThemeBitmap("runner").image);
    createPreloadSpriteSheet();
    createFlagSpriteSheet()
}

function createPreloadSpriteSheet() {
    guardData = createGuardObj("guard");
    redhatData = createGuardObj("redhat");
    holeData = new createjs.SpriteSheet({
        images: [getThemeBitmap("hole").image],
        frames: [
            [0 * BASE_TILE_X, 0, BASE_TILE_X, 2 * BASE_TILE_Y],
            [1 * BASE_TILE_X, 0, BASE_TILE_X, 2 * BASE_TILE_Y],
            [2 * BASE_TILE_X, 0, BASE_TILE_X, 2 * BASE_TILE_Y],
            [3 * BASE_TILE_X, 0, BASE_TILE_X, 2 * BASE_TILE_Y],
            [4 * BASE_TILE_X, 0, BASE_TILE_X, 2 * BASE_TILE_Y],
            [5 * BASE_TILE_X, 0, BASE_TILE_X, 2 * BASE_TILE_Y],
            [6 * BASE_TILE_X, 0, BASE_TILE_X, 2 * BASE_TILE_Y],
            [7 * BASE_TILE_X,
                0, BASE_TILE_X, 2 * BASE_TILE_Y
            ],
            [0 * BASE_TILE_X, 2 * BASE_TILE_Y, BASE_TILE_X, 2 * BASE_TILE_Y],
            [1 * BASE_TILE_X, 2 * BASE_TILE_Y, BASE_TILE_X, 2 * BASE_TILE_Y],
            [2 * BASE_TILE_X, 2 * BASE_TILE_Y, BASE_TILE_X, 2 * BASE_TILE_Y],
            [3 * BASE_TILE_X, 2 * BASE_TILE_Y, BASE_TILE_X, 2 * BASE_TILE_Y],
            [4 * BASE_TILE_X, 2 * BASE_TILE_Y, BASE_TILE_X, 2 * BASE_TILE_Y],
            [5 * BASE_TILE_X, 2 * BASE_TILE_Y, BASE_TILE_X, 2 * BASE_TILE_Y],
            [6 * BASE_TILE_X, 2 * BASE_TILE_Y, BASE_TILE_X, 2 * BASE_TILE_Y],
            [7 * BASE_TILE_X, 2 * BASE_TILE_Y, BASE_TILE_X, 2 * BASE_TILE_Y],
            [7 * BASE_TILE_X, 2 * BASE_TILE_Y,
                BASE_TILE_X, BASE_TILE_Y
            ],
            [8 * BASE_TILE_X, BASE_TILE_Y, BASE_TILE_X, BASE_TILE_Y],
            [8 * BASE_TILE_X, 0, BASE_TILE_X, BASE_TILE_Y],
            [8 * BASE_TILE_X, 3 * BASE_TILE_Y, BASE_TILE_X, BASE_TILE_Y]
        ],
        animations: {
            digHoleLeft: [0, 7, !1, DIG_SPEED],
            digHoleRight: [8, 15, !1, DIG_SPEED],
            fillHole: {
                frames: [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 18, 18, 19],
                next: !1,
                speed: FILL_SPEED
            }
        }
    });
    textData = new createjs.SpriteSheet({
        images: [getThemeBitmap("text").image],
        frames: {
            regX: 0,
            height: BASE_TILE_Y,
            regY: 0,
            width: BASE_TILE_X
        },
        animations: {
            N0: 0,
            N1: 1,
            N2: 2,
            N3: 3,
            N4: 4,
            N5: 5,
            N6: 6,
            N7: 7,
            N8: 8,
            N9: 9,
            A: 10,
            B: 11,
            C: 12,
            D: 13,
            E: 14,
            F: 15,
            G: 16,
            H: 17,
            I: 18,
            J: 19,
            K: 20,
            L: 21,
            M: 22,
            N: 23,
            O: 24,
            P: 25,
            Q: 26,
            R: 27,
            S: 28,
            T: 29,
            U: 30,
            V: 31,
            W: 32,
            X: 33,
            Y: 34,
            Z: 35,
            DOT: 36,
            LT: 37,
            GT: 38,
            DASH: 39,
            "@": 40,
            "#": 41,
            FLASH: {
                frames: [42, 42, 43, 43],
                next: "FLASH",
                speed: FLASH_SPEED
            },
            SPACE: 43,
            COLON: 44,
            UNDERLINE: 45,
            D0: 50,
            D1: 51,
            D2: 52,
            D3: 53,
            D4: 54,
            D5: 55,
            D6: 56,
            D7: 57,
            D8: 58,
            D9: 59
        }
    })
}

function createGuardObj(a) {
    return new createjs.SpriteSheet({
        images: [getThemeBitmap(a).image],
        frames: {
            regX: 0,
            height: BASE_TILE_Y,
            regY: 0,
            width: BASE_TILE_X
        },
        animations: {
            runRight: [0, 2, "runRight", GUARD_SPEED],
            runLeft: [3, 5, "runLeft", GUARD_SPEED],
            runUpDn: [6, 7, "runUpDn", GUARD_SPEED],
            barRight: {
                frames: [22, 23, 23, 24, 24],
                next: "barRight",
                speed: GUARD_SPEED
            },
            barLeft: {
                frames: [25, 26, 26, 27, 27],
                next: "barLeft",
                speed: GUARD_SPEED
            },
            reborn: {
                frames: [28, 28, 29],
                speed: GUARD_SPEED
            },
            fallRight: 8,
            fallLeft: 30,
            shakeRight: {
                frames: [8,
                    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 10, 9, 10, 8
                ],
                next: null,
                speed: GUARD_SPEED
            },
            shakeLeft: {
                frames: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 31, 32, 31, 32, 30],
                next: null,
                speed: GUARD_SPEED
            }
        }
    })
}

function createHoleObj() {
    holeObj.sprite = new createjs.Sprite(holeData, "digHoleLeft");
    holeObj.digLimit = 3 > curAiVersion ? 6 : 8;
    holeObj.action = ACT_STOP
}

function createFlagSpriteSheet() {
    countryFlagData = new createjs.SpriteSheet({
        images: [preload.getResult("flag")],
        frames: {
            regX: 0,
            height: 32,
            regY: 0,
            width: 32
        },
        animations: countryId
    })
};