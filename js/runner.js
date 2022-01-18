var STATE_OK_TO_MOVE = 1,
    STATE_FALLING = 2;

function moveRunner() {
    var b = runner.pos.x,
        c = runner.pos.xOffset,
        a = runner.pos.y,
        d = runner.pos.yOffset;
    var f = map[b][a].base;
    if (f == LADDR_T || f == BAR_T && 0 == d) f = STATE_OK_TO_MOVE;
    else if (0 > d) f = STATE_FALLING;
    else if (a < maxTileY) {
        var e = map[b][a + 1].act;
        switch (!0) {
            case e == EMPTY_T:
                f = STATE_FALLING;
                break;
            case e == BLOCK_T || e == LADDR_T || e == SOLID_T:
                f = STATE_OK_TO_MOVE;
                break;
            case e == GUARD_T:
                f = STATE_OK_TO_MOVE;
                break;
            default:
                f = STATE_FALLING
        }
    } else f = STATE_OK_TO_MOVE;
    if (f == STATE_FALLING) g = a >= maxTileY || (e = map[b][a + 1].act) == BLOCK_T ||
        e == SOLID_T || e == GUARD_T, runnerMoveStep(ACT_FALL, g);
    else {
        f = ACT_STOP;
        var g = 1;
        switch (keyAction) {
            case ACT_UP:
                g = 0 >= a || (e = map[b][a - 1].act) == BLOCK_T || e == SOLID_T || e == TRAP_T;
                0 < a && map[b][a].base != LADDR_T && d < H4 && 0 < d && map[b][a + 1].base == LADDR_T ? (g = 1, f = ACT_UP) : map[b][a].base != LADDR_T && (0 >= d || map[b][a + 1].base != LADDR_T) || 0 >= d && g || (f = ACT_UP);
                break;
            case ACT_DOWN:
                g = a >= maxTileY || (e = map[b][a + 1].act) == BLOCK_T || e == SOLID_T;
                0 <= d && g || (f = ACT_DOWN);
                break;
            case ACT_LEFT:
                g = 0 >= b || (e = map[b - 1][a].act) == BLOCK_T || e == SOLID_T || e == TRAP_T;
                0 >= c && g || (f = ACT_LEFT);
                break;
            case ACT_RIGHT:
                g = b >= maxTileX || (e = map[b + 1][a].act) == BLOCK_T || e == SOLID_T || e == TRAP_T;
                0 <= c && g || (f = ACT_RIGHT);
                break;
            case ACT_DIG_LEFT:
            case ACT_DIG_RIGHT:
                ok2Dig(keyAction) ? (runnerMoveStep(keyAction, g), digHole(keyAction)) : runnerMoveStep(ACT_STOP, g);
                keyAction = ACT_STOP;
                return
        }
        runnerMoveStep(f, g)
    }
}

