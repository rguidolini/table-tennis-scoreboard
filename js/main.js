var CONFIRM_KEY = 13;       // enter
var DISPLAY_VIDEO_KEY = 66; // B
var PLAYER1_KEY = 37;       // arrow
var PLAYER2_KEY = 39;       // arrow
var QUIT_KEY = 27;          // ESC
var UNDO_KEY = 40;          // UP
var UPDATE_KEY = 85;        // U

var ACE_KEY = 65;           // A
var EDGE_BALL_KEY = 69;     // E
var INVERT_SIDES_KEY = 73;  // I
var NON_FORCED_KEY = 78;    // N
var WINNER_KEY = 87;        // W

var appVisible = true;
var isGameOver = false;
var firstStroke = true;

var scoreboard = new Scoreboard();
//var statTable = new StatsTable();
var chrono = new Chronometer();
var gtvLogo = new GtvLogo();

function showError(msg) {
  var errorDiv = document.getElementById('error-msg');
  errorDiv.innerHTML = msg;
  errorDiv.classList.remove('hidden'); 
}

function hideError() {
  var errorDiv = document.getElementById('error-msg');
  errorDiv.classList.add('hidden'); 
}

function showWarning(msg) {
  var element = document.getElementById('error-msg');
  element.innerHTML = msg;
  element.classList.add('warning'); 
  element.classList.remove('hidden'); 
}

function hideWarning() {
  var element = document.getElementById('error-msg');
  element.classList.add('hidden'); 
  element.classList.remove('warning'); 
}

function getElement(elementId) {
  var element = document.getElementById(elementId);
  if (!element) {
    showError('Element with id "' + elementId + '" not found.');
  }
  return element;
}

function handleKeyStroke(e) {
  if (isGameOver || !appVisible) {
    return;
  }

  if (e.which == UPDATE_KEY) {
  } else if (e.which == CONFIRM_KEY) {
  } else if (e.which == QUIT_KEY) {
  } else if (e.which == PLAYER1_KEY) {
    scorePointForPlayer('1');
  } else if (e.which == PLAYER2_KEY) {
    scorePointForPlayer('2');
  } else if (e.which == ACE_KEY) {
    scoreAce();
  } else if (e.which == WINNER_KEY) {
    scoreWinner();
  } else if (e.which == EDGE_BALL_KEY) {
    scoreEdgeBall();
  } else if (e.which == NON_FORCED_KEY) {
    scoreUnforcedError();
  } else if (e.which == INVERT_SIDES_KEY) {
    invertSides();
  } else if (e.which == UNDO_KEY) {
    undo();
  }

  //console.log('key code: ');
  //console.log(e.which);
}

function toggleDisplayApp() {
  appVisible = !appVisible;
  scoreboard.display(appVisible);
  //statTable.display(appVisible);
  chrono.display(appVisible);
  gtvLogo.display(appVisible);
  getElement('hide-app').value = appVisible ? 'Hide App' : 'Show App';
  getElement('new-game').classList.toggle('hidden');
  getElement('app-interaction').classList.toggle('hidden');
}

function newMatch() {
  scoreboard.reset();
  //statTable.reset();
  chrono.reset();
  getElement('player1name').value = 'PLAYER1';
  getElement('player2name').value = 'PLAYER2';
  isGameOver = false;
  firstStroke = true;
}

function drawLogo() {
  var uri = getElement('loadable-uri').value;
  console.log('loading ' + uri);
  gtvLogo.draw(uri);
}

function zippy(controlElement, zippyElement) {
  getElement(zippyElement).classList.toggle('height-zero');
}

function bindEvents() {
  document.onkeydown = function(e) {handleKeyStroke(e);}
  getElement('update-names').onclick = function() { updateNames(); }
  getElement('hide-app').onclick = function() { toggleDisplayApp(); }
  getElement('new-game').onclick = function() { newMatch(); }
  getElement('score-player1').onclick = function() { scorePointForPlayer('1'); }
  getElement('score-player2').onclick = function() { scorePointForPlayer('2'); }
  getElement('undo').onclick = function() { undo(); }
  getElement('load-logo').onclick = function() { drawLogo(); }
  getElement('load-logo-control').onclick =
    function() { zippyElement('load-logo-control', 'load-logo-box'); }
}
bindEvents();

function scorePointForPlayer(player) {
  if (firstStroke) {
    chrono.start();
    //statTable.startSet();
    scoreboard.setFirstServer(player);
    firstStroke = false;
  } else {
    //statTable.incrementScore(player);
    scoreboard.incrementScore(player);
    finishSet();
  }
}

function finishSet() {
  if (!scoreboard.setFinished()) {
    return;
  }
  //statTable.endSet();
  if (scoreboard.matchFinished()) {
    gameOver();
  } else {
    //statTable.startSet();
  }
}

function undo() {
  scoreboard.undo();
  //statTable.undo();
}

function getAndValidateInputText(elementId, fieldName, minLen, maxLen) {
  var element = document.querySelector(elementId);
  if (element.value.length < minLen || element.value.length > maxLen) {
    showWarning( fieldName + ' must have between ' + minLen + ' and ' +
        maxLen + ' chars.');
    return;
  }
  return element.value;
}

function updateNames() {
  var name1 = getAndValidateInputText('#player1name', 'Player Name', 3, 10);
  var name2 = getAndValidateInputText('#player2name', 'Player Name', 3, 10);
  if (!name1 || !name2) {
    return;
  }
  hideWarning();
  name1 = name1.toUpperCase();
  name2 = name2.toUpperCase();
  scoreboard.setPlayerName(1, name1);
  scoreboard.setPlayerName(2, name2);
  getElement('score-player1').value = name1;
  getElement('score-player2').value = name2;
}

function gameOver() {
  isGameOver = true;
  chrono.stop();
  firstStroke = true;
  /*statTable.displayTable(
      getElement('stat-table'),
      chrono.getElapsedTime(),
      scoreboard.playerName('1'),
      scoreboard.playerName('2'));
  getElement('stat-table').classList.remove('hidden');*/
  //scoreboard.toggleDisplayHide();
  //getElement('watch').classList.add('hidden');
}

function scoreAce() {
  var player = scoreboard.playerServing();
  if (player) {
    scoreboard.incrementScore(player);
    //statTable.incrementScore(player);
    //statTable.incrementAce(player);
    finishSet();
  }
}

function scoreWinner() {
  var lastScorer = scoreboard.lastPlayerToScore();
  if (lastScorer != 0) {
    //statTable.incrementWinner(lastScorer);
  }
}

function scoreEdgeBall() {
  var lastScorer = scoreboard.lastPlayerToScore();
  if (lastScorer != 0) {
    //statTable.incrementEdgeBall(lastScorer);
  }
}

function scoreUnforcedError() {
  var lastScorer = scoreboard.lastPlayerToScore();
  if (lastScorer != 0) {
    var failer = lastScorer % 2 + 1;
    //statTable.incrementUnforcedError(failer);
  }
}

function invertSides() {
  var tmp_key = PLAYER1_KEY;
  PLAYER1_KEY = PLAYER2_KEY;
  PLAYER2_KEY = tmp_key;
}
