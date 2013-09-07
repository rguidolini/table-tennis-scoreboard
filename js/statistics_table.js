function StatsTable() {
  this.initializeSet = function() {
    var getPlayerStatObj = function() {
      return  {
        scr: 0,
        ace: 0,
        win: 0,
        nfe: 0,
        edg: 0,
      };
    }

    return {
      1: getPlayerStatObj(),
      2: getPlayerStatObj(),
      duration: 0,
    };
  }

  this.setStartTime = 0;
  this.setIdx = 0;
  this.sets = [ this.initializeSet() ];
  this.history = [];
}

StatsTable.prototype.startSet = function() {
  this.setStartTime = new Date();
  this.sets[this.setIdx] = this.initializeSet();
}

StatsTable.prototype.endSet = function() {
  var endTime = new Date();
  this.sets[this.setIdx].duration = new Date(endTime - this.setStartTime);
  this.setIdx++;
}

StatsTable.prototype.incrementScore = function(player) {
  this.sets[this.setIdx][player].scr++;
  this.history.push([player, 'scr']);
}

StatsTable.prototype.incrementAce = function(player) {
  this.sets[this.setIdx][player].ace++;
  this.history[this.history.length - 1].push('ace');
}

StatsTable.prototype.incrementEdgeBall = function(player) {
  this.sets[this.setIdx][player].edg++;
  this.history[this.history.length - 1].push('edg');
}

StatsTable.prototype.incrementWinner = function(player) {
  this.sets[this.setIdx][player].win++;
  this.history[this.history.length - 1].push('win');
}

StatsTable.prototype.incrementUnforcedError = function(player) {
  this.sets[this.setIdx][player].nfe++;
  this.history[this.history.length - 1].push('nfe');
}

StatsTable.prototype.undo = function(player) {
  if (this.history.length == 0) {
    return;
  }
  var lastStats = this.history.pop();
  for (var i = 1; i < lastStats.length; i++) {
    if (lastStats[i] == 'nfe') {
      var player = lastStats[0] % 2 + 1;
    } else {
      var player = lastStats[0];
    }
    this.sets[this.setIdx][player][lastStats[i]]--;

  }
}

StatsTable.prototype.displayTable = function(
    element, matchDuration, player1Name, player2Name) {
  var highlight = true;

  var getPlayerStatistics = function(playerId, playerName, setsObj) {
    var sublines = ['scr', 'ace', 'win', 'nfe', 'edg'];
    var labels = {
       scr: 'Score',
       ace: 'Aces',
       win: 'Winners',
       nfe: 'Unf. Errors',
       edg: 'Edge Balls',
    };

    var playerLine = '';
    for (var j = 0; j < sublines.length; j++) {
      playerLine += '<tr';
      if (highlight) {
        highlight = false;
      } else {
        playerLine += ' class="highlight"';
        highlight = true;
      }
      if (j == 0) {
        playerLine += ' style="font-weight: bold"';
      }
      playerLine += '>';

      if (j == 0) {
        playerLine +=
          '<td rowspan=' + sublines.length + '>'
          + playerName.toUpperCase() + '</td>';
      }
      playerLine += '<td>'+ labels[sublines[j]] + '</td>';
      var total = 0;
      for (var i = 0; i < setsObj.length; i++) {
        var value = setsObj[i][playerId][sublines[j]];
        total += value;
        playerLine += '<td>' + value + '</td>';
      }
      playerLine += '<td>' + total + '</td></tr>';
     }
    return playerLine;
  }

  var titlesLine = '<tr><th>Player</th><th></th><th>Set 1</th><th>Set 2</th>';
  if (this.sets.length == 3)
    titlesLine = titlesLine + '<th>Set 3</th>';
  titlesLine = titlesLine + '<th>Total</th></tr>';

  var duration = '';
  for (var i = 0; i < this.sets.length; i++) {
    duration += '<td>' + formatTime(this.sets[i].duration) + '</td>';
  }
  duration = '<tr style="text-align: center;"><td colspan="2">Duration</td>' +
    duration + '<td>' + matchDuration + '</td>' + '</tr>';

  var player1Stats = getPlayerStatistics(1, player1Name, this.sets);
  var player2Stats = getPlayerStatistics(2, player2Name, this.sets);

  element.innerHTML =
    '<div class="stat-title">game over</div>' +
    '<table border="1" align="center">' +
    titlesLine +
    player1Stats +
    player2Stats +
    duration + '</table>';
}
