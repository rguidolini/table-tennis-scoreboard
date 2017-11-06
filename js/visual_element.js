function VisualElement(mainElementId) {
  this.mainElementId = mainElementId;
  this.visible = false;
}

VisualElement.prototype.setVisible = function(elementId, visible) {
  var key = this.constructor.name + '.visible.' + elementId, visible;
  localStorage.setItem(key, visible);
  this.setVisibleView(elementId, visible);
}

VisualElement.prototype.setVisibleView = function(elementId, visible) {
  var element = getElement(elementId);
  if (visible) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

VisualElement.prototype.setContent = function(elementId, content) {
  var key = this.constructor.name + '.content.' + elementId, content;
  localStorage.setItem(key, content);
  this.setContentView(elementId, content);
}

VisualElement.prototype.setContentView = function(elementId, content) {
  getElement(elementId).textContent = content;
}

VisualElement.prototype.setHTML = function(elementId, html) {
  var key = this.constructor.name + '.html.' + elementId, html;
  localStorage.setItem(key, html);
  this.setHTMLView(elementId, html);
}

VisualElement.prototype.setHTMLView = function(elementId, html) {
  getElement(elementId).innerHTML = html;
}

VisualElement.prototype.display = function(visible) {
  this.visible = visible;  
  this.setVisible(this.mainElementId, visible);
}

VisualElement.prototype.getVisible = function() {
  return this.visible;
};

VisualElement.prototype.listen = function() {
  var thisObject = this;
  window.addEventListener('storage', function(e) {
    if (thisObject.updateView(e.key, e.newValue)) {
      return;
    }
    console.log('ERROR: storage event unhandled: ' + e.key + '=' + e.newValue);
  });
}

VisualElement.prototype.updateView = function(key, value) {
  //console.log(
  //  'obeject: ' + this.constructor.name + '\n' +
  //  '    key: ' + key + '\n' +
  //  '  value: ' + value);
  if (key == null || !key.startsWith(this.constructor.name)) {
    return true;
  }

  var prefix = this.constructor.name + '.visible.';
  if (key.startsWith(prefix)) {
    var elementId = key.replace(prefix, '');
    var visible = value === 'true';
    this.setVisibleView(elementId, visible);
    return true;
  }

  var prefix = this.constructor.name + '.content.';
  if (key.startsWith(prefix)) {
    var elementId = key.replace(prefix, '');
    this.setContentView(elementId, value);
    return true;
  }

  var prefix = this.constructor.name + '.html.';
  if (key.startsWith(prefix)) {
    var elementId = key.replace(prefix, '');
    this.setHTMLView(elementId, value);
    return true;
  }

  return false;
}
