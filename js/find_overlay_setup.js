// Used just to help finding the position and scale of new overlays.

var scaleTxt = document.getElementById('scaleTxt');
var offsetTxt = document.getElementById('offsetTxt');
var offsetTxtX = document.getElementById('offsetTxtX');

var textOverlay = null;
var imageOverlay = null;
var minScale = 0.01;
var maxScale = 0.5;

var INITIAL_SCALE = 0.26;
var INITIAL_X_POS = -0.36;
var INITIAL_Y_POS = 0.44;
var IMAGE_URI =
    'https://table-tennis-scoreboard.googlecode.com/git/images/' +
    'scoreboard_summary.png';

/** Responds to scale slider
 * @param {string} value The new scale.
 */
function onSetScale(value) {
  scaleTxt.innerHTML = parseFloat(value).toFixed(2);
  imageOverlay.setScale(parseFloat(value),
      gapi.hangout.av.effects.ScaleReference.WIDTH);
}

/** Responds to offset slider
 * @param {string} value The new offset.
 */
function onSetOffset(value) {
  offsetTxt.innerHTML = parseFloat(value).toFixed(2);
  var x = imageOverlay.getPosition().x;
  imageOverlay.setPosition(x, parseFloat(value));
}

/** Responds to offset X slider
 * @param {string} value The new offset.
 */
function onSetOffsetX(value) {
  offsetTxtX.innerHTML = parseFloat(value).toFixed(2);
  var y = imageOverlay.getPosition().y;
  imageOverlay.setPosition(parseFloat(value), y);
}

function drawImageOverlayTest() {
  console.log('loading image from ' + IMAGE_URI);
  var img = gapi.hangout.av.effects.createImageResource(IMAGE_URI);
  imageOverlay = img.createOverlay();
  imageOverlay.setScale(INITIAL_SCALE,
      gapi.hangout.av.effects.ScaleReference.WIDTH);
  imageOverlay.setPosition(INITIAL_X_POS, INITIAL_Y_POS);
  imageOverlay.setVisible(true);
}

function drawTextOverlayTest(uri) {
  var params = uri.split(' ');
  var img = gapi.hangout.av.effects.createImageResource(
      createTextOverlay(params[0],    // text
                        params[1],    // fontSize
                        params[2],    // color
                        params[3],    // shadow
                        params[4],    // align
                        params[5],    // xPos
                        params[6]));  // yPos

  // We should delete (hide) a previous text
  if (!!textOverlay && params.length == 8) {
    textOverlay.setVisible(false);
    textOverlay.dispose();
  }
  textOverlay = img.createOverlay()
  textOverlay.setVisible(true);
  minScale = 0.1;
  maxScale = 1.0;
}








