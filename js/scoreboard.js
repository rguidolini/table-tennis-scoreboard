function Scoreboard() {
  this.visibleKeyPrefix = 'Scoreboard.visible.';
  this.contentKeyPrefix = 'Scoreboard.content.';
  this.scoreKeyPrefix = 'Scoreboard.score.1';

  this.setLength = 11;
  this.matchLength = 2;
  this.reset();
}

// remover palavra overlay do nome das funcoes

Scoreboard.prototype.reset = function() {
  this.serviceCounter = 0;
  this.firstServer = 0;
  this.scoreCounting = {1: 0, 2: 0};
  this.setCounting = {1: 0, 2: 0};
  this.setHistory = [];
  this.gameHistory = [];
  this.serving = {1: false, 2: false};

  this.setOverlayVisible('ball-1', false);
  this.setOverlayVisible('ball-2', false);
  this.setScore('1', 0);
  this.setScore('2', 0);
  this.setOverlayContent('set-1', 0);
  this.setOverlayContent('set-2', 0);
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
  this.setOverlayVisible('scoreboard', visible);
}

Scoreboard.prototype.setOverlayVisible = function(overlayId, visible) {
  localStorage.setItem(this.visibleKeyPrefix + overlayId, visible);
  this.setOverlayVisibleView(overlayId, visible);
}

Scoreboard.prototype.setOverlayVisibleView = function(overlayId, visible) {
  var element = getElement(overlayId);
  if (visible) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

Scoreboard.prototype.setOverlayContent = function(overlayId, content) {
  localStorage.setItem(this.contentKeyPrefix + overlayId, content);
  this.setOverlayContentView(overlayId, content);
}

Scoreboard.prototype.setOverlayContentView = function(overlayId, content) {
  var element = getElement(overlayId);
  element.textContent = content;
}

Scoreboard.prototype.setPlayerName = function(player, name) {
  this.setOverlayContent('name-' + player, name);
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

Scoreboard.prototype.setScore = function(player, score) {
  this.scoreCounting[player] = score;
  localStorage.setItem(this.scoreKeyPrefix + player, score);
  this.setScoreView(player, score);
}

Scoreboard.prototype.setScoreView = function(player, score) {
  var element = getElement('point-' + player);
  element.textContent = score;
  this.hideScoresIn0x0();
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
  this.setScore(player, this.scoreCounting[player]);
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

Scoreboard.prototype.incrementSet = function(player) {
  if (!this.shouldIncrementSet()) {
    return;
  }
  this.storeSetInfo();
  this.setCounting[player]++;
  this.serviceCounter = 0;
  this.setOverlayContent('set-' + player, this.setCounting[player]);
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

// player is the string '1' or '2'.
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
  this.setOverlayContent('set-1', this.setCounting['1']);
  this.setOverlayContent('set-2', this.setCounting['2']);
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
  this.setScore(lastPlayerToScore, this.scoreCounting[lastPlayerToScore]);
  this.toggleService();
  this.serviceCounter--;
  return 'score';
}

Scoreboard.prototype.listen = function() {
  var thisObject = this;
  window.addEventListener('storage', function(e) {
    if (e.key.startsWith(thisObject.visibleKeyPrefix)) {
      var id = e.key.replace(thisObject.visibleKeyPrefix, '');
      thisObject.setOverlayVisibleView(id, e.newValue === 'true');
    } else if (e.key.startsWith(thisObject.contentKeyPrefix)) {
      var id = e.key.replace(thisObject.contentKeyPrefix, '');
      thisObject.setOverlayContentView(id, e.newValue);
    } else if (e.key.startsWith(thisObject.scoreKeyPrefix)) {
      var player = e.key.replace(thisObject.scoreKeyPrefix, '');
      thisObject.setScoreView(player, e.newValue);
    }
  });
}
