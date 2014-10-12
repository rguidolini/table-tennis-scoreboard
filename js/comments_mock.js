/*
 * Same as comments.js, but without gapi rendering method calls.
 * To be used in index.html for local tests.
 *
 * This class does not have the goal of being faithful to the look of the
 * original class. Only the logic has to be identical.
 */

CommentBox = CommentBox || {};

CommentBox.prototype.elementId = 'comment-box';

CommentBox.prototype.display = function(visible) {
  // Mocked.
  this.visible = visible;
  var element = getElement(this.elementId);
  if (visible) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

CommentBox.prototype.initBackground = function() {
  // Mocked.
}

CommentBox.prototype.redrawOverlay = function(overlayId, overlayImg) {
  // Mocked.
}

CommentBox.prototype.setComment = function(comment) {
  var element = getElement('comment');
  element.textContent = comment;
}

CommentBox.prototype.setNetzen = function(netzen) {
  var element = getElement('netzen');
  element.textContent = netzen;
}

