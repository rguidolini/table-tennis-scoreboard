function Chronometer() {
  this.start_t = null;
  this.timerID = null;
  this.visible = true;

  this.drawTime('00:00');
}

Chronometer.prototype.setVisible = function(elementId, visible) {
  setVisible(this.constructor.name, elementId, visible);
}

Chronometer.prototype.setContent = function(elementId, content) {
  setContent(this.constructor.name, elementId, content);
}

Chronometer.prototype.listen = function() {
  var thisObject = this;
  window.addEventListener('storage', function(e) {
    if (updateView(thisObject.constructor.name, e.key, e.newValue)) {
      return;
    }
    console.log('ERROR: storage event unhandled: ' + e.key + '=' + e.newValue);
  });
}

Chronometer.prototype.display = function(visible) {
  this.setVisible('watch', visible);
}

Chronometer.prototype.drawTime = function(time) {
  this.setContent('watch', time);
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
