/*
 * Same as gtvlogo.js, but without gapi rendering method calls.
 * To be used in index.html for local tests.
 */

GtvLogo = GtvLogo || {};

GtvLogo.prototype.drawLogo = function(uri) {
  if (!uri) {
    logo.classList.add('hidden');
    return
  }
  logo = getElement('logo');
  logo.src = uri;
  logo.classList.remove('hidden');
}

GtvLogo.prototype.drawLive = function() {
  // Mocked.
}

