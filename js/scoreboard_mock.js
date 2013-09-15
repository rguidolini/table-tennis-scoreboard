/*
 * Same as scoreboard.js, but without gapi rendering method calls.
 * To be used in index.html for local tests.
 *
 * this class does not have the goal of being faithful to the look of the
 * original class. Only the logic has to be identical.
 */

Scoreboard = Scoreboard || {};

Scoreboard.prototype.display = function(visible) {
  // Mocked.
}

Scoreboard.prototype.drawBackground = function() {
  // Mocked.
}

Scoreboard.prototype.createBall = function(player) {
  // Mocked.
}

Scoreboard.prototype.redrawOverlay = function(overlayId, overlayImg) {
  // Mocked.
}

Scoreboard.prototype.setPlayerName = function(player, name) {
  // Mocked.
}

Scoreboard.prototype.drawScore = function(player, score) {
  this.scoreCounting[player] = score;
  var element = getElement('point-' + player);
  element.textContent = score;
  this.hideScoresIn0x0();
}

Scoreboard.prototype.setScore = function(player, score) {
  this.scoreCounting[player] = score;
  this.drawScore(player, score);
}

Scoreboard.prototype.setSet = function(player, value) {
  getElement('set-' + player).textContent = value;
}

Scoreboard.prototype.setBallVisible = function(player, visible) {
  var element = getElement('ball-' + player);
  if (visible) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

Scoreboard.prototype.setScoreVisible = function(player, visible) {
  var element = getElement('point-' + player);
  if (visible) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}
