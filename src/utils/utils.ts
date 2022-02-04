const createElement = (type: string, attrs: { [key: string]: string }, textContentEl?: string ): Node => {
  const elem = document.createElement(type);
  Object.keys(attrs).forEach((attr) => elem.setAttribute(attr, attrs[attr]));
  if (textContentEl) {
  elem.textContent = textContentEl;
  }
  return elem;
};

const renderElement = (elem: Node, parent: Node):void => {
  if (parent){
  parent.appendChild(elem);
  }
}
const getElement = (selector: string): Node | null => document.querySelector(selector);

const getElements = (selector: string): NodeListOf<Element> => document.querySelectorAll(selector);

const render = (elements: (string | Node)[], target: ParentNode): void => {
  target.append(...elements);
};

const createHTMLelement = ( type: string, attrs: { [key: string]: string }, parent: Node | null, textContentEl?: string): Node => {
  const elem = createElement(type, attrs, textContentEl);
  if (parent){
  renderElement(elem, parent);
  }
  return elem;
}

const stateTextContentEn:IstateTextContentEn  = {
  btnTrue: 'true',
  btnFalse: 'false',
  exit: 'exit'
}

interface IstateTextContentEn {
  btnTrue: string,
  btnFalse: string,
  exit: string
}


export {
  createElement,
  renderElement,
  getElement,
  getElements,
  createHTMLelement,
  stateTextContentEn,
  IstateTextContentEn
}