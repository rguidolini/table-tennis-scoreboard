// Keep track of some UI elements
// RICK 1.5

var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 360;

var overlayControls = document.getElementById('overlayControls');
var scaleTxt = document.getElementById('scaleTxt');
var offsetTxt = document.getElementById('offsetTxt');
var offsetTxtX = document.getElementById('offsetTxtX');

// Track our overlays for re-use later
var overlays = [];

// Scale limits---tiny hats look silly, but tiny monocles are fun.
var minScale = [];
var maxScale = [];

/** Responds to buttons
 * @param {string} name Item to show.
 */
function showOverlay(name) {
  currentItem = name;
  setControlVisibility(true);
  overlays[currentItem].setVisible(true);
  updateControls();
}

function showNothing() {
  currentItem = null;
  hideAllOverlays();
  setControlVisibility(false);
}

/** Responds to scale slider
 * @param {string} value The new scale.
 */
function onSetScale(value) {
  scaleTxt.innerHTML = parseFloat(value).toFixed(2);

  if (currentItem == 'fancy' || currentItem == 'scoreboard' || currentItem == 'text') {
    overlays[currentItem].setScale(parseFloat(value),
        gapi.hangout.av.effects.ScaleReference.WIDTH);
  } else {
    overlays[currentItem].setScale(parseFloat(value));
  }
}

/** Responds to offset slider
 * @param {string} value The new offset.
 */
function onSetOffset(value) {
  offsetTxt.innerHTML = parseFloat(value).toFixed(2);
  var x = overlays[currentItem].getPosition().x;

  if (currentItem == 'fancy' || currentItem == 'scoreboard' || currentItem == 'text') {
    overlays[currentItem].setPosition(x, parseFloat(value));
  } else {
    overlays[currentItem].setOffset(x, parseFloat(value));
  }
}

/** Responds to offset X slider
 * @param {string} value The new offset.
 */
function onSetOffsetX(value) {
  offsetTxtX.innerHTML = parseFloat(value).toFixed(2);
  var y = overlays[currentItem].getPosition().y;

  if (currentItem == 'fancy' || currentItem == 'scoreboard' || currentItem == 'text') {
    overlays[currentItem].setPosition(parseFloat(value), y);
  } else {
    overlays[currentItem].setOffset(parseFloat(value), y);
  }
}

function setControlVisibility(val) {
  if (val) {
    overlayControls.style.visibility = 'visible';
  } else {
    overlayControls.style.visibility = 'hidden';
  }
}

function updateOverlayControls() {
  var overlay = overlays[currentItem];
  var min = minScale[currentItem];
  var max = maxScale[currentItem];

  // Overlays magnitude and which dimension of the screen to return
  var scale = overlay.getScale().magnitude;

  document.getElementById('scaleSlider').value = scale;
  document.getElementById('scaleSlider').min = min;
  document.getElementById('scaleSlider').max = max;
  document.getElementById('scaleTxt').innerHTML = scale.toFixed(2);

  document.getElementById('offsetSlider').value = overlay.getPosition().y;
  document.getElementById('offsetTxt').innerHTML =
      overlay.getPosition().y.toFixed(2);
}

function updateFaceTrackingOverlayControls() {
  var overlay = overlays[currentItem];
  var min = minScale[currentItem];
  var max = maxScale[currentItem];

  // FaceTrackingOverlays return only magnitude
  var scale = overlay.getScale();

  document.getElementById('scaleSlider').value = scale;
  document.getElementById('scaleSlider').min = min;
  document.getElementById('scaleSlider').max = max;
  document.getElementById('scaleTxt').innerHTML =
      scale.toFixed(2);

  document.getElementById('offsetSlider').value = overlay.getOffset().y;
  document.getElementById('offsetTxt').innerHTML =
      overlay.getOffset().y.toFixed(2);
}


/** Resets the controls for each type of wearable item */
function updateControls() {
  // Don't show these controls for
  if (currentItem == 'fancy' || currentItem == 'scoreboard' || currentItem == 'text') {
    updateOverlayControls();
  } else {
    updateFaceTrackingOverlayControls();
  }
}

/** For removing every overlay */
function hideAllOverlays() {
  for (var index in overlays) {
    overlays[index].setVisible(false);
  }
  disposeArbitraryOverlay();
}

