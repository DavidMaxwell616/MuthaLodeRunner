function init() {
    var a = getScreenSize();
    screenX1 = a.x;
    screenY1 = a.y;
    canvasReSize();
    createStage();
    setBackground();
    initAutoDemoRnd();
    loadStoreVariable();
    initMenuVariable();
    getLastPlayInfo();
    initDemoData();
    getEditLevelInfo();
    showLoadingPage()
}

function loadStoreVariable() {
    playerName = getPlayerName();
    "" != (playerUid = getUid()) && 22 == playerUid.length || "undefined" == typeof uId || (playerUid = 32 == playerUid.length ? playerUid.substring(0, 22) : uId, setUid(playerUid));
    curTheme = getThemeMode();
    getThemeColor();
    getRepeatAction();
    getGamepadMode() && gamepadEnable()
}

function canvasReSize() {
    for (var a, d = 100 * MAX_SCALE; d >= 100 * MIN_SCALE && !(tileScale = d / 100, canvasX = BASE_SCREEN_X * tileScale, canvasY = BASE_SCREEN_Y * tileScale, a = 2 * BASE_ICON_X * tileScale, canvasX + a <= screenX1 && canvasY <= screenY1 || tileScale <= MIN_SCALE); d -= 5);
    debug("SCALE=" + tileScale);
    screenBorder = (screenX1 - (canvasX + a)) / 2;
    screenBorder > 2 * ICON_BORDER ? screenBorder = 2 * ICON_BORDER : 0 > screenBorder && (screenBorder = 0);
    screenBorder = screenBorder * tileScale | 0;
    canvas = document.getElementById("canvas");
    canvas.width = canvasX;
    canvas.height =
        canvasY;
    a = (screenX1 - canvasX) / 2 | 0;
    d = (screenY1 - canvasY) / 2 | 0;
    canvas.style.left = (0 < a ? a : 0) + "px";
    canvas.style.top = (0 < d ? d : 0) + "px";
    canvas.style.position = "absolute";
    canvas.style.cursor = "default";
    tileW = BASE_TILE_X;
    tileH = BASE_TILE_Y;
    tileWScale = BASE_TILE_X * tileScale;
    tileHScale = BASE_TILE_Y * tileScale;
    W2 = tileW / 2 | 0;
    H2 = tileH / 2 | 0;
    W4 = tileW / 4 | 0;
    H4 = tileH / 4 | 0
}

function createStage() {
    mainStage = new createjs.Stage(canvas);
    loadingTxt = new createjs.Text(" ", "36px Arial", "#FF0000");
    loadingTxt.x = (canvas.width - loadingTxt.getBounds().width) / 2 | 0;
    loadingTxt.y = (canvas.height - loadingTxt.getBounds().height) / 2 | 0;
    mainStage.addChild(loadingTxt);
    mainStage.update()
}

function setBackground() {
    var a = new createjs.Shape;
    a.graphics.beginFill("#000000").drawRect(0, 0, canvas.width, canvas.height);
    mainStage.addChild(a);
    document.body.style.background = backgroundColor
}

function showCoverPage() {
    menuIconDisable(1);
    clearIdleDemoTimer();
    mainStage.removeAllChildren();
    mainStage.addChild(titleBackground);
    mainStage.addChild(coverBitmap);
    mainStage.addChild(signetBitmap);
    mainStage.addChild(remakeBitmap);
    mainStage.update();
    waitIdleDemo(3E3)
}
var idleTimer = null,
    startIdleTime;

function clearIdleDemoTimer() {
    idleTimer && clearInterval(idleTimer);
    idleTimer = null
}

function waitIdleDemo(a) {
    startIdleTime = new Date;
    idleTimer = setInterval(function() {
        checkIdleTime(a)
    }, 200);
    anyKeyStopDemo()
}

function anyKeyStopDemo() {
    document.onkeydown = anyKeyDown;
    enableStageClickEvent()
}

function stopDemoAndPlay() {
    var a = 1;
    if (changingLevel) return !1;
    clearIdleDemoTimer();
    disableStageClickEvent();
    soundStop(soundFall);
    stopAllSpriteObj();
    resumeAudioContext();
    playMode != PLAY_DEMO && playMode != PLAY_DEMO_ONCE || selectIconObj.disable(1);
    playMode == PLAY_DEMO_ONCE && (a = 0);
    selectGame(a)
}
var stageClickListener = null,
    stagePressListener = null;

function enableStageClickEvent() {
    disableStageClickEvent();
    stageClickListener = mainStage.on("click", function(a) {
        stopDemoAndPlay()
    })
}

function disableStageClickEvent() {
    var a = 0;
    stageClickListener && (a = 1, mainStage.off("click", stageClickListener));
    stageClickListener = stagePressListener = null;
    return a
}

function noKeyDown() {
    return !1
}

function anyKeyDown() {
    stopDemoAndPlay()
}

function checkIdleTime(a) {
    new Date - startIdleTime > a && (clearIdleDemoTimer(), playMode = PLAY_AUTO, anyKeyStopDemo(), startGame())
}

