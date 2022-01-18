var movePolicy = [
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 2, 1, 1, 2, 1],
    [1, 2, 2, 1, 2, 2],
    [2, 2, 2, 2, 2, 2],
    [2, 2, 3, 2, 2, 3],
    [2, 3, 3, 2, 3, 3],
    [3, 3, 3, 3, 3, 3],
    [3, 3, 4, 3, 3, 4],
    [3, 4, 4, 3, 4, 4],
    [4, 4, 4, 4, 4, 4]
],
moveOffset = 0,
moveId = 0,
numOfMoveItems = movePolicy[0].length;

function initGuardVariable() {
moveOffset = moveId = 0
}

function moveGuard() {
var b;
if (guardCount)
    for (++moveOffset >= numOfMoveItems && (moveOffset = 0), b = movePolicy[guardCount][moveOffset]; 0 < b--;) {
        ++moveId >= guardCount && (moveId = 0);
        var c = guard[moveId];
        c.action != ACT_IN_HOLE && c.action != ACT_REBORN && guardMoveStep(moveId, bestMove(moveId))
    }
}

function guardMoveStep(b, c) {
var a = guard[b],
    d = a.pos.x,
    e = a.pos.xOffset,
    f = a.pos.y,
    g = a.pos.yOffset,
    h, m, k;
var n = m = ACT_STOP;
var p = k = a.shape;
a.action == ACT_CLIMB_OUT && c == ACT_STOP && (a.action = ACT_STOP);
switch (c) {
    case ACT_UP:
    case ACT_DOWN:
    case ACT_FALL:
        if (c == ACT_UP) {
            var l = 0 >= f || (h = map[d][f - 1].act) == BLOCK_T || h == SOLID_T || h == TRAP_T || h == GUARD_T;
            0 >= g && l && (c = ACT_STOP)
        } else l = f >= maxTileY || (h = map[d][f + 1].act) == BLOCK_T || h == SOLID_T || h == GUARD_T, c == ACT_FALL && 0 > g && map[d][f].base == BLOCK_T ? (c = ACT_IN_HOLE, l = 1) : 0 <= g && l && (c =
            ACT_STOP);
        c != ACT_STOP && (0 < e ? n = ACT_LEFT : 0 > e && (n = ACT_RIGHT));
        break;
    case ACT_LEFT:
    case ACT_RIGHT:
        c == ACT_LEFT ? (l = 0 >= d || (h = map[d - 1][f].act) == BLOCK_T || h == SOLID_T || h == GUARD_T || map[d - 1][f].base == TRAP_T, 0 >= e && l && (c = ACT_STOP)) : (l = d >= maxTileX || (h = map[d + 1][f].act) == BLOCK_T || h == SOLID_T || h == GUARD_T || map[d + 1][f].base == TRAP_T, 0 <= e && l && (c = ACT_STOP)), c != ACT_STOP && (0 < g ? m = ACT_UP : 0 > g && (m = ACT_DOWN))
}
h = map[d][f].base;
if (c == ACT_UP) {
    g -= yMove;
    if (l && 0 > g) g = 0;
    else if (g < -H2) {
        if (h == BLOCK_T || h == HLADR_T) h = EMPTY_T;
        map[d][f].act = h;
        f--;
        g = tileH + g;
        map[d][f].act == RUNNER_T && setRunnerDead()
    }
    0 >= g && g > -yMove && dropGold(b);
    k = "runUpDn"
}
m == ACT_UP && (g -= yMove, 0 > g && (g = 0));
if (c == ACT_DOWN || c == ACT_FALL || c == ACT_IN_HOLE) {
    var q = 0;
    h == BAR_T && (0 > g ? q = 1 : c == ACT_DOWN && f < maxTileY && map[d][f + 1].act != LADDR_T && (c = ACT_FALL));
    g += yMove;
    1 == q && 0 <= g && (g = 0, c = ACT_FALL_BAR);
    if (l && 0 < g) g = 0;
    else if (g > H2) {
        if (h == BLOCK_T || h == HLADR_T) h = EMPTY_T;
        map[d][f].act = h;
        f++;
        g -= tileH;
        map[d][f].act == RUNNER_T && setRunnerDead()
    }(3 <= curAiVersion && c == ACT_FALL || c == ACT_DOWN) && 0 <= g && g < yMove &&
        dropGold(b);
    if (c == ACT_IN_HOLE)
        if (0 > g) c = ACT_FALL, 4 <= curAiVersion && 0 < a.hasGold && (map[d][f - 1].base == EMPTY_T ? addGold(d, f - 1) : decGold(), a.hasGold = 0, guardRemoveRedhat(a));
        else {
            0 < a.hasGold && (map[d][f - 1].base == EMPTY_T ? addGold(d, f - 1) : decGold());
            a.hasGold = 0;
            guardRemoveRedhat(a);
            k = "fallRight" == p ? "shakeRight" : "shakeLeft";
            themeSoundPlay("trap");
            shakeTimeStart = recordCount;
            if (3 > curAiVersion) a.sprite.on("animationend", function() {
                climbOut(b)
            });
            else add2GuardShakeQueue(b, k);
            playMode != PLAY_CLASSIC && playMode != PLAY_AUTO &&
                playMode != PLAY_DEMO || drawScore(SCORE_IN_HOLE)
        } c == ACT_DOWN ? k = "runUpDn" : c == ACT_FALL_BAR ? k = a.lastLeftRight == ACT_LEFT ? "barLeft" : "barRight" : c == ACT_FALL && "fallLeft" != p && "fallRight" != p && (k = a.lastLeftRight == ACT_LEFT ? "fallLeft" : "fallRight")
}
m == ACT_DOWN && (g += yMove, 0 < g && (g = 0));
if (c == ACT_LEFT) {
    e -= xMove;
    if (l && 0 > e) e = 0;
    else if (e < -W2) {
        if (h == BLOCK_T || h == HLADR_T) h = EMPTY_T;
        map[d][f].act = h;
        d--;
        e = tileW + e;
        map[d][f].act == RUNNER_T && setRunnerDead()
    }
    0 >= e && e > -xMove && dropGold(b);
    k = h == BAR_T ? "barLeft" : "runLeft"
}
n == ACT_LEFT && (e -=
    xMove, 0 > e && (e = 0));
if (c == ACT_RIGHT) {
    e += xMove;
    if (l && 0 < e) e = 0;
    else if (e > W2) {
        if (h == BLOCK_T || h == HLADR_T) h = EMPTY_T;
        map[d][f].act = h;
        d++;
        e -= tileW;
        map[d][f].act == RUNNER_T && setRunnerDead()
    }
    0 <= e && e < xMove && dropGold(b);
    k = h == BAR_T ? "barRight" : "runRight"
}
n == ACT_RIGHT && (e += xMove, 0 < e && (e = 0));
if (c == ACT_STOP) a.action != ACT_STOP && (a.sprite.stop(), a.action != ACT_CLIMB_OUT && (a.action = ACT_STOP));
else if (a.action == ACT_CLIMB_OUT && (c = ACT_CLIMB_OUT), a.sprite.x = (d * tileW + e) * tileScale | 0, a.sprite.y = (f * tileH + g) * tileScale | 0, a.pos = {
        x: d,
        y: f,
        xOffset: e,
        yOffset: g
    }, p != k && (a.sprite.gotoAndPlay(k), a.shape = k), c != a.action && a.sprite.play(), a.action = c, c == ACT_LEFT || c == ACT_RIGHT) a.lastLeftRight = c;
map[d][f].act = GUARD_T;
map[d][f].base == GOLD_T && 0 == a.hasGold && (!e && 0 <= g && g < H4 || !g && 0 <= e && e < W4 || f < maxTileY && map[d][f + 1].base == LADDR_T && g < H4) && (a.hasGold = 26 * Math.random() + 12 | 0, guardWearRedhat(a), playMode != PLAY_AUTO && playMode != PLAY_DEMO && playMode != PLAY_DEMO_ONCE || getDemoGold(a), recordMode && processRecordGold(a), removeGold(d, f))
}

