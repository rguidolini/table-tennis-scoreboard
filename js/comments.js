function CommentBox(visible) {
  this.visible = visible;
  this.overlays = {
    'bkg' : {},
    'comment' : {},
    'name' : {},
  };
}

CommentBox.prototype.COMM_X_POS = 601;
CommentBox.prototype.COMM_Y_POS = 347;

CommentBox.prototype.display = function(visible) {
  this.visible = visible;
  for (var i in this.overlays) {
    this.overlays[i]['ovl'].setVisible(visible);
  }
}

CommentBox.prototype.drawBackground = function() {
  var img = gapi.hangout.av.effects.createImageResource(
      'https://table-tennis-scoreboard.googlecode.com/git/images/comment.png');
  var overlay = img.createOverlay();
  overlay.setPosition(0.44, 0.44);
  overlay.setScale(0.08, gapi.hangout.av.effects.ScaleReference.WIDTH);
  overlay.setVisible(true);
  this.overlays['bkg'] = {
    'img' : img,
    'ovl' : overlay,
  };
}

CommentBox.prototype.redrawOverlay = function(overlayId, overlayImg) {
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

CommentBox.prototype.getVisible = function() {
  return this.visible;
}

CommentBox.prototype.createTextOverlay =
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

CommentBox.prototype.setComment = function(comment) {
  var img = gapi.hangout.av.effects.createImageResource(
    this.createTextOverlay(
      comment, 15, 'white', 'center', this.COMM_X_POS, this.COMM_Y_POS));
  this.redrawOverlay('comment', img);
}

CommentBox.prototype.setNetzen = function(netzen) {
  var element = getElement('netzen');
  element.textContent = netzen;
}

