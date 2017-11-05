/*
 * Same as comments.js, but without gapi rendering method calls.
 * To be used in index.html for local tests.
 *
 * This class does not have the goal of being faithful to the look of the
 * original class. Only the logic has to be identical.
 */

Poll = Poll || {};

Poll.prototype.elementId = 'poll-box';

Poll.prototype.xPos =            14;
Poll.prototype.titleYpos =        2;
Poll.prototype.contentBaseYpos = 28;
Poll.prototype.contentPaceY =    16;

Poll.prototype.display = function(visible) {
  this.visible = visible;
  var element = getElement(this.elementId);
  if (visible) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
  var template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstChild;
}

Poll.prototype.drawTextOverlay = function(id, text, color, yPos) {
  var divText =
    '<div id="' + id + '" style="position: absolute; top: '
    + yPos + 'px; left: ' + this.xPos + 'px; color: ' + color + '">'
    + text + '</div>';
  var div = htmlToElement(divText);
  var pollBox = getElement(this.elementId);
  pollBox.appendChild(div);
};

Poll.prototype.initBackground = function() {};