function guardWearRedhat(b) {
redhatMode && (b.sprite.spriteSheet = redhatData)
}

function guardRemoveRedhat(b) {
redhatMode && (b.sprite.spriteSheet = guardData)
}

function dropGold(b) {
b = guard[b];
var c, a = 0;
switch (!0) {
    case 1 < b.hasGold:
        b.hasGold--;
        break;
    case 1 == b.hasGold:
        var d = b.pos.x,
            e = b.pos.y;
        map[d][e].base == EMPTY_T && (e >= maxTileY || (c = map[d][e + 1].base) == BLOCK_T || c == SOLID_T || c == LADDR_T) && (addGold(d, e), b.hasGold = -1, guardRemoveRedhat(b), a = 1);
        break;
    case 0 > b.hasGold:
        b.hasGold++
}
return a
}
var DEBUG_TIME = 0,
shakeRight = [8, 9, 10, 9, 10, 8],
shakeLeft = [30, 31, 32, 31, 32, 30],
shakeTime = [36, 3, 3, 3, 3, 3],
shakingGuardList = [];

function initStillFrameVariable() {
initGuardShakeVariable();
initFillHoleVariable();
initRebornVariable()
}

function initGuardShakeVariable() {
shakingGuardList = [];
shakeTime = 3 >= curAiVersion ? [36, 3, 3, 3, 3, 3] : [51, 3, 3, 3, 3, 3]
}