function getLastPlayInfo() {
    if (playData == PLAY_DATA_SHARE) playMode = PLAY_MODERN;
    else {
        var a = getStorage(STORAGE_LASTPLAY_MODE);
        playMode = PLAY_NONE;
        a && (a = JSON.parse(a), playMode = a.m, playData = a.d);
        if (playMode != PLAY_CLASSIC && playMode != PLAY_MODERN || 1 > playData || playData > maxPlayId && playData != PLAY_DATA_USERDEF) playMode = PLAY_CLASSIC, playData = 1
    }
}

function selectGame(a) {
    getLastPlayInfo();
    getShareUrlInfo();
    playData2GameVersionMenuId();
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    initShowDataMsg(a);
    startGame()
}
var gameTicker = null,
    changingLevel = 0;

function startPlayTicker() {
    stopPlayTicker();
    playMode == PLAY_AUTO || playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE ? createjs.Ticker.setFPS(demoSpeed) : createjs.Ticker.setFPS(speedMode[speed]);
    gameTicker = createjs.Ticker.on("tick", mainTick)
}

function stopPlayTicker() {
    gameTicker && (createjs.Ticker.off("tick", gameTicker), gameTicker = null)
}

function startGame(a) {
    gameState = GAME_WAITING;
    startPlayTicker();
    changingLevel = 1;
    curAiVersion = AI_VERSION;
    initHotKeyVariable();
    switch (playMode) {
        case PLAY_CLASSIC:
            getClassicInfo();
            var d = levelData[curLevel - 1];
            getGameId();
            curLevel >= levelData.length && passedLevel + 1 >= levelData.length && loadEndingMusic();
            break;
        case PLAY_MODERN:
            getModernInfo();
            d = levelData[curLevel - 1];
            clearGameId();
            break;
        case PLAY_TEST:
            d = getTestLevelMap();
            break;
        case PLAY_DEMO:
            getDemoInfo();
            d = levelData[curLevel - 1];
            break;
        case PLAY_DEMO_ONCE:
            getDemoOnceInfo();
            d = levelData[curLevel - 1];
            break;
        case PLAY_AUTO:
            getAutoDemoLevel(1), d = levelData[curLevel - 1]
    }
    showLevel(d);
    a ? beginPlay() : (addCycScreen(), setTimeout(function() {
        openingScreen(2 * cycDiff)
    }, 5))
}
var maxTileX = NO_OF_TILES_X - 1,
    maxTileY = NO_OF_TILES_Y - 1,
    runner = null,
    guard = [],
    map, guardCount, goldCount, goldComplete;

function initVariable() {
    guard = [];
    keyAction = holeObj.action = ACT_STOP;
    goldCount = guardCount = goldComplete = 0;
    runner = null;
    dspTrapTile = 0;
    initRnd();
    initModernVariable();
    initGuardVariable();
    initInfoVariable();
    initCycVariable();
    initStillFrameVariable();
    setSpeedByAiVersion();
    debug("curAiVersion = " + curAiVersion)
}

function buildLevelMap(a) {
    var d = 0,
        g = 0;
    map = [];
    for (var c = 0; c < NO_OF_TILES_X; c++) {
        map[c] = [];
        for (var b = 0; b < NO_OF_TILES_Y; b++) map[c][b] = {}, "0" == a.charAt(d++) && g++
    }
    for (b = d = 0; b < NO_OF_TILES_Y; b++)
        for (c = 0; c < NO_OF_TILES_X; c++) {
            switch (a.charAt(d++)) {
                default:
                case " ":
                    map[c][b].base = EMPTY_T;
                    map[c][b].act = EMPTY_T;
                    map[c][b].bitmap = null;
                    continue;
                case "#":
                    map[c][b].base = BLOCK_T;
                    map[c][b].act = BLOCK_T;
                    var e = map[c][b].bitmap = getThemeBitmap("brick");
                    break;
                case "@":
                    map[c][b].base = SOLID_T;
                    map[c][b].act = SOLID_T;
                    e = map[c][b].bitmap =
                        getThemeBitmap("solid");
                    break;
                case "H":
                    map[c][b].base = LADDR_T;
                    map[c][b].act = LADDR_T;
                    e = map[c][b].bitmap = getThemeBitmap("ladder");
                    break;
                case "-":
                    map[c][b].base = BAR_T;
                    map[c][b].act = BAR_T;
                    e = map[c][b].bitmap = getThemeBitmap("rope");
                    break;
                case "X":
                    map[c][b].base = TRAP_T;
                    map[c][b].act = TRAP_T;
                    e = map[c][b].bitmap = getThemeBitmap("brick");
                    break;
                case "S":
                    map[c][b].base = HLADR_T;
                    map[c][b].act = EMPTY_T;
                    e = map[c][b].bitmap = getThemeBitmap("ladder");
                    e.set({
                        alpha: 0
                    });
                    break;
                case "$":
                    map[c][b].base = GOLD_T;
                    map[c][b].act = EMPTY_T;
                    e = map[c][b].bitmap = getThemeBitmap("gold");
                    goldCount++;
                    break;
                case "0":
                    map[c][b].base = EMPTY_T;
                    map[c][b].act = GUARD_T;
                    map[c][b].bitmap = null;
                    if (--g >= maxGuard) {
                        map[c][b].act = EMPTY_T;
                        continue
                    }
                    e = new createjs.Sprite(guardData, "runLeft");
                    guard[guardCount] = {
                        sprite: e,
                        pos: {
                            x: c,
                            y: b,
                            xOffset: 0,
                            yOffset: 0
                        },
                        action: ACT_STOP,
                        shape: "runLeft",
                        lastLeftRight: "ACT_LEFT",
                        hasGold: 0
                    };
                    guardCount++;
                    e.stop();
                    break;
                case "&":
                    map[c][b].base = EMPTY_T;
                    map[c][b].act = RUNNER_T;
                    map[c][b].bitmap = null;
                    if (null != runner) {
                        map[c][b].act = EMPTY_T;
                        continue
                    }
                    runner = {};
                    e = runner.sprite = new createjs.Sprite(runnerData, "runRight");
                    runner.pos = {
                        x: c,
                        y: b,
                        xOffset: 0,
                        yOffset: 0
                    };
                    runner.action = ACT_UNKNOWN;
                    runner.shape = "runRight";
                    runner.lastLeftRight = "ACT_RIGHT";
                    e.stop()
            }
            e.setTransform(c * tileWScale, b * tileHScale, tileScale, tileScale);
            mainStage.addChild(e)
        }
    assert(0 == g, "Error: mapCuardCount design error !");
    moveSprite2Top()
}

