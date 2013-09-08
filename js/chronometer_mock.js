/*
 * Same as chronometer.js, but without gapi rendering method calls.
 * To be used in index.html for local tests.
 */

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
  this.start_t = 0;
  this.timerID = null;
  this.visible = true;

  this.drawBackground();
  this.drawTime('00:00');
}

Chronometer.prototype.display = function(visible) {
  // Mocked ;-)
}

Chronometer.prototype.drawBackground = function() {
  // Mocked ;-)
}

Chronometer.prototype.redrawOverlay = function(overlayId, overlayImg) {
  // Mocked ;-)
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
  // Mocked ;-)
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
  this.start_t = new Date();
  this.timerID = window.setInterval(function() {thisObject.update();}, 500);
}

Chronometer.prototype.stop = function() {
  clearInterval(this.timerID);
  this.start_t = 0;
  this.timerID = null;
}

Chronometer.prototype.reset = function() {
  this.stop();
  this.drawTime('00:00');
}

Chronometer.prototype.isWorking = function() {
  return (this.timerID != null);
}
