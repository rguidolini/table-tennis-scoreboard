var CHRON_TXT_X_POS = 601;
var CHRON_TXT_Y_POS = 347;

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

function Chronometer() {
  this.overlays = {
    'bkg' : {},
    'time' : {},
  };
  this.start_t = null;
  this.timerID = null;
  this.visible = true;

  this.drawBackground();
  this.drawTime('00:00');
}

Chronometer.prototype.display = function(visible) {
  this.visible = visible;
  for (var i in this.overlays) {
    this.overlays[i]['ovl'].setVisible(visible);
  }
  if (this.visible && this.isWorking()) {
    this.update();
  }
}

Chronometer.prototype.drawBackground = function() {
  var img = gapi.hangout.av.effects.createImageResource(
      'https://table-tennis-scoreboard.googlecode.com/git/images/watch.png');
  var overlay = img.createOverlay();
  overlay.setPosition(0.44, 0.44);
  overlay.setScale(0.08, gapi.hangout.av.effects.ScaleReference.WIDTH);
  overlay.setVisible(true);
  this.overlays['bkg'] = {
    'img' : img,
    'ovl' : overlay,
  };
}

Chronometer.prototype.redrawOverlay = function(overlayId, overlayImg) {
  var newOverlay = overlayImg.createOverlay();
  newOverlay.setVisible(true);
  if (this.overlays[overlayId]['ovl']) {
    this.overlays[overlayId]['ovl'].setVisible(false);
    this.overlays[overlayId]['ovl'].dispose();
    this.overlays[overlayId]['img'].dispose();
  }
  this.overlays[overlayId]['ovl'] = newOverlay;
  this.overlays[overlayId]['img'] = overlayImg;
}

Chronometer.prototype.createTextOverlay =
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

Chronometer.prototype.drawTime = function(time) {
  var img = gapi.hangout.av.effects.createImageResource(
    this.createTextOverlay(
      time, 15, 'white', 'center', CHRON_TXT_X_POS, CHRON_TXT_Y_POS));
  this.redrawOverlay('time', img);
}

Chronometer.prototype.update = function() {
  if (!this.visible) {
    return;
  }
  var end = new Date();
  var diff = new Date(end - this.start_t);
  this.drawTime(formatTime(diff));
}

Chronometer.prototype.start = function() {
  var thisObject = this;
  // If it has been stopped but not reseted, resume as if it had never stopped.
  if (!this.start_t) {
    this.start_t = new Date();
  }
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
