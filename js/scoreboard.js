var SET_LENGHT = 11;
var MATCH_LENGHT = 2;
var LINE_1 = 338;
var LINE_2 = 354;
var X_BALL = 3;
var X_NAME = 24;
var X_SET = 142;
var X_SCORE = 164;

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
  this.scoreHistory = [];
  this.serving = {1: false, 2: false};

  this.overlays['ball-1']['ovl'].setVisible(false);
  this.overlays['ball-2']['ovl'].setVisible(false);
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
    this.overlays['ball-1']['ovl'].setVisible(this.serving['1']);
    this.overlays['ball-2']['ovl'].setVisible(this.serving['2']);
  }
}

Scoreboard.prototype.drawBackground = function() {
  var img = gapi.hangout.av.effects.createImageResource(
      'https://table-tennis-scoreboard.googlecode.com/git/images/scoreboard2.png');
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
  ctx.arc(17, (player == 1)? 331: 346, X_BALL, 0, 2*Math.PI);
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
    function(text, fontSize, color, align, xPos, yPos) {
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', CANVAS_WIDTH);
  canvas.setAttribute('height', CANVAS_HEIGHT);
  
  var context = canvas.getContext('2d');
  context.shadowColor = 'black';
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  context.shadowBlur = 2;

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
    this.createTextOverlay(
      name.toUpperCase(), 13, 'white', 'left', X_NAME, yPos));
  this.redrawOverlay('name-' + player, img);
}

Scoreboard.prototype.setFirstServer = function(player) {
  if (this.firstServer) {
    return;
  }
  this.firstServer = player;
  this.toggleBall(player);
}

Scoreboard.prototype.drawScore = function(player, score) {
  var yPos = (player == 1) ? LINE_1: LINE_2; 
  var img = gapi.hangout.av.effects.createImageResource(
    this.createTextOverlay(score, 13, 'white', 'right', X_SCORE, yPos));
  this.redrawOverlay('point-' + player, img);
}

Scoreboard.prototype.setScore = function(player, score) {
  this.scoreCounting[player] = score;
  this.drawScore(player, score);
  this.overlays['point-' + player]['ovl'].setVisible(false);
}

Scoreboard.prototype.incrementScore = function(player) {
  this.scoreCounting[player]++;
  this.scoreHistory.push(player);
  this.drawScore(player, this.scoreCounting[player]);
  this.overlays['point-1']['ovl'].setVisible(true);
  this.overlays['point-2']['ovl'].setVisible(true);
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
      this.createTextOverlay(value, 13, 'black', 'right', X_SET, yPos));
  this.redrawOverlay('set-' + player, img);
}

Scoreboard.prototype.incrementSet = function(player) {
  if (!this.shouldIncrementSet()) {
    return;
  }
  this.setCounting[player]++;
  this.serviceCounter = 0;
  this.scoreHistory = [];

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

Scoreboard.prototype.resetFirstServer = function() {
  this.overlays['ball-1']['ovl'].setVisible(false);
  this.overlays['ball-2']['ovl'].setVisible(false);
  if (this.matchFinished()) {
    return;
  }
  this.serving['1'] = false;
  this.serving['2'] = false;
  this.firstServer = this.firstServer % 2 + 1;
  this.toggleBall(this.firstServer);
}

Scoreboard.prototype.toggleBall = function(player) {
  this.serving[player] = !(this.serving[player]);
  this.overlays['ball-' + player]['ovl'].setVisible(this.serving[player]);
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
  if (this.scoreHistory.length == 0) {
    return 0;
  }
  return this.scoreHistory[this.scoreHistory.length - 1];
}

Scoreboard.prototype.undo = function() {
  var lastPlayerToScore = this.scoreHistory.pop();
  if (!lastPlayerToScore) {
    return;
  }
  this.scoreCounting[lastPlayerToScore]--;
  this.drawScore(lastPlayerToScore, this.scoreCounting[lastPlayerToScore]);
  this.toggleService();
  this.serviceCounter--;
}
