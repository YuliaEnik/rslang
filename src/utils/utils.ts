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

const getElement = (selector: string): HTMLElement | null => document.querySelector(selector);

const getElements = (selector: string): NodeListOf<Element> => document.querySelectorAll(selector);

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
