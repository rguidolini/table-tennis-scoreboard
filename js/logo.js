// This class uses JS inheritage. See:
// http://blog.caelum.com.br/reaproveitando-codigo-com-javascript-heranca-e-prototipos/

function Logo(mainElementId) {
  VisualElement.call(this, mainElementId);
}
Logo.prototype = new VisualElement();
Logo.prototype.constructor = Logo;
