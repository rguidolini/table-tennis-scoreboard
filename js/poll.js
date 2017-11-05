/* A module that displays a control pannel and elements on the screen to
 * present results of a pool.
 * */

function Poll() {
  this.visible = false;
  this.overlays = {
    'bkg' : {},
    'title' : {},
    'line0' : {},
    'line1' : {},
    'line2' : {},
    'line3' : {},
  };

  this.initBackground();
}

Poll.prototype.bkgScale = 0.196;
Poll.prototype.bkgXPos  = 0.295;
Poll.prototype.bkgYPos  = 0.395;

Poll.prototype.xPos            = 389;
Poll.prototype.titleYpos       = 297;
Poll.prototype.contentBaseYpos = 317;
Poll.prototype.contentPaceY    =  12;

Poll.prototype.getVisible = function() {
  return this.visible;
};

Poll.prototype.display = function(visible) {
  this.visible = visible;
  for (var i in this.overlays) {
    if ('ovl' in this.overlays[i]) {
      this.overlays[i]['ovl'].setVisible(visible);
    }
  }
};

Poll.prototype.setTitle = function(title) {
  this.drawTextOverlay('title', title, 'black', this.titleYpos);
}

Poll.prototype.setOption = function(line, option, value) {
  if (option == '') {
    return;
  }
  // Puts value in the format ddd%, for example '100%' or '  1%'.
  var percent = ('   ' + value + '%').substr(-4);
  var text = percent + ': ' + option;
  var yPos = this.contentBaseYpos + line * this.contentPaceY;
  this.drawTextOverlay('line' + line, text, 'white', yPos);
};

// To be mocked.
Poll.prototype.drawTextOverlay = function(id, text, color, yPos) {
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', CANVAS_WIDTH);
  canvas.setAttribute('height', CANVAS_HEIGHT);

  var context = canvas.getContext('2d');
  context.font = '9px Monospace';
  context.fillStyle = color;
  context.textAlign = 'left';
  context.textBaseline = 'bottom';
  context.fillText(text, this.xPos, yPos);

  var img = gapi.hangout.av.effects.createImageResource(canvas.toDataURL());
  this.redrawOverlay(id, img);
};

Poll.prototype.redrawOverlay = function(overlayId, overlayImg) {
  var newOverlay = overlayImg.createOverlay();
  if (this.overlays[overlayId]['ovl']) {
    this.overlays[overlayId]['ovl'].setVisible(false);
    this.overlays[overlayId]['ovl'].dispose();
    this.overlays[overlayId]['img'].dispose();
  }
  this.overlays[overlayId]['ovl'] = newOverlay;
  this.overlays[overlayId]['img'] = overlayImg;
};

Poll.prototype.initBackground = function() {
  var img = gapi.hangout.av.effects.createImageResource(
      'https://cdn.rawgit.com/rguidolini/table-tennis-scoreboard/master/images/poll_background.png');
  var overlay = img.createOverlay();
  overlay.setPosition(this.bkgXPos, this.bkgYPos);
  overlay.setScale(
      this.bkgScale, gapi.hangout.av.effects.ScaleReference.HEIGHT);
  this.overlays['bkg'] = {
    'img' : img,
    'ovl' : overlay,
  };
};

