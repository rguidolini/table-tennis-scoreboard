/**
 * Contains functions to handle constraction/expansion of specific elements.
 */

function zippy(element, shouldZip) {
  var icon;
  var animator =
    element.parentElement.getElementsByClassName('zip-content-animator')[0];
  if (shouldZip) {
    animator.classList.add('height-zero');
    icon = '&#9658;';
  } else {
    animator.classList.remove('height-zero');
    icon = '&#9660;';
  }
  element.firstChild.innerHTML = icon;
}

function toggleZip(element) {
  var animator =
    element.parentElement.getElementsByClassName('zip-content-animator')[0];
  zippy(element, !animator.classList.contains('height-zero'));
}

// Zips all zip elements except the one passed as argument.
function zipAll(notZip) {
  var control = getElementBySelector('.zip-control');
  for (i = 0; i < control.length; i++) {
    if (control[i] != notZip) {
      zippy(control[i], true);
    }
  }
}

// Creates DOM structures for all elements with class zip-container in the
// document.
function initZipElements() {
  var containers = getElementBySelector('.zip-container');
  for(var i = 0; i < containers.length; i++) {
    var animator = document.createElement("div");
    animator.className = 'zip-content-animator height-zero';
    animator.appendChild(containers[i].getElementsByClassName('zip-content')[0])
    containers[i].appendChild(animator);
    var control = containers[i].getElementsByClassName('zip-control')[0];

    var html = control.innerHTML;
    control.innerHTML = '<span id="symbol">&#9658;</span>&nbsp;' + html;
    control.onclick =
      function() {
        zipAll(this);
        toggleZip(this);
      };
  };
}