function moveSprite2Top() {
    for (var a = 0; a < guardCount; a++) moveChild2Top(mainStage, guard[a].sprite);
    null == runner ? error("Without runner ???") : moveChild2Top(mainStage, runner.sprite);
    moveFillHoleObj2Top();
    moveChild2Top(mainStage, loadingTxt)
}

function buildGroundInfo() {
    drawGround();
    drawInfo()
}
var groundTile;

function drawGround() {
    groundTile = [];
    for (var a = 0; a < NO_OF_TILES_X; a++) groundTile[a] = getThemeBitmap("ground"), groundTile[a].setTransform(a * tileWScale, NO_OF_TILES_Y * tileHScale, tileScale, tileScale), mainStage.addChild(groundTile[a])
}
var runnerLife = RUNNER_LIFE,
    curScore = 0,
    curGetGold = 0,
    curGuardDeadNo = 0,
    sometimePlayInGodMode = 0,
    infoY, scoreTxt, scoreTile, lifeTxt, lifeTile, levelTxt, levelTile, demoTxt, goldTxt, goldTile, guardTxt, guardTile, timeTxt, timeTile;

function initModernVariable() {
    curTime = curGetGold = curGuardDeadNo = 0
}

function initInfoVariable() {
    infoY = (NO_OF_TILES_Y * BASE_TILE_Y + GROUND_TILE_Y) * tileScale;
    scoreTxt = [];
    scoreTile = [];
    lifeTxt = [];
    lifeTile = [];
    demoTxt = [];
    levelTxt = [];
    levelTile = [];
    goldTxt = [];
    goldTile = [];
    guardTxt = [];
    guardTile = [];
    timeTxt = [];
    timeTile = []
}

function drawInfo() {
    if (playMode == PLAY_CLASSIC || playMode == PLAY_AUTO || playMode == PLAY_DEMO) drawScoreTxt(), drawScore(0), playMode == PLAY_DEMO ? drawDemoTxt() : (drawLifeTxt(), drawLife());
    else if (drawGoldTxt(), drawGold(0), drawGuardTxt(), drawGuard(0), drawTimeTxt(), drawTime(0), playData == PLAY_DATA_SHARE) {
        drawShareTxt();
        return
    }
    drawLevelTxt();
    drawLevel()
}

function drawScoreTxt() {
    scoreTxt = drawText(0, infoY, "SCORE", mainStage)
}

function drawLifeTxt() {
    lifeTxt = drawText(13 * tileWScale, infoY, "MEN", mainStage)
}

function drawLevelTxt() {
    levelTxt = drawText(20 * tileWScale, infoY, "LEVEL", mainStage)
}

function drawShareTxt() {
    levelTxt = drawText(20 * tileWScale, infoY, "<SHARE>", mainStage)
}

function drawDemoTxt() {
    demoTxt = drawText(14 * tileWScale, infoY, "DEMO", mainStage)
}

function drawGoldTxt() {
    goldTxt = drawText(0 * tileWScale, infoY, "@", mainStage)
}

function drawGuardTxt() {
    guardTxt = drawText((5 + 2 / 3) * tileWScale, infoY, "#", mainStage)
}

function drawTimeTxt() {
    timeTxt = drawText((11 + 1 / 3) * tileWScale, infoY, "TIME", mainStage)
}

function drawScore(a) {
    curScore += a;
    for (a = 0; a < scoreTile.length; a++) mainStage.removeChild(scoreTile[a]);
    scoreTile = drawText(5 * tileWScale, infoY, ("000000" + curScore).slice(-7), mainStage)
}

function drawLife() {
    for (var a = 0; a < lifeTile.length; a++) mainStage.removeChild(lifeTile[a]);
    lifeTile = drawText(16 * tileWScale, infoY, ("00" + runnerLife).slice(-3), mainStage)
}

