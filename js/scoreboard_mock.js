

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
