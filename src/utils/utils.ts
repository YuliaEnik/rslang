const createElement = (type: string, attrs?: { [key: string]: string }): HTMLElement => {
  const elem = document.createElement(type);
  if (attrs) {
    Object.keys(attrs).forEach((attr) => elem.setAttribute(attr, attrs[attr]));
  }
  return elem;
};

const renderElement = (elem: Node, parent: Node): Node | undefined => parent.appendChild(elem);

const getElement = (selector: string): HTMLElement | null => document.querySelector(selector);

const getElements = (selector: string): NodeListOf<Element> => document.querySelectorAll(selector);

/* const createHTMLelement = ( type: string, attrs: { [key: string]: string }, parent:Node, textContentEl?: string): void => {
  const elem = createElement(type, attrs);
  renderElement(elem, parent);
  if (elem) {
  elem.textContent = textContentEl;
  }
} */

export {
  createElement,
  renderElement,
  getElement,
  getElements,
  //createHTMLelement,
}