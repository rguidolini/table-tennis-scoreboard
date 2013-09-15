var SET_LENGHT = 11;
var MATCH_LENGHT = 2;
var LINE_1 = 338;
var LINE_2 = 354;
var X_BALL = 18;
var X_NAME = 23;
var X_SET = 142;
var X_SCORE = 164;
var FONT_SIZE = 13;

function Scoreboard() {
  this.overlays = {};
  this.drawBackground();
  this.createBall('1');
  this.createBall('2');
  this.reset();
}

Scoreboard.prototype.reset = function() {
  this.serviceCounter = 0;
  this.firstServer = 0;
  this.scoreCounting = {1: 0, 2: 0};
  this.setCounting = {1: 0, 2: 0};
  this.setHistory = [];
  this.gameHistory = [];
  this.serving = {1: false, 2: false};

  this.setBallVisible('1', false);
  this.setBallVisible('2', false);
  this.setScore('1', 0);
  this.setScore('2', 0);
  this.setSet('1', 0);
  this.setSet('2', 0);
  this.setPlayerName('1', 'PLAYER 1');
  this.setPlayerName('2', 'PLAYER 2');
}

Scoreboard.prototype.display = function(visible) {
  for (var i in this.overlays) {
    this.overlays[i]['ovl'].setVisible(visible);
  }
  if (visible) {
    this.setBallVisible('1', this.serving['1']);
    this.setBallVisible('2', this.serving['2']);
  }
  this.hideScoresIn0x0();
}

Scoreboard.prototype.drawBackground = function() {
  var img = gapi.hangout.av.effects.createImageResource(
      'https://table-tennis-scoreboard.googlecode.com/git/images/scoreboard.png');
  var overlay = img.createOverlay();
  overlay.setPosition(-0.36, 0.44);
  overlay.setScale( 0.26, gapi.hangout.av.effects.ScaleReference.WIDTH);
  overlay.setVisible(true);
  this.overlays['bkg'] = {
    'img' : img,
    'ovl' : overlay,
  };
}

Scoreboard.prototype.createBall = function(player) {
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', CANVAS_WIDTH);
  canvas.setAttribute('height', CANVAS_HEIGHT);
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(X_BALL, (player == 1)? 331: 346, 3, 0, 2*Math.PI);
  ctx.fill();
  var img = gapi.hangout.av.effects.createImageResource(canvas.toDataURL());
  this.overlays['ball-' + player] = {
    'img' : img,
    'ovl' : img.createOverlay(),
  }
}

Scoreboard.prototype.redrawOverlay = function(overlayId, overlayImg) {
  var newOverlay = overlayImg.createOverlay();
  newOverlay.setVisible(true);
  if (!this.overlays[overlayId]) {
    this.overlays[overlayId] = {}
  }
  if (this.overlays[overlayId]['ovl']) {
    this.overlays[overlayId]['ovl'].setVisible(false);
    this.overlays[overlayId]['ovl'].dispose();
    this.overlays[overlayId]['img'].dispose();
  }
  this.overlays[overlayId]['ovl'] = newOverlay;
  this.overlays[overlayId]['img'] = overlayImg;
}

Scoreboard.prototype.createTextOverlay =
    function(text, fontSize, color, shadow, align, xPos, yPos) {
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', CANVAS_WIDTH);
  canvas.setAttribute('height', CANVAS_HEIGHT);

  var context = canvas.getContext('2d');
  if (shadow) {
    context.shadowColor = 'black';
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.shadowBlur = 2;
  }

  context.font = 'bold ' + fontSize + 'px Arial';
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = 'bottom';
  context.fillText(text, xPos, yPos);

  return canvas.toDataURL();
}

Scoreboard.prototype.setPlayerName = function(player, name) {
  var yPos = (player == 1) ? LINE_1: LINE_2;
  var img = gapi.hangout.av.effects.createImageResource(
    this.createTextOverlay(name.toUpperCase(),
                           FONT_SIZE,
                           'white',
                           true, // shadow
                           'left',
                           X_NAME,
                           yPos));
  this.redrawOverlay('name-' + player, img);
}

Scoreboard.prototype.setFirstServer = function(player) {
  if (this.firstServer) {
    return;
  }
  this.firstServer = player;
  this.toggleBall(player);
}

Scoreboard.prototype.unsetFirstServer = function() {
  if (this.firstServer) {
    this.toggleBall(this.firstServer);
    this.firstServer = 0;
  }
}

Scoreboard.prototype.resetFirstServer = function() {
  this.setBallVisible('1', false);
  this.setBallVisible('2', false);
  if (this.matchFinished()) {
    return;
  }
  this.serving['1'] = false;
  this.serving['2'] = false;
  this.firstServer = this.firstServer % 2 + 1;
  this.toggleBall(this.firstServer);
}

Scoreboard.prototype.hideScoresIn0x0 = function() {
  if (this.scoreCounting['1'] == 0 && this.scoreCounting['2'] == 0) {
    this.setScoreVisible('1', false);
    this.setScoreVisible('2', false);
  } else {
    this.setScoreVisible('1', true);
    this.setScoreVisible('2', true);
  }
}

Scoreboard.prototype.drawScore = function(player, score) {
  var yPos = (player == 1) ? LINE_1: LINE_2;
  var img = gapi.hangout.av.effects.createImageResource(
    this.createTextOverlay(score,
                           FONT_SIZE,
                           'white',
                           true, // shadow
                           'right',
                           X_SCORE,
                           yPos));
  this.redrawOverlay('point-' + player, img);
  this.hideScoresIn0x0();
}

Scoreboard.prototype.setScore = function(player, score) {
  this.scoreCounting[player] = score;
  this.drawScore(player, score);
}