function drawLevel() {
    for (var a = 0; a < levelTile.length; a++) mainStage.removeChild(levelTile[a]);
    switch (playMode) {
        case PLAY_AUTO:
            levelTile = drawText(25 * tileWScale, infoY, ("00" + demoLevel).slice(-3), mainStage);
            break;
        default:
            levelTile = drawText(25 * tileWScale, infoY, ("00" + curLevel).slice(-3), mainStage)
    }
}

function drawGold(a) {
    curGetGold += a;
    for (a = 0; a < goldTile.length; a++) mainStage.removeChild(goldTile[a]);
    goldTile = drawText(1 * tileWScale, infoY, ("00" + curGetGold).slice(-3), mainStage)
}

function drawGuard(a) {
    curGuardDeadNo += a;
    100 < curGuardDeadNo && (curGuardDeadNo = 100);
    for (a = 0; a < guardTile.length; a++) mainStage.removeChild(guardTile[a]);
    guardTile = drawText((6 + 2 / 3) * tileWScale, infoY, ("00" + curGuardDeadNo).slice(-3), mainStage)
}

function countTime(a) {
    curTime >= MAX_TIME_COUNT || (a && curTime++, curTime > MAX_TIME_COUNT && (curTime = MAX_TIME_COUNT))
}

function drawTime(a) {
    countTime(a);
    for (a = 0; a < timeTile.length; a++) mainStage.removeChild(timeTile[a]);
    timeTile = drawText((15 + 1 / 3) * tileWScale, infoY, ("00" + curTime).slice(-3), mainStage)
}

function setGroundInfoOrder() {
    var a;
    for (a = 0; a < groundTile.length; a++) moveChild2Top(mainStage, groundTile[a]);
    if (playMode == PLAY_CLASSIC || playMode == PLAY_AUTO || playMode == PLAY_DEMO) {
        for (a = 0; a < scoreTxt.length; a++) moveChild2Top(mainStage, scoreTxt[a]);
        for (a = 0; a < scoreTile.length; a++) moveChild2Top(mainStage, scoreTile[a]);
        if (playMode == PLAY_DEMO)
            for (a = 0; a < demoTxt.length; a++) moveChild2Top(mainStage, demoTxt[a]);
        else {
            for (a = 0; a < lifeTxt.length; a++) moveChild2Top(mainStage, lifeTxt[a]);
            for (a = 0; a < lifeTile.length; a++) moveChild2Top(mainStage,
                lifeTile[a])
        }
    } else {
        for (a = 0; a < goldTxt.length; a++) moveChild2Top(mainStage, goldTxt[a]);
        for (a = 0; a < goldTile.length; a++) moveChild2Top(mainStage, goldTile[a]);
        for (a = 0; a < guardTxt.length; a++) moveChild2Top(mainStage, guardTxt[a]);
        for (a = 0; a < guardTile.length; a++) moveChild2Top(mainStage, guardTile[a]);
        for (a = 0; a < timeTxt.length; a++) moveChild2Top(mainStage, timeTxt[a]);
        for (a = 0; a < timeTile.length; a++) moveChild2Top(mainStage, timeTile[a])
    }
    for (a = 0; a < levelTxt.length; a++) moveChild2Top(mainStage, levelTxt[a]);
    for (a = 0; a < levelTile.length; a++) moveChild2Top(mainStage,
        levelTile[a])
}

function drawText(a, d, g, c, b) {
    g = g.toUpperCase();
    var e = [];
    "undefined" == typeof b && (b = "N");
    for (var f = 0; f < g.length; f++) {
        var h = g.charCodeAt(f);
        switch (!0) {
            case 48 <= h && 57 >= h:
                e[f] = new createjs.Sprite(textData, b + String.fromCharCode(h));
                break;
            case 65 <= h && 90 >= h:
                e[f] = new createjs.Sprite(textData, String.fromCharCode(h));
                break;
            case 46 == h:
                e[f] = new createjs.Sprite(textData, "DOT");
                break;
            case 60 == h:
                e[f] = new createjs.Sprite(textData, "LT");
                break;
            case 62 == h:
                e[f] = new createjs.Sprite(textData, "GT");
                break;
            case 45 == h:
                e[f] =
                    new createjs.Sprite(textData, "DASH");
                break;
            case 58 == h:
                e[f] = new createjs.Sprite(textData, "COLON");
                break;
            case 95 == h:
                e[f] = new createjs.Sprite(textData, "UNDERLINE");
                break;
            case 35 == h:
                e[f] = new createjs.Sprite(textData, String.fromCharCode(h));
                break;
            case 64 == h:
                e[f] = new createjs.Sprite(textData, String.fromCharCode(h));
                break;
            default:
                e[f] = new createjs.Sprite(textData, "SPACE")
        }
        e[f].setTransform(a + f * tileWScale, d, tileScale, tileScale).stop();
        c.addChild(e[f])
    }
    return e
}
var playTickTimer = 0;

function playGame(a) {
    goldComplete && 0 == runner.pos.y && 0 == runner.pos.yOffset ? gameState = GAME_FINISH : (++playTickTimer >= TICK_COUNT_PER_TIME && (playMode != PLAY_CLASSIC && playMode != PLAY_AUTO && playMode != PLAY_DEMO ? drawTime(1) : countTime(1), playTickTimer = 0), playMode != PLAY_AUTO && playMode != PLAY_DEMO && playMode != PLAY_DEMO_ONCE || playDemo(), recordMode && processRecordKey(), isDigging() ? processDigHole() : moveRunner(), gameState != GAME_RUNNER_DEAD && moveGuard(), 3 <= curAiVersion && (processGuardShake(), processFillHole(), processReborn()))
}

