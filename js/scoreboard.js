var LINE_1 = 338;
var LINE_2 = 354;
var X_BALL = 18;
var X_NAME = 23;
var X_SET = 142;
var X_SCORE = 164;
var FONT_SIZE = 13;
var SUMMARY_COL_1 = 164;
var SUMMARY_COL_2 = 186;
var SUMMARY_COL_3 = 209;

function Scoreboard() {
  this.setLength = 11;
  this.matchLength = 2;
  this.overlays = {};
  this.summary_overlays = [];
  this.drawBackground(
      'https://table-tennis-scoreboard.googlecode.com/git/images/scoreboard.png',
      -0.36, // x pos
      0.44, // y pos
      0.26, // scale
      'w', // scale reference dimension
      'bkg');
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

  this.hideSummary();
  this.summary_overlays = [];
  this.setOverlayVisible('ball-1', false);
  this.setOverlayVisible('ball-2', false);
  this.setScore('1', 0);
  this.setScore('2', 0);
  this.setSet('1', 0);
  this.setSet('2', 0);
  this.setPlayerName('1', 'PLAYER 1');
  this.setPlayerName('2', 'PLAYER 2');
}

Scoreboard.prototype.updateSetLength = function(length) {
  this.setLength = parseInt(length, 10);
}

// Sets the maximum number of sets in the match (best of 'length').
// For example, whe 'length' is 5, the player who wins 3 sets first wins the
// match.
Scoreboard.prototype.updateMatchLength = function(length) {
  this.matchLength = parseInt(parseInt(length, 10) / 2, 10) + 1;
}

Scoreboard.prototype.display = function(visible) {
  for (var i in this.overlays) {
    if (visible) {
      if (this.overlays[i]['vis']) {
        this.overlays[i]['ovl'].setVisible(visible);
      }
    } else {
      this.overlays[i]['ovl'].setVisible(visible);
    }
  }
}

Scoreboard.prototype.drawBackground =
    function(imageUri, xPos, yPos, scale, scaleReference, overlayId) {
  var img = gapi.hangout.av.effects.createImageResource(imageUri);
  var overlay = img.createOverlay();
  overlay.setPosition(xPos, yPos);
  if (scaleReference == 'w') {
    overlay.setScale(scale, gapi.hangout.av.effects.ScaleReference.WIDTH);
  } else {
    overlay.setScale(scale, gapi.hangout.av.effects.ScaleReference.HEIGHT);
  }
  overlay.setVisible(true);
  this.overlays[overlayId] = {
    'img' : img,
    'ovl' : overlay,
    'vis' : true, // set the overlay as visible
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
    'vis' : false, // set the overlay as hidden 
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
  this.overlays[overlayId]['vis'] = true; // set the overlay as visible
}

Scoreboard.prototype.setOverlayVisible = function(overlayId, visible) {
  if (this.overlays && this.overlays[overlayId]) {
    this.overlays[overlayId]['ovl'].setVisible(visible);
    this.overlays[overlayId]['vis'] = visible;
  }
}

Scoreboard.prototype.createTextOverlay =
    function(text, fontSize, color, bold, shadow, align, xPos, yPos) {
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

  context.font = ((bold) ? 'bold ' : '') + fontSize + 'px Arial';
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
                           true, // bold
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
  this.setOverlayVisible('ball-1', false);
  this.setOverlayVisible('ball-2', false);
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
    this.setOverlayVisible('point-1', false);
    this.setOverlayVisible('point-2', false);
  } else {
    this.setOverlayVisible('point-1', true);
    this.setOverlayVisible('point-2', true);
  }
}

