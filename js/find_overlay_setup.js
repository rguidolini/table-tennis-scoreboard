// Used just to help finding the position and scale of new overlays.

var textOverlay = null;
var imageOverlay = null;
var minScale = 0.01;
var maxScale = 0.5;

var INITIAL_SCALE = 0.115;
var INITIAL_X_POS = -0.22;
var INITIAL_Y_POS = 0.415;
var IMAGE_URI =
    'https://table-tennis-scoreboard.googlecode.com/git/images/' +
    'scoreboard_summary.png';

/** Responds to scale slider
 * @param {string} value The new scale.
 */
function onSetScale(value) {
  imageOverlay.setScale(parseFloat(value),
      gapi.hangout.av.effects.ScaleReference.WIDTH);
}

/** Responds to offset slider
 * @param {string} value The new offset.
 */
function onSetOffsetY(value) {
  var x = imageOverlay.getPosition().x;
  imageOverlay.setPosition(x, parseFloat(value));
}

/** Responds to offset X slider
 * @param {string} value The new offset.
 */
function onSetOffsetX(value) {
  var y = imageOverlay.getPosition().y;
  imageOverlay.setPosition(parseFloat(value), y);
}

function drawImageOverlayTest() {
  console.log('loading image from ' + IMAGE_URI);
  var img = gapi.hangout.av.effects.createImageResource(IMAGE_URI);
  imageOverlay = img.createOverlay();
  imageOverlay.setScale(INITIAL_SCALE,
      gapi.hangout.av.effects.ScaleReference.HEIGHT);
  imageOverlay.setPosition(INITIAL_X_POS, INITIAL_Y_POS);
  imageOverlay.setVisible(true);
}

function createTextOverlay(text, fontSize, color, bold, shadow, align, xPos, yPos) {
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', CANVAS_WIDTH);
  canvas.setAttribute('height', CANVAS_HEIGHT);

  var context = canvas.getContext('2d');
  if (shadow) {
    context.shadowColor = 'black';
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.shadowBlur = 2;
  }

  context.font = ((bold) ? 'bold ' : '') + fontSize + 'px Arial';
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = 'bottom';
  context.fillText(text, xPos, yPos);

  return canvas.toDataURL();
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