function showLevel(a) {
    mainStage.removeAllChildren();
    loadingTxt.text = "";
    mainStage.addChild(loadingTxt);
    initVariable();
    setBackground();
    buildLevelMap(a);
    buildGroundInfo()
}
var tipsText = null,
    tipsRect = null,
    tipsText1 = null,
    tipsRect1 = null;

function showTipsText(a, d, g) {
    null != tipsText && mainStage.removeChild(tipsText);
    null != tipsRect && mainStage.removeChild(tipsRect);
    null != tipsText1 && (mainStage.removeChild(tipsText1), tipsText1 = null);
    null != tipsRect1 && (mainStage.removeChild(tipsRect1), tipsRect1 = null);
    tipsText = new createjs.Text("test", "bold " + 48 * tileScale + "px Helvetica", "#ee1122");
    tipsText.text = a;
    tipsText.set({
        alpha: 1
    });
    if (a.length) {
        var c = tipsText.getBounds().width;
        var b = tipsText.getBounds().height
    } else c = b = 0;
    a = tipsText.x = (canvas.width - c) /
        2 | 0;
    var e = tipsText.y = (NO_OF_TILES_Y * tileHScale - b) / 2 | 0;
    tipsText.shadow = new createjs.Shadow("white", 2, 2, 1);
    tipsRect = new createjs.Shape;
    tipsRect.graphics.beginFill("#020722");
    tipsRect.graphics.drawRect(-1, -1, c + 2, b + 2);
    tipsRect.setTransform(a, e).set({
        alpha: .8
    });
    mainStage.addChild(tipsRect);
    mainStage.addChild(tipsText);
    d && (createjs.Tween.get(tipsRect, {
        override: !0
    }).set({
        alpha: .8
    }).to({
        alpha: 0
    }, d), createjs.Tween.get(tipsText, {
        override: !0
    }).set({
        alpha: 1
    }).to({
        alpha: 0
    }, d));
    null != g && (tipsText1 = new createjs.Text("test",
            "bold " + 48 * tileScale + "px Helvetica", "#ee1122"), tipsText1.text = g, tipsText1.set({
            alpha: 1
        }), g.length ? (c = tipsText1.getBounds().width, b = tipsText1.getBounds().height) : c = b = 0, a = tipsText1.x = (canvas.width - c) / 2 | 0, e = tipsText1.y = (NO_OF_TILES_Y * tileHScale - b) / 2 + 2 * tipsText.getBounds().height | 0, tipsText1.shadow = new createjs.Shadow("white", 2, 2, 1), tipsRect1 = new createjs.Shape, tipsRect1.graphics.beginFill("#020722"), tipsRect1.graphics.drawRect(-1, -1, c + 2, b + 2), tipsRect1.setTransform(a, e).set({
            alpha: .8
        }), mainStage.addChild(tipsRect1),
        mainStage.addChild(tipsText1), d && (createjs.Tween.get(tipsRect1, {
            override: !0
        }).set({
            alpha: .8
        }).to({
            alpha: 0
        }, d), createjs.Tween.get(tipsText1, {
            override: !0
        }).set({
            alpha: 1
        }).to({
            alpha: 0
        }, d)));
    mainStage.update()
}
var dspTrapTile = 0;

function toggleTrapTile() {
    dspTrapTile ^= 1;
    for (var a = 0; a < NO_OF_TILES_Y; a++)
        for (var d = 0; d < NO_OF_TILES_X; d++) map[d][a].base == TRAP_T && (dspTrapTile ? map[d][a].bitmap.set({
            alpha: .5
        }) : map[d][a].bitmap.set({
            alpha: 1
        }));
    dspTrapTile ? showTipsText("SHOW TRAP TILE", 2E3) : showTipsText("HIDE TRAP TILE", 2E3)
}

function startAllSpriteObj() {
    runner && !runner.paused && runner.sprite.play();
    for (var a = 0; a < guardCount; a++) guard[a].paused || guard[a].sprite.play();
    if (3 > curAiVersion) {
        for (a = 0; a < fillHoleObj.length; a++) fillHoleObj[a].play();
        holeObj.action == ACT_DIGGING && holeObj.sprite.play()
    }
}

function stopAllSpriteObj() {
    runner && (runner.paused = runner.sprite.paused, runner.sprite.stop());
    for (var a = 0; a < guardCount; a++) guard[a].paused = guard[a].sprite.paused, guard[a].sprite.stop();
    if (3 > curAiVersion) {
        for (a = 0; a < fillHoleObj.length; a++) fillHoleObj[a].stop();
        holeObj.action == ACT_DIGGING && holeObj.sprite.stop()
    }
}

