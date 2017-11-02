function Chronometer() {
  this.timeKey = 'Chronometer.time';
  this.visibleKey = 'Chronometer.visible';
  this.start_t = null;
  this.timerID = null;
  this.visible = true;

  this.drawTime('00:00');
}

Chronometer.prototype.display = function(visible) {
  localStorage.setItem(this.visibleKey, visible);
  this.displayView(visible);
}

Chronometer.prototype.displayView = function(visible) {
  if (visible) {
    getElement('watch').classList.remove('hidden')
  } else {
    getElement('watch').classList.add('hidden')
  }
}

Chronometer.prototype.drawTime = function(time) {
  localStorage.setItem(this.timeKey, time);
  this.drawTimeView(time);
}

Chronometer.prototype.drawTimeView = function(time) {
  getElement('watch').textContent = time;
}

function formatTime(time) {
  var sec = time.getSeconds();
  var min = time.getMinutes();
  if (min < 10) {
    min = '0' + min;
  }
  if (sec < 10) {
    sec = '0' + sec;
  }
  return min + ':' + sec;
}

Chronometer.prototype.update = function() {
  if (!this.visible) {
    return;
  }
  var end = new Date();
  var diff = new Date(end - this.start_t);
  var time = formatTime(diff);
  this.drawTime(time);
}

Chronometer.prototype.start = function() {
  // If it is already running, do nothing.
  if (this.timerID) {
    return;
  }

  // If it has been stopped but not reseted, resume as if it had never been
  // stopped.
  if (!this.start_t) {
    this.start_t = new Date();
  }
  var thisObject = this;
  this.timerID = window.setInterval(function() {thisObject.update();}, 500);
}

Chronometer.prototype.stop = function() {
  clearInterval(this.timerID);
  this.timerID = null;
}

Chronometer.prototype.reset = function() {
  if (this.timerID) {
    this.stop();
  }
  this.start_t = null;
  this.drawTime('00:00');
}

Chronometer.prototype.isWorking = function() {
  return (this.timerID != null);
}

Chronometer.prototype.listen = function() {
  var thisObject = this;
  window.addEventListener('storage', function(e) {  
    if (e.key == thisObject.timeKey) {
      thisObject.drawTimeView(e.newValue);
    } else if (e.key == thisObject.visibleKey) {
      var visible = true;
      thisObject.displayView(e.newValue === 'true')
    }
  });
}