Scoreboard.prototype.storeSetInfo = function() {
  this.gameHistory.push(
      {
        firstServer :    this.firstServer,
        scoreCounting :  this.scoreCounting,
        setHistory :     this.setHistory,
        serviceCounter : this.serviceCounter,
        serving :        this.serving,
      });

  // Releasing Object references.
  this.scoreCounting = {1: 0, 2: 0};
  this.setHistory = [];
  this.serving = {1: false, 2: false};
}

Scoreboard.prototype.retrieveSetInfo = function() {
  if (this.gameHistory.length == 0) {
    return;
  }
  var set = this.gameHistory.pop();
  this.serviceCounter = set.serviceCounter;
  this.firstServer =    set.firstServer;   
  this.scoreCounting =  set.scoreCounting; 
  this.setCounting =    set.setCounting;  
  this.setHistory =     set.setHistory;    
  this.serving =        set.serving;       
}

Scoreboard.prototype.incrementScore = function(player) {
  this.scoreCounting[player]++;
  this.setHistory.push(player);
  this.drawScore(player, this.scoreCounting[player]);
  this.serviceCounter++;
  this.toggleService();
  this.incrementSet(player);
}

Scoreboard.prototype.shouldIncrementSet = function() {
  if ((this.scoreCounting['1'] >= SET_LENGHT ||
       this.scoreCounting['2'] >= SET_LENGHT) &&
      Math.abs(this.scoreCounting['1'] - this.scoreCounting['2']) > 1) {
    return true;
  }
  return false;
}

Scoreboard.prototype.setSet = function(player, value) {
  var yPos = (player == 1) ? LINE_1: LINE_2;
  var img = gapi.hangout.av.effects.createImageResource(
      this.createTextOverlay(value,
                             FONT_SIZE,
                             'black',
                             false, // shadow
                             'right',
                             X_SET,
                             yPos));
  this.redrawOverlay('set-' + player, img);
}

Scoreboard.prototype.incrementSet = function(player) {
  if (!this.shouldIncrementSet()) {
    return;
  }
  this.storeSetInfo();
  this.setCounting[player]++;
  this.serviceCounter = 0;
  this.setSet(player, this.setCounting[player]);
  this.setScore('1', 0);
  this.setScore('2', 0);
  this.resetFirstServer();
}

Scoreboard.prototype.playerServing = function() {
  if (this.serving['1']) {
    return 1;
  }
  if (this.serving['2']) {
    return 2;
  }
  return 0;
}

Scoreboard.prototype.setBallVisible = function(player, visible) {
  this.overlays['ball-' + player]['ovl'].setVisible(visible);
}

Scoreboard.prototype.setScoreVisible = function(player, visible) {
  if (this.overlays) {
    if (this.overlays['point-' + player]) {
      this.overlays['point-' + player]['ovl'].setVisible(visible);
    }
  }
}

Scoreboard.prototype.toggleBall = function(player) {
  this.serving[player] = !(this.serving[player]);
  this.setBallVisible(player, this.serving[player]);
}

Scoreboard.prototype.toggleService = function() {
  if ((this.scoreCounting['1'] + this.scoreCounting['2']) >= 2*SET_LENGHT-2 ||
      (this.serviceCounter % 2) == 0) {
    this.toggleBall('1');
    this.toggleBall('2');
  }
}

Scoreboard.prototype.setFinished = function() {
  return (this.serviceCounter == 0);
}

Scoreboard.prototype.matchFinished = function() {
  if (this.setCounting['1'] >= MATCH_LENGHT) {
    return 1;
  }
  if (this.setCounting['2'] >= MATCH_LENGHT) {
    return 2;
  }
  return 0;
}

Scoreboard.prototype.lastPlayerToScore = function() {
  if (this.setHistory.length == 0) {
    return 0;
  }
  return this.setHistory[this.setHistory.length - 1];
}

Scoreboard.prototype.reconstructPreviousSetData = function() {
  if (this.gameHistory.length == 0) {
    return;
  }
  var prevSet = this.gameHistory.pop();
  this.serviceCounter = prevSet.serviceCounter;
  this.firstServer = prevSet.firstServer;
  this.serving = prevSet.serving;
  this.setHistory = prevSet.setHistory;
  this.scoreCounting = prevSet.scoreCounting;

  // Deducting from the winner the last set and the last point won.
  this.toggleService();
  this.setHistory.pop();
  this.serviceCounter--;
  if (this.scoreCounting['1'] > this.scoreCounting['2']) { 
    this.setCounting['1']--;
    this.scoreCounting['1']--;
  } else {
    this.setCounting['2']--;
    this.scoreCounting['2']--;
  }

  // Refreshing the scoreboard
  this.setBallVisible('1', this.serving['1']);
  this.setBallVisible('2', this.serving['2']);
  this.setScore('1', this.scoreCounting['1']);
  this.setScore('2', this.scoreCounting['2']);
  this.setSet('1', this.setCounting['1']);
  this.setSet('2', this.setCounting['2']);
}

// return: what has been undone:
// - the first server setting
// - a score
// - a set
Scoreboard.prototype.undo = function() {
  var lastPlayerToScore = this.setHistory.pop();
  if (!lastPlayerToScore) {
    if (this.setCounting['1'] == 0 && this.setCounting['2'] == 0) {
      this.unsetFirstServer();
      return 'server';
    }
    this.reconstructPreviousSetData();
    return 'set';
  }
  this.scoreCounting[lastPlayerToScore]--;
  this.drawScore(lastPlayerToScore, this.scoreCounting[lastPlayerToScore]);
  this.toggleService();
  this.serviceCounter--;
  return 'score';
}
