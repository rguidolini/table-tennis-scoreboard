/*
 * Same as gtvlogo.js, but without gapi rendering method calls.
 * To be used in index.html for local tests.
 */

function GtvLogo() {
  this.overlays = {};
}

GtvLogo.prototype.display = function(visible) {
  for (var i in this.overlays) {
    this.overlays[i]['ovl'].setVisible(visible);
  }
}

GtvLogo.prototype.createTextOverlay =
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

GtvLogo.prototype.drawLogo = function(uri) {
  // Mocked.
}

GtvLogo.prototype.drawLive = function() {
  // Mocked.
}

GtvLogo.prototype.draw = function(uri) {
  this.drawLogo(uri);
  this.drawLive();
}