function gameOverAnimation() {
    var a = getThemeBitmap("over"),
        d = a.getBounds(),
        g = NO_OF_TILES_X * tileWScale / 2 | 0,
        c = NO_OF_TILES_Y * tileHScale / 2 | 0,
        b = d.width / 2 | 0,
        e = d.height / 2 | 0,
        f = new createjs.Shape;
    f.graphics.beginFill("black");
    f.graphics.drawRect(-1, -1, d.width + 2, d.height + 2);
    f.setTransform(g, c, tileScale, tileScale).set({
        regX: b,
        regY: e
    });
    a.setTransform(g, c, tileScale, tileScale).set({
        regX: b,
        regY: e
    });
    createjs.Tween.get(a).to({
        scaleY: -tileScale
    }, 80).to({
        scaleY: tileScale
    }, 80).to({
        scaleY: -tileScale
    }, 100).to({
            scaleY: tileScale
        },
        100).to({
        scaleY: -tileScale
    }, 150).to({
        scaleY: tileScale
    }, 150).to({
        scaleY: -tileScale
    }, 300).to({
        scaleY: tileScale
    }, 300).to({
        scaleY: -tileScale
    }, 450).to({
        scaleY: tileScale
    }, 450).to({
        scaleY: -tileScale
    }, 750).to({
        scaleY: tileScale
    }, 750).wait(1500).call(function() {
        gameState == GAME_OVER_ANIMATION && (gameState = GAME_OVER)
    });
    mainStage.addChild(f);
    mainStage.addChild(a)
}
var cycScreen, cycMaxRadius, cycDiff, cycX, cycY;

function initCycVariable() {
    cycX = NO_OF_TILES_X * tileWScale / 2;
    cycY = NO_OF_TILES_Y * tileHScale / 2;
    cycMaxRadius = Math.sqrt(cycX * cycX + cycY * cycY) | 1;
    cycDiff = cycMaxRadius / CLOSE_SCREEN_SPEED | 0
}

function addCycScreen() {
    cycScreen = new createjs.Shape;
    mainStage.addChild(cycScreen);
    setGroundInfoOrder()
}

function removeCycScreen() {
    mainStage.removeChild(cycScreen)
}

function newLevel(a) {
    changingLevel = 1;
    addCycScreen();
    setTimeout(function() {
        closingScreen(cycMaxRadius)
    }, 100)
}

function closingScreen(a) {
    removeCycScreen();
    addCycScreen();
    cycScreen.graphics.beginFill("black").arc(cycX, cycY, a, 0, 2 * Math.PI, !0);
    cycScreen.graphics.arc(cycX, cycY, cycMaxRadius, 0, 2 * Math.PI, !1);
    mainStage.update();
    if (0 < a) a -= cycDiff, a < 2 * cycDiff && (a = 0), setTimeout(function() {
        closingScreen(a)
    }, 5);
    else {
        curAiVersion = AI_VERSION;
        initHotKeyVariable();
        playMode == PLAY_AUTO && getAutoDemoLevel(0);
        playMode != PLAY_DEMO && playMode != PLAY_DEMO_ONCE || getNextDemoLevel();
        var d = playMode == PLAY_TEST ? getTestLevelMap() : levelData[curLevel -
            1];
        showLevel(d);
        addCycScreen();
        setTimeout(function() {
            openingScreen(2 * cycDiff)
        }, 5)
    }
}

function menuIconEnable() {
    mainMenuIconObj.enable();
    playMode != PLAY_MODERN && playMode != PLAY_DEMO || playData == PLAY_DATA_SHARE || selectIconObj.enable();
    playMode == PLAY_CLASSIC && champIconObj.enable();
    playMode == PLAY_MODERN && (playData == PLAY_DATA_USERDEF ? shareIconObj.enable() : demoIconObj.enable());
    playMode != PLAY_EDIT ? (soundIconObj.enable(), soundIconObj.updateSoundImage(), repeatActionIconObj.enable(), themeColorObj.enable()) : editInNarrowScreen || themeColorObj.enable();
    infoIconObj.enable();
    helpIconObj.enable();
    themeIconObj.enable()
}

function menuIconDisable(a) {
    mainMenuIconObj.disable(a);
    playMode == PLAY_MODERN && selectIconObj.disable(a);
    playMode == PLAY_CLASSIC && champIconObj.disable(a);
    demoIconObj.disable(a);
    shareIconObj.disable(a);
    soundIconObj.disable(a);
    infoIconObj.disable(a);
    helpIconObj.disable(a);
    repeatActionIconObj.disable(a);
    themeIconObj.disable(a);
    themeColorObj.disable(a)
}
var showStartTipsMsg = 1;

function initShowDataMsg(a) {
    "undefined" == typeof a && (a = 1);
    showStartTipsMsg = a
}

function showDataMsg() {
    if (showStartTipsMsg) {
        var a = null;
        var d = playDataToTitleName(playData);
        switch (playMode) {
            case PLAY_EDIT:
                a = "Edit Mode";
                break;
            case PLAY_TEST:
                a = "Test Mode";
                break;
            case PLAY_DEMO:
                a = "Demo Mode";
                break;
            case PLAY_CLASSIC:
                a = playData != PLAY_DATA_USERDEF ? "Challenge Mode" : "Play Mode";
                break;
            case PLAY_MODERN:
                a = playData == PLAY_DATA_USERDEF ? "Play Mode" : playData == PLAY_DATA_SHARE ? shareInfo.creator ? "By " + shareInfo.creator : "" : "Training Mode"
        }
        d && showTipsMsg(d, mainStage, tileScale, a);
        showStartTipsMsg = 0
    }
}

