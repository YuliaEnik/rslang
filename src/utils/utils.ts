import { buildFooter } from '../components/footer';
import { buildNavigation } from '../components/nav';

export const createElement = (type: string, attrs?: { [key: string]: string }): HTMLElement => {
  const elem = document.createElement(type);
  if (attrs) {
    Object.keys(attrs).forEach((attr) => elem.setAttribute(attr, attrs[attr]));
  }
  return elem;
};

export const renderElement = (elem: Node, parent: Node): Node | undefined => parent.appendChild(elem);

export const getElement = (selector: string): Node | null => document.querySelector(selector);

export const getElements = (selector: string): NodeListOf<Element> => document.querySelectorAll(selector);

export const render = (elements: (string | Node)[], target: ParentNode): void => {
  target.append(...elements);
};

export const createHTMLelement = (
  type: string,
  attrs: { [key: string]: string },
  parent: Node | null,
  textContentEl?: string,
): HTMLElement => {
  const elem = createElement(type, attrs);
  if (textContentEl) {
    elem.textContent = textContentEl;
  }
  if (parent) {
    renderElement(elem, parent);
  }
  return elem;
};

export const stateTextContentEn:IstateTextContentEn = {
  btnTrue: 'true',
  btnFalse: 'false',
  exit: 'exit',
};

export interface IstateTextContentEn {
  btnTrue: string,
  btnFalse: string,
  exit: string
}

export const buildLayout = (pageElement: HTMLElement, hideFooter = false): HTMLElement => {
  const result = document.createElement('div');
  result.className = 'main-container';
  renderElement(buildNavigation(), result);
  renderElement(pageElement, result);
  if (!hideFooter) {
    renderElement(buildFooter(), result);
  }

  return result;
};

export const renderPage = (pageElement: HTMLElement): void => {
  const layout = buildLayout(pageElement);
  document.body.innerHTML = '';
  document.body.appendChild(layout);
};
