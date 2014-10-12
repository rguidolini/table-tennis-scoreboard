/*
 * Same as chronometer.js, but without gapi rendering method calls.
 * To be used in index.html for local tests.
 */

Chronometer = Chronometer || {};

Chronometer.prototype.display = function(visible) {
  if (visible) {
    getElement('watch').classList.remove('hidden')
  } else {
    getElement('watch').classList.add('hidden')
  }
}

Chronometer.prototype.drawBackground = function() {
  // Mocked ;-)
}

Chronometer.prototype.redrawOverlay = function(overlayId, overlayImg) {
  // Mocked ;-)
}

Chronometer.prototype.drawTime = function(time) {
  getElement('watch').textContent = time;
}