function showHelpMenu() {
    firstPlay ? (helpObj.showHelp(0, initForPlay, tileScale, null), setFirstPlayInfo()) : initForPlay()
}

function initForPlay() {
    menuIconEnable();
    showDataMsg()
}

function openingScreen(a) {
    removeCycScreen();
    addCycScreen();
    cycScreen.graphics.beginFill("black").arc(cycX, cycY, a, 0, 2 * Math.PI, !0);
    cycScreen.graphics.arc(cycX, cycY, cycMaxRadius, 0, 2 * Math.PI, !1);
    mainStage.update();
    a < cycMaxRadius ? (a += cycDiff, a > cycMaxRadius && (a = cycMaxRadius), setTimeout(function() {
        openingScreen(a)
    }, 5)) : (removeCycScreen(), beginPlay())
}

function beginPlay() {
    gameState = GAME_START;
    keyAction = ACT_STOP;
    runner.sprite.gotoAndPlay();
    changingLevel = 0;
    recordMode && initRecordVariable();
    playMode == PLAY_AUTO || playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE ? (initPlayDemo(), playMode != PLAY_DEMO && playMode != PLAY_DEMO_ONCE || initForPlay()) : ("" == playerName || 1 >= playerName.length ? inputPlayerName(mainStage, showHelpMenu) : showHelpMenu(), playMode != PLAY_TEST && playMode != PLAY_EDIT && enableAutoDemoTimer())
}

function incLevel(a, d) {
    var g = 0;
    for (curLevel += a; curLevel > levelData.length;) curLevel -= levelData.length, g = 1;
    playMode == PLAY_CLASSIC && setClassicInfo(d);
    playMode == PLAY_MODERN && setModernInfo();
    return g
}

function decLevel(a) {
    for (curLevel -= a; 0 >= curLevel;) curLevel += levelData.length;
    playMode == PLAY_CLASSIC && setClassicInfo(0);
    playMode == PLAY_MODERN && setModernInfo()
}

function updateModernScoreInfo() {
    var a = modernScoreInfo[curLevel - 1],
        d = (MAX_TIME_COUNT - curTime + curGetGold + curGuardDeadNo) * SCORE_VALUE_PER_POINT;
    a < d && (modernScoreInfo[curLevel - 1] = d, setModernScoreInfo());
    0 > a && (a = 0);
    return a
}

function gameFinishActiveNew(a) {
    curLevel = a;
    setModernInfo();
    startGame()
}

function gameFinishCloseIcon() {
    startGame()
}

function gameFinishCallback(a) {
    switch (a) {
        case 0:
            gameState = GAME_NEW_LEVEL;
            break;
        case 1:
            playData == PLAY_DATA_SHARE ? editShareLevel() : activeSelectMenu(gameFinishActiveNew, gameFinishCloseIcon);
            break;
        case 2:
            incLevel(1, 0);
            gameState = GAME_NEW_LEVEL;
            break;
        default:
            debug("design error !")
    }
}

function gameFinishTestModeCallback() {
    back2EditMode(1)
}
var lastScoreTime, scoreDuration, scoreIncValue, finalScore;

