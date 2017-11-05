// This class uses JS inheritage. See:
// http://blog.caelum.com.br/reaproveitando-codigo-com-javascript-heranca-e-prototipos/

function CommentBox(mainElementId) {
  VisualElement.call(this, mainElementId);

  this.visible = false;
  this.lineMaxLength = 44;
}
CommentBox.prototype = new VisualElement();
CommentBox.prototype.constructor = CommentBox;

CommentBox.prototype.setComment = function(comment) {
  this.setContent('comment', comment);
};

CommentBox.prototype.setNetzen = function(netzen) {
  this.setContent('netzen', netzen);
};

CommentBox.prototype.maxCommentLength = function () {
  // It supports up to 3 lines of comment.
  return 3 * this.lineMaxLength;
};

CommentBox.prototype.setLineMaxLength = function(lineMaxLength) {
  this.lineMaxLength = lineMaxLength;
};