function runnerMoveStep(b, c) {
    var a = runner.pos.x,
        d = runner.pos.xOffset,
        f = runner.pos.y,
        e = runner.pos.yOffset,
        g, k;
    var m = k = runner.shape;
    var l = g = ACT_STOP;
    switch (b) {
        case ACT_DIG_LEFT:
        case ACT_DIG_RIGHT:
            e = d = 0;
            break;
        case ACT_UP:
        case ACT_DOWN:
        case ACT_FALL:
            0 < d ? l = ACT_LEFT : 0 > d && (l = ACT_RIGHT);
            break;
        case ACT_LEFT:
        case ACT_RIGHT:
            0 < e ? g = ACT_UP : 0 > e && (g = ACT_DOWN)
    }
    var h = map[a][f].base;
    if (b == ACT_UP) {
        e -= yMove;
        if (c && 0 > e) e = 0;
        else if (e < -H2) {
            if (h == BLOCK_T || h == HLADR_T) h = EMPTY_T;
            map[a][f].act = h;
            f--;
            e = tileH + e;
            map[a][f].act == GUARD_T &&
                guardAlive(a, f) && setRunnerDead()
        }
        k = "runUpDn"
    }
    g == ACT_UP && (e -= yMove, 0 > e && (e = 0));
    if (b == ACT_DOWN || b == ACT_FALL) {
        k = 0;
        h == BAR_T && (0 > e ? k = 1 : b == ACT_DOWN && f < maxTileY && map[a][f + 1].act != LADDR_T && map[a][f + 1].act != GUARD_T && (b = ACT_FALL));
        e += yMove;
        1 == k && 0 <= e && (e = 0, b = ACT_FALL_BAR);
        if (c && 0 < e) e = 0;
        else if (e > H2) {
            if (h == BLOCK_T || h == HLADR_T) h = EMPTY_T;
            map[a][f].act = h;
            f++;
            e -= tileH;
            map[a][f].act == GUARD_T && guardAlive(a, f) && setRunnerDead()
        }
        b == ACT_DOWN ? k = "runUpDn" : (f < maxTileY && map[a][f + 1].act == GUARD_T && (k = getGuardId(a, f + 1), e > guard[k].pos.yOffset &&
            (e = guard[k].pos.yOffset)), k = b == ACT_FALL_BAR ? runner.lastLeftRight == ACT_LEFT ? "barLeft" : "barRight" : runner.lastLeftRight == ACT_LEFT ? "fallLeft" : "fallRight")
    }
    g == ACT_DOWN && (e += yMove, 0 < e && (e = 0));
    if (b == ACT_LEFT) {
        d -= xMove;
        if (c && 0 > d) d = 0;
        else if (d < -W2) {
            if (h == BLOCK_T || h == HLADR_T) h = EMPTY_T;
            map[a][f].act = h;
            a--;
            d = tileW + d;
            map[a][f].act == GUARD_T && guardAlive(a, f) && setRunnerDead()
        }
        k = h == BAR_T ? "barLeft" : "runLeft"
    }
    l == ACT_LEFT && (d -= xMove, 0 > d && (d = 0));
    if (b == ACT_RIGHT) {
        d += xMove;
        if (c && 0 < d) d = 0;
        else if (d > W2) {
            if (h == BLOCK_T || h ==
                HLADR_T) h = EMPTY_T;
            map[a][f].act = h;
            a++;
            d -= tileW;
            map[a][f].act == GUARD_T && guardAlive(a, f) && setRunnerDead()
        }
        k = h == BAR_T ? "barRight" : "runRight"
    }
    l == ACT_RIGHT && (d += xMove, 0 < d && (d = 0));
    if (b == ACT_STOP) runner.action == ACT_FALL && (soundStop(soundFall), themeSoundPlay("down")), runner.action != ACT_STOP && (runner.sprite.stop(), runner.action = ACT_STOP);
    else {
        runner.sprite.x = (a * tileW + d) * tileScale | 0;
        runner.sprite.y = (f * tileH + e) * tileScale | 0;
        runner.pos = {
            x: a,
            y: f,
            xOffset: d,
            yOffset: e
        };
        m != k && (runner.sprite.gotoAndPlay(k), runner.shape =
            k);
        b != runner.action && (runner.action == ACT_FALL ? (soundStop(soundFall), themeSoundPlay("down")) : b == ACT_FALL && soundPlay(soundFall), runner.sprite.play());
        if (b == ACT_LEFT || b == ACT_RIGHT) runner.lastLeftRight = b;
        runner.action = b
    }
    map[a][f].act = RUNNER_T;
    map[a][f].base == TRAP_T && map[a][f].bitmap.set({
        alpha: .5
    });
    map[a][f].base == GOLD_T && (!d && 0 <= e && e < H4 || !e && 0 <= d && d < W4 || f < maxTileY && map[a][f + 1].base == LADDR_T && e < H4) && (removeGold(a, f), themeSoundPlay("getGold"), decGold(), playMode == PLAY_CLASSIC || playMode == PLAY_AUTO || playMode ==
        PLAY_DEMO ? drawScore(SCORE_GET_GOLD) : drawGold(1));
    checkCollision(a, f)
}

function decGold() {
    0 >= --goldCount && (showHideLaddr(), 0 < runner.pos.y && ("C64" == curTheme ? soundPlay("goldFinish" + ((curLevel - 1) % 6 + 1)) : soundPlay("goldFinish")))
}

function removeGold(b, c) {
    map[b][c].base = EMPTY_T;
    mainStage.removeChild(map[b][c].bitmap);
    map[b][c].bitmap = null
}

function addGold(b, c) {
    map[b][c].base = GOLD_T;
    var a = map[b][c].bitmap = getThemeBitmap("gold");
    a.setTransform(b * tileWScale, c * tileHScale, tileScale, tileScale);
    mainStage.addChild(a);
    moveSprite2Top()
}

function showHideLaddr() {
    for (var b = 0, c = 0; c < NO_OF_TILES_Y; c++)
        for (var a = 0; a < NO_OF_TILES_X; a++) map[a][c].base == HLADR_T && (b = 1, map[a][c].base = LADDR_T, map[a][c].act = LADDR_T, map[a][c].bitmap.set({
            alpha: 1
        }));
    goldComplete = 1;
    return b
}