function mainTick(a) {
    var d = a.delta / 1E3;
    switch (gameState) {
        case GAME_START:
            countAutoDemoTimer();
            keyAction != ACT_STOP && keyAction != ACT_UNKNOWN && (disableAutoDemoTimer(), gamepadClearId(), gameState = GAME_RUNNING, playMode == PLAY_MODERN && demoIconObj.disable(1), playTickTimer = 0, 0 >= goldCount && showHideLaddr());
            break;
        case GAME_RUNNING:
            playGame(d);
            break;
        case GAME_RUNNER_DEAD:
            recordMode == RECORD_KEY && recordModeDump(GAME_RUNNER_DEAD);
            soundStop(soundFall);
            stopAllSpriteObj();
            themeSoundPlay("dead");
            switch (playMode) {
                case PLAY_CLASSIC:
                case PLAY_AUTO:
                    --runnerLife;
                    drawLife();
                    0 >= runnerLife ? (gameOverAnimation(), menuIconDisable(1), playMode == PLAY_CLASSIC && clearClassicInfo(), gameState = GAME_OVER_ANIMATION) : (setTimeout(function() {
                        gameState = GAME_NEW_LEVEL
                    }, 500), gameState = GAME_WAITING, playMode == PLAY_CLASSIC && setClassicInfo(0));
                    break;
                case PLAY_DEMO:
                    error("DEMO dead level=" + curLevel);
                    updateDemoDataState(playData, demoData[curLevel - 1]);
                    setTimeout(function() {
                        incLevel(1, 0);
                        gameState = GAME_NEW_LEVEL
                    }, 500);
                    gameState = GAME_WAITING;
                    break;
                case PLAY_DEMO_ONCE:
                    error("DEMO dead level=" +
                        curLevel);
                    updateDemoDataState(playData, demoData[curLevel - 1]);
                    disableStageClickEvent();
                    document.onkeydown = handleKeyDown;
                    setTimeout(function() {
                        playMode = PLAY_MODERN;
                        startGame()
                    }, 500);
                    gameState = GAME_WAITING;
                    break;
                case PLAY_MODERN:
                    setTimeout(function() {
                        gameState = GAME_NEW_LEVEL
                    }, 500);
                    gameState = GAME_WAITING;
                    break;
                case PLAY_TEST:
                    setTimeout(function() {
                        back2EditMode(0)
                    }, 500);
                    gameState = GAME_WAITING;
                    break;
                default:
                    debug("GAME_RUNNER_DEAD: desgin error !")
            }
            break;
        case GAME_OVER_ANIMATION:
            break;
        case GAME_OVER:
            a =
                null;
            playMode != PLAY_CLASSIC || sometimePlayInGodMode || (a = {
                s: curScore,
                l: passedLevel + 1
            });
            showScoreTable(playData, a, function() {
                showCoverPage()
            });
            gameState = GAME_WAITING;
            return;
        case GAME_FINISH:
            stopAllSpriteObj();
            switch (playMode) {
                case PLAY_CLASSIC:
                case PLAY_AUTO:
                case PLAY_DEMO:
                    soundPlay(soundPass);
                    finalScore = curScore + SCORE_COMPLETE_LEVEL;
                    scoreDuration = soundPass.getDuration() / (SCORE_COUNTER + 1) | 0;
                    lastScoreTime = a.time;
                    scoreIncValue = SCORE_COMPLETE_LEVEL / SCORE_COUNTER | 0;
                    drawScore(scoreIncValue);
                    gameState = GAME_FINISH_SCORE_COUNT;
                    break;
                case PLAY_DEMO_ONCE:
                    soundPlay(soundEnding);
                    disableStageClickEvent();
                    document.onkeydown = handleKeyDown;
                    setTimeout(function() {
                        playMode = PLAY_MODERN;
                        startGame()
                    }, 500);
                    gameState = GAME_WAITING;
                    break;
                case PLAY_MODERN:
                    soundPlay(soundEnding);
                    a = a = updateModernScoreInfo();
                    playData == PLAY_DATA_SHARE ? levelPassDialog(-1, curGetGold, curGuardDeadNo, curTime, a, returnBitmap, editBitmap, null, mainStage, tileScale, gameFinishCallback) : levelPassDialog(curLevel, curGetGold, curGuardDeadNo, curTime, a, returnBitmap, select1Bitmap,
                        nextBitmap, mainStage, tileScale, gameFinishCallback);
                    gameState = GAME_WAITING;
                    break;
                case PLAY_TEST:
                    soundPlay(soundEnding);
                    setTimeout(function() {
                        back2EditMode(1)
                    }, 500);
                    gameState = GAME_WAITING;
                    break;
                default:
                    error("design error, playMode =" + playMode)
            }
            recordMode == RECORD_KEY && (recordModeDump(GAME_FINISH), playMode == PLAY_CLASSIC || playMode == PLAY_MODERN) && (playData <= maxPlayId ? (sendDemoData2Server(playData, curDemoData), updatePlayerDemoData(playData, curDemoData)) : playData == PLAY_DATA_SHARE && sendShareLevel2Server(levelData[curLevel -
                1], shareInfo, curDemoData));
            break;
        case GAME_FINISH_SCORE_COUNT:
            if (a.time > lastScoreTime + scoreDuration)
                if (lastScoreTime += scoreDuration, curScore + scoreIncValue >= finalScore) {
                    curScore = finalScore;
                    drawScore(0);
                    gameState = GAME_NEW_LEVEL;
                    switch (playMode) {
                        case PLAY_TEST:
                            setTimeout(function() {
                                back2EditMode(1)
                            }, 500);
                            break;
                        case PLAY_CLASSIC:
                            ++runnerLife > RUNNER_MAX_LIFE && (runnerLife = RUNNER_MAX_LIFE);
                            break;
                        case PLAY_AUTO:
                            demoCount >= demoMaxCount && (setTimeout(function() {
                                showCoverPage()
                            }, 500), gameState = GAME_WAITING)
                    }
                    recordMode !=
                        RECORD_PLAY && incLevel(1, 1) && playMode == PLAY_CLASSIC && passedLevel >= levelData.length && (gameState = GAME_WIN)
                } else drawScore(scoreIncValue);
            break;
        case GAME_NEXT_LEVEL:
            soundStop(soundFall);
            stopAllSpriteObj();
            incLevel(shiftLevelNum, 0);
            gameState = GAME_NEW_LEVEL;
            return;
        case GAME_PREV_LEVEL:
            soundStop(soundFall);
            stopAllSpriteObj();
            decLevel(shiftLevelNum);
            gameState = GAME_NEW_LEVEL;
            return;
        case GAME_NEW_LEVEL:
            gameState = GAME_WAITING;
            newLevel();
            break;
        case GAME_WIN:
            a = {
                s: curScore,
                l: levelData.length,
                w: 1
            };
            menuIconDisable(1);
            clearClassicInfo();
            showScoreTable(playData, a, function() {
                showCoverPage()
            });
            gameState = GAME_WAITING;
            return;
        case GAME_LOADING:
            break;
        default:
            return
    }
    mainStage.update()
};