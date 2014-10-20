function CommentBox() {
  this.visible = false;
  this.overlays = {
    'bkg' : {},
    'comm0' : {},
    'comm1' : {},
    'comm2' : {},
    'name' : {},
  };
  this.bkgScale = 0.196;
  this.bkgXPos = 0.295;
  this.bkgYPos = 0.395;

  this.commXpos = 389;
  this.nameXPos = 620;

  this.linesYPos = [317, 329, 341, 353];
  this.lineMaxLength = 44;

  this.initBackground();
}

CommentBox.prototype.display = function(visible) {
  this.visible = visible;
  for (var i in this.overlays) {
    this.overlays[i]['ovl'].setVisible(visible);
  }
};

CommentBox.prototype.initBackground = function() {
  var img = gapi.hangout.av.effects.createImageResource(
      'https://table-tennis-scoreboard.googlecode.com/git/images/comment.png');
  var overlay = img.createOverlay();
  overlay.setPosition(this.bkgXPos, this.bkgYPos);
  overlay.setScale(this.bkgScale, gapi.hangout.av.effects.ScaleReference.HEIGHT);
  this.overlays['bkg'] = {
    'img' : img,
    'ovl' : overlay,
  };
};

CommentBox.prototype.redrawOverlay = function(overlayId, overlayImg) {
  var newOverlay = overlayImg.createOverlay();
  if (this.overlays[overlayId]['ovl']) {
    this.overlays[overlayId]['ovl'].setVisible(false);
    this.overlays[overlayId]['ovl'].dispose();
    this.overlays[overlayId]['img'].dispose();
  }
  this.overlays[overlayId]['ovl'] = newOverlay;
  this.overlays[overlayId]['img'] = overlayImg;
};

CommentBox.prototype.getVisible = function() {
  return this.visible;
};

CommentBox.prototype.createTextOverlay = function(text, align, xPos, yPos) {
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', CANVAS_WIDTH);
  canvas.setAttribute('height', CANVAS_HEIGHT);

  var context = canvas.getContext('2d');
  context.font = '9px Monospace';
  context.fillStyle = 'white';
  context.textAlign = align;
  context.textBaseline = 'bottom';
  context.fillText(text, xPos, yPos);

  return canvas.toDataURL();
};

CommentBox.prototype.setComment = function(comment) {
  var lines = [comment, '', ''];

  if (comment.length > this.lineMaxLength) {
    lines[0] = '';
    var pieces = comment.split(' ');
    for (i = 0, l = 0; l < lines.length; l++) {
      for (; i < pieces.length; i++) {
        if ((lines[l].length + pieces[i].length) <= this.lineMaxLength) {
          lines[l] += pieces[i] + ' ';
        } else {
          break;
        }
      }
    }
  }

  for (i = 0; i < lines.length; i++) {
    var img = gapi.hangout.av.effects.createImageResource(
        this.createTextOverlay(lines[i], 'left', this.commXpos, this.linesYPos[i]));
    this.redrawOverlay('comm' + i, img);
  }
};

CommentBox.prototype.setNetzen = function(netzen) {
  if (netzen.length > this.lineMaxLength) {
    netzen = netzen.substr(0, this.lineMaxLength);
  }

  var img = gapi.hangout.av.effects.createImageResource(
    this.createTextOverlay(netzen, 'right', this.nameXPos, this.linesYPos[3]));
  this.redrawOverlay('name', img);
};

CommentBox.prototype.maxCommentLength = function () {
  // It supports up to 3 lines of comment.
  return 3 * this.lineMaxLength;
};

CommentBox.prototype.setLineMaxLength = function(lineMaxLength) {
  this.lineMaxLength = lineMaxLength;
};