function createTextOverlay(text, fontSize, color, align, xPos, yPos) {
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

/** Initialize our constants, build the overlays */
function createOverlays() {
  var topHat = gapi.hangout.av.effects.createImageResource(
      'http://hangoutmediastarter.appspot.com/static/topHat.png');
  overlays['topHat'] = topHat.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
       'scaleWithFace': true,
       'rotateWithFace': true,
       'scale': 1.0});
  minScale['topHat'] = 0.25;
  maxScale['topHat'] = 1.5;

  var mono = gapi.hangout.av.effects.createImageResource(
      'http://hangoutmediastarter.appspot.com/static/monocle.png');
  overlays['mono'] = mono.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.RIGHT_EYE,
       'scaleWithFace': true,
       'scale': 1.0});
  minScale['mono'] = 0.5;
  maxScale['mono'] = 1.5;

  var stache = gapi.hangout.av.effects.createImageResource(
      'http://hangoutmediastarter.appspot.com/static/mustache.png');
  overlays['stache'] = stache.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.NOSE_TIP,
       'scaleWithFace': true,
       'rotateWithFace': true});
  minScale['stache'] = 0.65;
  maxScale['stache'] = 2.5;


  var fancy = gapi.hangout.av.effects.createImageResource(
      createTextOverlay('00:00', 15, 'white', 'center', 0, 0));
  overlays['fancy'] = fancy.createOverlay()
  overlays['fancy'].setScale(0.6, gapi.hangout.av.effects.ScaleReference.WIDTH);
  overlays['fancy'].setPosition(0, 0.45);
  minScale['fancy'] = 0.01;
  maxScale['fancy'] = 1.0;

  var scoreboard = gapi.hangout.av.effects.createImageResource(
      'https://table-tennis-scoreboard.googlecode.com/git/images/gtvlogo.png');
  overlays['scoreboard'] = scoreboard.createOverlay();
  overlays['scoreboard'].setScale(
      0.26, gapi.hangout.av.effects.ScaleReference.WIDTH);
  overlays['scoreboard'].setPosition(-0.36, 0.44);
  minScale['scoreboard'] = 0.01;
  maxScale['scoreboard'] = 0.5;
}

// Arbitray overlay
var arbitraryResource = null;
var arbitraryOverlay = null;

function disposeArbitraryOverlay(arbitraryResource) {
  if (arbitraryResource) {
    arbitraryResource.dispose();
    arbitraryResource = null;
  }
}

function loadOverlay(uri) {
  /*arbitraryResource = gapi.hangout.av.effects.createImageResource(uri);

  // Use an onLoad handler
  arbitraryResource.onLoad.add( function(event) {
      if ( !event.isLoaded ) {
      alert("We could not load your overlay.");
      } else {
      alert("We loaded your overlay.");
      }
      });

  // Create this non-moving overlay that will be 50% of the width
  // of the video feed.
  arbitraryOverlay = arbitraryResource.createOverlay(
      {'scale':
      {'magnitude': 0.5,
      'reference': gapi.hangout.av.effects.ScaleReference.WIDTH}});
  // Put the text x-centered and halfway down the frame
  arbitraryOverlay.setPosition(0, 0.25);
  arbitraryOverlay.setVisible(true);*/

  var params = uri.split(' ');
  var img = gapi.hangout.av.effects.createImageResource(
      createTextOverlay(
        params[0], params[1], params[2], params[3], params[4], params[5]));

  currentItem = 'text';
  if (!!overlays['text'] && params.length == 7) {
    overlays['text'].setVisible(false);
    overlays['text'].dispose();
  }
  overlays['text'] = img.createOverlay()
  overlays['text'].setVisible(true);
  minScale['text'] = 0.1;
  maxScale['text'] = 1.0;
  setControlVisibility(true);
  updateControls();
}

createOverlays();

// Set mirroring and unmirroring
function updateMirroring() {
  var val =  document.querySelector('#mirror-checkbox').checked;

  gapi.hangout.av.setLocalParticipantVideoMirrored(val);
}

// SOUND
var gooddaySoundURL =
    'http://hangoutmediastarter.appspot.com/static/goodday.wav';
var gooddaySound = gapi.hangout.av.effects.createAudioResource(
    gooddaySoundURL).createSound({loop: false, localOnly: false});

// Note that we are playing a global audio event,
// so other hangouts will hear it.
function sayGoodDay() {
    gooddaySound.play();
}
