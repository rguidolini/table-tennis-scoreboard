var CONFIRM_KEY = 13;       // enter
var DISPLAY_VIDEO_KEY = 66; // B
var PLAYER1_KEY = 37;       // left arrow
var PLAYER2_KEY = 39;       // right arrow
var QUIT_KEY = 27;          // ESC
var UNDO_KEY = 40;          // down arrow
var UPDATE_KEY = 85;        // U

var ACE_KEY = 65;           // A
var EDGE_BALL_KEY = 69;     // E
var INVERT_SIDES_KEY = 38;  // up arrow
var NON_FORCED_KEY = 78;    // N
var WINNER_KEY = 87;        // W

var appVisible = true;
var isGameOver = false;
var firstStroke = true;
var arePostionsinverted = false;

var scoreboard = new Scoreboard();
//var statTable = new StatsTable();
var chrono = new Chronometer();
var commentBox = new CommentBox();
var gtvLogo = new GtvLogo();

function showError(msg) {
  var errorDiv = document.getElementById('error-msg');
  errorDiv.textContent = msg;
  errorDiv.classList.remove('hidden');
  errorDiv.classList.remove('warning');
}

function hideError() {
  var errorDiv = document.getElementById('error-msg');
  errorDiv.classList.add('hidden');
}

function showWarning(msg) {
  var element = document.getElementById('error-msg');
  element.textContent = msg;
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

function getElementBySelector(selector) {
  var elements = document.querySelectorAll(selector)
  if (!elements) {
    showError('Elements with CSS id "' + selector + '" not found.');
  }
  return elements;
}

function handleKeyStroke(e) {
  if ((isGameOver && e.which != UNDO_KEY) || !appVisible) {
    return;
  }

  // Ignore command keys when interacting with input elements.
  if (e.target) {
    var tag = e.target.tagName.toLowerCase();
    var type = (e.target.type) ? e.target.type.toLowerCase() : '';
    if ((tag == 'input' && type == 'text') || tag == 'textarea' || tag == 'select') {
      return;
    }
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
  updateNames();
  getElement('controls-cover').style.zIndex = -1;
  isGameOver = false;
  firstStroke = true;
  if (arePostionsinverted) {
    invertSides();
  }
}

function drawLogo() {
  var uri = getElement('loadable-uri').value;
  console.log('loading ' + uri);
  gtvLogo.draw(uri);
}

function updateSetLength() {
  scoreboard.updateSetLength(getElement('set-length').value);
}

function updateGameLength() {
  scoreboard.updateMatchLength(getElement('game-length').value);
}

function scorePointForPlayer(player) {
  if (isGameOver) {
    return;
  }

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
    if (getElement('auto-invert').checked) {
      invertSides();
    }
    //statTable.startSet();
  }
}

function undo() {
  var undone = scoreboard.undo();
  if (undone == 'server') {
    chrono.reset();
    firstStroke = true;
  } else if (undone == 'set' && !isGameOver) {
    invertSides();
  }
  if (isGameOver) {
    isGameOver = false;
    scoreboard.hideSummary();
    chrono.start();
    getElement('controls-cover').style.zIndex = -1;
  }
  //statTable.undo();
}

function updateShortcutText(name1, name2) {
  if (arePostionsinverted) {
    getElement('p1name').textContent = name2;
    getElement('p2name').textContent = name1;
  } else {
    getElement('p1name').textContent = name1;
    getElement('p2name').textContent = name2;
  }
}

function updateNames() {
  var name1 = getElement('player1name').value;
  var name2 = getElement('player2name').value;
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
  updateShortcutText(name1, name2);
}

function updateComment() {
  var com = getElement('comment').value;
  scoreboard.setPlayerName(1, name1);
  scoreboard.setPlayerName(2, name2);
  getElement('score-player1').value = name1;
  getElement('score-player2').value = name2;
  updateShortcutText(name1, name2);
}

function gameOver() {
  isGameOver = true;
  scoreboard.showSummary();
  chrono.stop();
  getElement('controls-cover').style.zIndex = 1;
  hideWarning();
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
  arePostionsinverted = !arePostionsinverted;
  var tmp_key = PLAYER1_KEY;
  PLAYER1_KEY = PLAYER2_KEY;
  PLAYER2_KEY = tmp_key;

  var player1 = getElement('player1name');
  var player2 = getElement('player2name');
  var p1LeftCoordinate = player1.style.left;
  player1.style.left = player2.style.left;
  player2.style.left = p1LeftCoordinate ;

  var p1name = getElement('p1name');
  var p2name = getElement('p2name');
  var tmp_name = p1name.textContent;
  p1name.textContent = p2name.textContent;
  p2name.textContent = tmp_name; 
}

function toggleDisplaycommentBox() {
  if (commentBox.getVisible()) {
    getElement('show-comment').value = 'Show';
    commentBox.display(false);
    chrono.display(true);
  } else {
    commentBox.setComment(getElement('input-comment').value);
    commentBox.setNetzen(getElement('input-netzen').value);
    getElement('show-comment').value = 'Hide';
    commentBox.display(true);
    chrono.display(false);
  }
}

function updateCommentCounter() {
  var comment = getElement('input-comment');
  var counter = getElement('comment-box-counter');
  counter.textContent = commentBox.maxCommentLength() - comment.value.length;
}

function initCommentInputs() {
  var comment = getElement('input-comment');
  var counter = getElement('comment-box-counter');
  comment.maxLength = commentBox.maxCommentLength();
  counter.textContent = commentBox.maxCommentLength() - comment.value.length;
}

function bindEvents() {
  document.onkeydown = function(e) { handleKeyStroke(e); };
  getElement('hide-app').onclick = function() { toggleDisplayApp(); };
  getElement('new-game').onclick = function() { newMatch(); };
  getElement('update-names').onclick = function() { updateNames(); };
  getElement('score-player1').onclick = function() { scorePointForPlayer('1'); };
  getElement('score-player2').onclick = function() { scorePointForPlayer('2'); };
  getElement('undo').onclick = function() { undo(); };
  getElement('load-logo').onclick = function() { drawLogo(); };
  getElement('update-set').onclick = function() { updateSetLength(); };
  getElement('update-game').onclick = function() { updateGameLength(); };
  getElement('show-comment').onclick = function() { toggleDisplaycommentBox(); };
  getElement('input-comment').onkeyup = function() { updateCommentCounter(); };
}

function main() {
  bindEvents();
  initZipElements();
  initCommentInputs();
}
main();
