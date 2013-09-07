function GtvLogo() {
  this.overlays = {};
}

GtvLogo.prototype.display = function(visible) {
  for (var i in this.overlays) {
    this.overlays[i]['ovl'].setVisible(visible);
  }
}

GtvLogo.prototype.redrawOverlay = function(overlayId, overlayImg) {
  var newOverlay = overlayImg.createOverlay();
  if (!this.overlays[overlayId]) {
    this.overlays[overlayId] = {}
  }
  if (this.overlays[overlayId]['ovl']) {
    this.overlays[overlayId]['ovl'].setVisible(false);
    this.overlays[overlayId]['ovl'].dispose();
    this.overlays[overlayId]['img'].dispose();
  }
  this.overlays[overlayId]['ovl'] = newOverlay;
  this.overlays[overlayId]['img'] = overlayImg;
  return newOverlay;
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
  var img = gapi.hangout.av.effects.createImageResource(uri);
  var overlay = this.redrawOverlay('logo', img);
  overlay.setPosition(0.42, -0.44);
  overlay.setScale(0.12, gapi.hangout.av.effects.ScaleReference.WIDTH);
  overlay.setVisible(true);
}

GtvLogo.prototype.drawLive = function() {
  var img = gapi.hangout.av.effects.createImageResource(
    this.createTextOverlay(
      'A O   V I V O', 10, 'white', 'center', 590, 45));
  var overlay = this.redrawOverlay('live', img);
  overlay.setVisible(true);
}

GtvLogo.prototype.draw = function(uri) {
  this.drawLogo(uri);
  this.drawLive();
}