function add2GuardShakeQueue(b, c) {
var a = guard[b];
a.shapeFrame = "shakeRight" == c ? shakeRight : shakeLeft;
a.curFrameIdx = 0;
a.curFrameTime = -1;
shakingGuardList.push(b)
}

function processGuardShake() {
for (var b, c, a = 0; a < shakingGuardList.length;) {
    b = guard[shakingGuardList[a]];
    c = b.curFrameIdx;
    if (0 > b.curFrameTime) b.curFrameTime = 0, b.sprite.gotoAndStop(b.shapeFrame[c]);
    else if (++b.curFrameTime >= shakeTime[c])
        if (++b.curFrameIdx < b.shapeFrame.length) b.curFrameTime = 0, b.sprite.gotoAndStop(b.shapeFrame[b.curFrameIdx]);
        else {
            b = shakingGuardList[a];
            shakingGuardList.splice(a, 1);
            climbOut(b);
            continue
        } a++
}
}

function removeFromShake(b) {
for (var c = 0; c < shakingGuardList.length; c++)
    if (shakingGuardList[c] == b) {
        shakingGuardList.splice(c, 1);
        return
    } error("design error id =" + b + "(" + shakingGuardList + ")")
}

function climbOut(b) {
b = guard[b];
b.action = ACT_CLIMB_OUT;
b.sprite.removeAllEventListeners("animationend");
b.sprite.gotoAndPlay("runUpDn");
b.shape = "runUpDn";
b.holePos = {
    x: b.pos.x,
    y: b.pos.y
};
DEBUG_TIME && (loadingTxt.text = "ShakeTime = " + (recordCount - shakeTimeStart))
}

function bestMove(b) {
var c = guard[b],
    a = c.pos.x,
    d = c.pos.y,
    e = c.pos.yOffset,
    f = 0;
var g = map[a][d].base;
if (c.action == ACT_CLIMB_OUT) {
    if (c.pos.y == c.holePos.y) return ACT_UP;
    f = 1;
    c.pos.x != c.holePos.x && (c.action = ACT_LEFT)
}
if (!f && g != LADDR_T && (g != BAR_T || 0 !== e) && (0 > e || d < maxTileY && (e = map[a][d + 1].act, e == EMPTY_T || e == RUNNER_T || e != BLOCK_T && e != SOLID_T && e != GUARD_T && e != LADDR_T))) return ACT_FALL;
f = runner.pos.x;
if (d == runner.pos.y && runner.action != ACT_FALL) {
    for (; a != f;)
        if (e = d < maxTileY ? map[a][d + 1].base : SOLID_T, g = map[a][d].base,
            g == LADDR_T || g == BAR_T || e == SOLID_T || e == LADDR_T || e == BLOCK_T || map[a][d + 1].act == GUARD_T || e == BAR_T || e == GOLD_T) a < f ? ++a : a > f && --a;
        else break;
    if (a == f) return b = c.pos.x < f ? ACT_RIGHT : c.pos.x > f ? ACT_LEFT : c.pos.xOffset < runner.pos.xOffset ? ACT_RIGHT : ACT_LEFT
}
return scanFloor(b)
}
var bestPath, bestRating, curRating, leftEnd, rightEnd, startX, startY;

function scanFloor(b) {
var c;
var a = startX = guard[b].pos.x;
b = startY = guard[b].pos.y;
curRating = bestRating = 255;
for (bestPath = ACT_STOP; 0 < a;) {
    var d = map[a - 1][b].act;
    if (d == BLOCK_T || d == SOLID_T) break;
    if (d == LADDR_T || d == BAR_T || b >= maxTileY || b < maxTileY && ((c = map[a - 1][b + 1].base) == BLOCK_T || c == SOLID_T || c == LADDR_T)) --a;
    else {
        --a;
        break
    }
}
leftEnd = a;
for (a = startX; a < maxTileX;) {
    d = map[a + 1][b].act;
    if (d == BLOCK_T || d == SOLID_T) break;
    if (d == LADDR_T || d == BAR_T || b >= maxTileY || b < maxTileY && ((c = map[a + 1][b + 1].base) == BLOCK_T || c == SOLID_T || c == LADDR_T)) ++a;
    else {
        ++a;
        break
    }
}
rightEnd = a;
a = startX;
b < maxTileY && (c = map[a][b + 1].base) != BLOCK_T && c != SOLID_T && scanDown(a, ACT_DOWN);
map[a][b].base == LADDR_T && scanUp(a, ACT_UP);
d = ACT_LEFT;
for (a = leftEnd;;) {
    if (a == startX)
        if (d == ACT_LEFT && rightEnd != startX) d = ACT_RIGHT, a = rightEnd;
        else break;
    b < maxTileY && (c = map[a][b + 1].base) != BLOCK_T && c != SOLID_T && scanDown(a, d);
    map[a][b].base == LADDR_T && scanUp(a, d);
    d == ACT_LEFT ? a++ : a--
}
return bestPath
}