function checkCollision(b, c) {
    var a = -1,
        d = -1;
    switch (!0) {
        case 0 < c && map[b][c - 1].act == GUARD_T:
            a = b;
            d = c - 1;
            break;
        case c < maxTileY && map[b][c + 1].act == GUARD_T:
            a = b;
            d = c + 1;
            break;
        case 0 < b && map[b - 1][c].act == GUARD_T:
            a = b - 1;
            d = c;
            break;
        case b < maxTileX && map[b + 1][c].act == GUARD_T:
            a = b + 1, d = c
    }
    if (0 <= a) {
        for (b = 0; b < guardCount && (guard[b].pos.x != a || guard[b].pos.y != d); b++);
        assert(b < guardCount, "checkCollision design error !");
        guard[b].action != ACT_REBORN && (a = Math.abs(runner.pos.y * tileH + runner.pos.yOffset - (guard[b].pos.y * tileH + guard[b].pos.yOffset)),
            Math.abs(runner.pos.x * tileW + runner.pos.xOffset - (guard[b].pos.x * tileW + guard[b].pos.xOffset)) <= 3 * W4 && a <= 3 * H4 && setRunnerDead())
    }
}

function ok2Dig(b) {
    var c = runner.pos.x,
        a = runner.pos.y,
        d = 0;
    switch (b) {
        case ACT_DIG_LEFT:
            a < maxTileY && 0 < c && map[c - 1][a + 1].act == BLOCK_T && map[c - 1][a].act == EMPTY_T && map[c - 1][a].base != GOLD_T && (d = 1);
            break;
        case ACT_DIG_RIGHT:
            a < maxTileY && c < maxTileX && map[c + 1][a + 1].act == BLOCK_T && map[c + 1][a].act == EMPTY_T && map[c + 1][a].base != GOLD_T && (d = 1)
    }
    return d
}
var digHoleLeft = [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7],
    digHoleRight = [8, 9, 10, 10, 11, 12, 12, 13, 14, 14, 15];

function processDigHole() {
    3 > curAiVersion || (++holeObj.curFrameIdx < holeObj.shapeFrame.length ? (holeObj.sprite.gotoAndStop(holeObj.shapeFrame[holeObj.curFrameIdx]), holeObj.sprite.currentAnimationFrame = holeObj.curFrameIdx) : digComplete())
}
var digTimeStart, shakeTimeStart, fillHoleTimeStart, rebornTimeStart;

function digHole(b) {
    if (b == ACT_DIG_LEFT) {
        var c = runner.pos.x - 1;
        var a = runner.pos.y;
        runner.shape = "digLeft";
        var d = "digHoleLeft"
    } else c = runner.pos.x + 1, a = runner.pos.y, runner.shape = "digRight", d = "digHoleRight";
    soundPlay(soundDig);
    map[c][a + 1].bitmap.set({
        alpha: 0
    });
    runner.sprite.gotoAndPlay(runner.shape);
    holeObj.action = ACT_DIGGING;
    holeObj.pos = {
        x: c,
        y: a
    };
    holeObj.sprite.setTransform(c * tileWScale, a * tileHScale, tileScale, tileScale);
    digTimeStart = recordCount;
    3 > curAiVersion ? (holeObj.sprite.gotoAndPlay(d), holeObj.sprite.on("animationend",
        digComplete)) : (d = b == ACT_DIG_LEFT ? digHoleLeft : digHoleRight, holeObj.sprite.gotoAndStop(d[0]), holeObj.shapeFrame = d, holeObj.curFrameIdx = 0);
    mainStage.addChild(holeObj.sprite)
}
var DEBUG_DIG = 0;

function isDigging() {
    var b = 0;
    if (holeObj.action == ACT_DIGGING) {
        var c = holeObj.pos.x,
            a = holeObj.pos.y;
        if (map[c][a].act == GUARD_T) {
            var d = getGuardId(c, a);
            holeObj.sprite.currentAnimationFrame < holeObj.digLimit && guard[d].pos.yOffset > -H4 ? (DEBUG_DIG && (loadingTxt.text = "dig : " + holeObj.sprite.currentAnimationFrame + " (X)"), stopDigging(c, a)) : (DEBUG_DIG && (loadingTxt.text = "dig : " + holeObj.sprite.currentAnimationFrame + " (O)"), 3 <= curAiVersion && (map[c][a + 1].act = EMPTY_T, b = 1))
        } else {
            switch (runner.shape) {
                case "digLeft":
                    2 <
                        holeObj.sprite.currentAnimationFrame && (runner.sprite.gotoAndStop("runLeft"), runner.shape = "runLeft", runner.action = ACT_STOP);
                    break;
                case "digRight":
                    2 < holeObj.sprite.currentAnimationFrame && (runner.sprite.gotoAndStop("runRight"), runner.shape = "runRight", runner.action = ACT_STOP)
            }
            b = 1
        }
    }
    return b
}