Scoreboard.prototype.drawScore = function(player, score) {
  var yPos = (player == 1) ? LINE_1: LINE_2;
  var img = gapi.hangout.av.effects.createImageResource(
    this.createTextOverlay(score,
                           FONT_SIZE,
                           'white',
                           true, // bold
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
  if ((this.scoreCounting['1'] >= this.setLength ||
       this.scoreCounting['2'] >= this.setLength) &&
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
                             true, // bold
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

Scoreboard.prototype.toggleBall = function(player) {
  this.serving[player] = !(this.serving[player]);
  this.setOverlayVisible('ball-' + player, this.serving[player]);
}

Scoreboard.prototype.toggleService = function() {
  if ((this.scoreCounting['1'] + this.scoreCounting['2']) >=
      2 * this.setLength-2 ||
      (this.serviceCounter % 2) == 0) {
    this.toggleBall('1');
    this.toggleBall('2');
  }
}

Scoreboard.prototype.setFinished = function() {
  return (this.serviceCounter == 0);
}

Scoreboard.prototype.matchFinished = function() {
  if (this.setCounting['1'] >= this.matchLength) {
    return 1;
  }
  if (this.setCounting['2'] >= this.matchLength) {
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
  this.setOverlayVisible('ball-1', this.serving['1']);
  this.setOverlayVisible('ball-2', this.serving['2']);
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

Scoreboard.prototype.drawSummaryTitles = function(text, column, overlayId) {
  var img = gapi.hangout.av.effects.createImageResource(
    this.createTextOverlay(text,
                           11, // font size
                           'white',
                           false, // bold
                           false, // shadow
                           'right',
                           column - 1, // x position
                           321)); // y position
  this.redrawOverlay('summary-' + overlayId, img);
  this.summary_overlays.push('summary-' + overlayId);
}

Scoreboard.prototype.drawSummaryText = function(text, line, column, overlayId) {
  var img = gapi.hangout.av.effects.createImageResource(
    this.createTextOverlay(text,
                           FONT_SIZE,
                           'white',
                           true, // bold
                           true, // shadow
                           'right',
                           column,
                           line));
  this.redrawOverlay(overlayId, img);
  this.summary_overlays.push(overlayId);
}

Scoreboard.prototype.displaySummary = function() {
  if (this.overlays['sum-bkg']) {
    this.setOverlayVisible('sum-bkg', true);
    this.summary_overlays.push('sum-bkg');
  } else {
    this.drawBackground(
        'https://table-tennis-scoreboard.googlecode.com/git/images/scoreboard_summary.png',
        -0.22, // x pos
        0.420, // y pos
        0.115, // scale
        'sum-bkg');
    this.summary_overlays.push('sum-bkg');
  }
  var columns = {0 : SUMMARY_COL_1,
                 1 : SUMMARY_COL_2,
                 2 : SUMMARY_COL_3};
  for (var i = 0; i < 3; i++) {
    this.drawSummaryTitles('#' + (i+1), columns[i], '#' + i);
  }
  for (var set = 0; set < this.gameHistory.length; set++) {
    var score1 = this.gameHistory[set].scoreCounting['1'];
    var score2 = this.gameHistory[set].scoreCounting['2'];
    this.drawSummaryText(score1, LINE_1, columns[set], 'sum-p1-s' + (set+1));
    this.drawSummaryText(score2, LINE_2, columns[set], 'sum-p2-s' + (set+1));
  }
}

Scoreboard.prototype.hideSummary = function() {
  for (var i = 0; i < this.summary_overlays.length; i++) {
    this.setOverlayVisible(this.summary_overlays[i], false);
  }
}

//-------------------------------------------------------------

Scoreboard.prototype.drawSummaryBackground =
    function(imageFile, overlayId, xPos) {
  this.drawBackground(
      'http://table-tennis-scoreboard.googlecode.com/git/images/' + imageFile,
      xPos,
      0.42, // y pos
      0.1374, // scale
      'h', // scale reference HEIGHT
      'summary-' + overlayId);
}

Scoreboard.prototype.showSummary = function() {
  this.drawSummaryBackground('summary1.png', 'left-bkg', -275 /* x pos */);

  var xPos = -0.255;
  var columns = {0 : SUMMARY_COL_1,
                 1 : SUMMARY_COL_2,
                 2 : SUMMARY_COL_3};
  for (var set = 0; set < this.gameHistory.length; set++) {
    this.drawSummaryBackground('summary2.png', 'set-bkg-' + set, xPos);
    xPos += 34; // This value has been determined empirically.

    this.drawSummaryTitles('#' + (set + 1), columns[set], '#' + set);

    var score1 = this.gameHistory[set].scoreCounting['1'];
    var score2 = this.gameHistory[set].scoreCounting['2'];
    this.drawSummaryText(score1, LINE_1, columns[set], 'p1-scr' + set);
    this.drawSummaryText(score2, LINE_2, columns[set], 'p2-scr' + set);
  }

  this.drawSummaryBackground('summary3.png', 'right-bkg', xPos - 20);
}
