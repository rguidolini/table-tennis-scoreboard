function showError(msg) {
  console.log('ERROR: ' + msg);
  var errorDiv = document.getElementById('error-msg');
  errorDiv.textContent = msg;
  errorDiv.classList.remove('hidden');
  errorDiv.classList.remove('warning');
}

function hideError() {
  var errorDiv = document.getElementById('error-msg');
  errorDiv.classList.add('hidden');
}

function showWarning(msg) {
  var element = document.getElementById('error-msg');
  element.textContent = msg;
  element.classList.add('warning');
  element.classList.remove('hidden');
}

function hideWarning() {
  var element = document.getElementById('error-msg');
  element.classList.add('hidden');
  element.classList.remove('warning');
}

function getElement(elementId) {
  var element = document.getElementById(elementId);
  if (!element) {
    showError('Element with id "' + elementId + '" not found.');
  }
  return element;
}

function getElementBySelector(selector) {
  var elements = document.querySelectorAll(selector)
  if (!elements) {
    showError('Elements with CSS id "' + selector + '" not found.');
  }
  return elements;
}