function stopDigging(b, c) {
    holeObj.sprite.removeAllEventListeners("animationend");
    holeObj.action = ACT_STOP;
    mainStage.removeChild(holeObj.sprite);
    c++;
    map[b][c].act = map[b][c].base;
    assert(map[b][c].base == BLOCK_T, "fill hole != BLOCK_T");
    map[b][c].bitmap.set({
        alpha: 1
    });
    switch (runner.shape) {
        case "digLeft":
            runner.sprite.gotoAndStop("runLeft");
            runner.shape = "runLeft";
            runner.action = ACT_STOP;
            break;
        case "digRight":
            runner.sprite.gotoAndStop("runRight"), runner.shape = "runRight", runner.action = ACT_STOP
    }
    soundStop(soundDig)
}

function digComplete() {
    var b = holeObj.pos.x,
        c = holeObj.pos.y + 1;
    map[b][c].act = EMPTY_T;
    holeObj.sprite.removeAllEventListeners("animationend");
    holeObj.action = ACT_STOP;
    mainStage.removeChild(holeObj.sprite);
    DEBUG_TIME && (loadingTxt.text = "DigTime = " + (recordCount - digTimeStart));
    fillHole(b, c)
}
var fillHoleObj = [];

function fillHole(b, c) {
    var a = new createjs.Sprite(holeData, "fillHole");
    a.pos = {
        x: b,
        y: c
    };
    a.setTransform(b * tileWScale, c * tileHScale, tileScale, tileScale);
    3 > curAiVersion ? (a.on("animationend", fillComplete, null, !1, {
        obj: a
    }), a.play()) : (a.curFrameIdx = 0, a.curFrameTime = -1, a.gotoAndStop(fillHoleFrame[0]));
    mainStage.addChild(a);
    fillHoleObj.push(a);
    fillHoleTimeStart = recordCount
}

function moveFillHoleObj2Top() {
    for (var b = 0; b < fillHoleObj.length; b++) moveChild2Top(mainStage, fillHoleObj[b])
}

function fillComplete(b, c) {
    var a = c.obj;
    b = a.pos.x;
    c = a.pos.y;
    map[b][c].bitmap.set({
        alpha: 1
    });
    a.removeAllEventListeners("animationend");
    mainStage.removeChild(a);
    removeFillHoleObj(a);
    switch (map[b][c].act) {
        case RUNNER_T:
            gameState = GAME_RUNNER_DEAD;
            runner.sprite.set({
                alpha: 0
            });
            break;
        case GUARD_T:
            a = getGuardId(b, c), 3 <= curAiVersion && guard[a].action == ACT_IN_HOLE && removeFromShake(a), 0 < guard[a].hasGold && (decGold(), guard[a].hasGold = 0, guardRemoveRedhat(guard[a])), guardReborn(b, c), playMode == PLAY_CLASSIC || playMode ==
                PLAY_AUTO || playMode == PLAY_DEMO ? drawScore(SCORE_GUARD_DEAD) : drawGuard(1)
    }
    map[b][c].act = BLOCK_T;
    DEBUG_TIME && (loadingTxt.text = "FillHoleTime = " + (recordCount - fillHoleTimeStart))
}

function removeFillHoleObj(b) {
    for (var c = 0; c < fillHoleObj.length; c++)
        if (fillHoleObj[c] == b) {
            fillHoleObj.splice(c, 1);
            return
        } error("design error !")
}
var fillHoleFrame = [16, 17, 18, 19],
    fillHoleTime = [166, 8, 8, 4];

function initFillHoleVariable() {
    fillHoleObj = []
}

function processFillHole() {
    for (var b, c, a = 0; a < fillHoleObj.length;) {
        c = fillHoleObj[a];
        b = c.curFrameIdx;
        if (++c.curFrameTime >= fillHoleTime[b])
            if (++c.curFrameIdx < fillHoleFrame.length) c.curFrameTime = 0, c.gotoAndStop(fillHoleFrame[c.curFrameIdx]);
            else {
                fillComplete(null, {
                    obj: c
                });
                continue
            } a++
    }
}

function guardAlive(b, c) {
    for (var a = 0; a < guardCount && (guard[a].pos.x != b || guard[a].pos.y != c); a++);
    assert(a < guardCount, "guardAlive() design error !");
    return guard[a].action != ACT_REBORN ? 1 : 0
};