function scanDown(b, c) {
var a, d, e = runner.pos.y;
for (a = startY; a < maxTileY && (d = map[b][a + 1].base) != BLOCK_T && d != SOLID_T;) {
    if (map[b][a].base != EMPTY_T && map[b][a].base != HLADR_T) {
        if (0 < b && ((d = map[b - 1][a + 1].base) == BLOCK_T || d == LADDR_T || d == SOLID_T || map[b - 1][a].base == BAR_T) && a >= e) break;
        if (b < maxTileX && ((d = map[b + 1][a + 1].base) == BLOCK_T || d == LADDR_T || d == SOLID_T || map[b + 1][a].base == BAR_T) && a >= e) break
    }++a
}
curRating = a == e ? Math.abs(startX - b) : a > e ? a - e + 200 : e - a + 100;
curRating < bestRating && (bestRating = curRating, bestPath = c)
}

function scanUp(b, c) {
var a, d, e = runner.pos.y;
for (a = startY; 0 < a && map[b][a].base == LADDR_T;) {
    --a;
    if (0 < b && ((d = map[b - 1][a + 1].base) == BLOCK_T || d == SOLID_T || d == LADDR_T || map[b - 1][a].base == BAR_T) && a <= e) break;
    if (b < maxTileX && ((d = map[b + 1][a + 1].base) == BLOCK_T || d == SOLID_T || d == LADDR_T || map[b + 1][a].base == BAR_T) && a <= e) break
}
curRating = a == e ? Math.abs(startX - b) : a > e ? a - e + 200 : e - a + 100;
curRating < bestRating && (bestRating = curRating, bestPath = c)
}
var bornRndX;

function initRnd() {
bornRndX = new rangeRandom(0, maxTileX, 0)
}

function getGuardId(b, c) {
var a;
for (a = 0; a < guardCount && (guard[a].pos.x != b || guard[a].pos.y != c); a++);
assert(a < guardCount, "Error: can not get guard position!");
return a
}

function guardReborn(b, c) {
var a = getGuardId(b, c);
c = 1;
for (var d = b = bornRndX.get(); map[b][c].act != EMPTY_T || map[b][c].base == GOLD_T || map[b][c].base == BLOCK_T;)(b = bornRndX.get()) == d && c++, assert(c <= maxTileY, "Error: Born Y too large !");
if (playMode == PLAY_AUTO || playMode == PLAY_DEMO || playMode == PLAY_DEMO_ONCE) c = getDemoBornPos(), b = c.x, c = c.y;
recordMode == RECORD_KEY ? saveRecordBornPos(b, c) : recordMode == RECORD_PLAY && (c = getRecordBornPos(), b = c.x, c = c.y);
map[b][c].act = GUARD_T;
d = guard[a];
d.pos = {
    x: b,
    y: c,
    xOffset: 0,
    yOffset: 0
};
d.sprite.x = b * tileWScale | 0;
d.sprite.y = c * tileHScale | 0;
rebornTimeStart = recordCount;
3 > curAiVersion ? (d.sprite.on("animationend", function() {
    rebornComplete(a)
}), d.sprite.gotoAndPlay("reborn")) : add2RebornQueue(a);
d.shape = "reborn";
d.action = ACT_REBORN
}

function rebornComplete(b) {
var c = guard[b].pos.x,
    a = guard[b].pos.y;
map[c][a].act == RUNNER_T && setRunnerDead();
map[c][a].act = GUARD_T;
guard[b].sprite.removeAllEventListeners("animationend");
guard[b].action = ACT_FALL;
guard[b].shape = "fallRight";
guard[b].sprite.gotoAndPlay("fallRight");
themeSoundPlay("reborn");
DEBUG_TIME && (loadingTxt.text = "rebornTime = " + (recordCount - rebornTimeStart))
}

function setRunnerDead() {
godMode || (gameState = GAME_RUNNER_DEAD)
}
var rebornFrame = [28, 29],
rebornTime = [6, 2],
rebornGuardList = [];

function initRebornVariable() {
rebornGuardList = []
}

function add2RebornQueue(b) {
var c = guard[b];
c.sprite.gotoAndStop("reborn");
c.curFrameIdx = 0;
c.curFrameTime = -1;
rebornGuardList.push(b)
}

function processReborn() {
for (var b, c, a = 0; a < rebornGuardList.length;) {
    b = guard[rebornGuardList[a]];
    c = b.curFrameIdx;
    if (++b.curFrameTime >= rebornTime[c])
        if (++b.curFrameIdx < rebornFrame.length) b.curFrameTime = 0, b.sprite.gotoAndStop(rebornFrame[b.curFrameIdx]);
        else {
            b = rebornGuardList[a];
            rebornGuardList.splice(a, 1);
            rebornComplete(b);
            continue
        } a++
}
};