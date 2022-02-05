import { Match } from 'navigo';
import { buildFooter } from '../components/footer';
import { buildSideBar } from '../components/nav';

export const createElement = (type: string, attrs: { [key: string]: string }, textContentEl?: string): HTMLElement => {
  const elem = document.createElement(type);
  Object.keys(attrs).forEach((attr) => elem.setAttribute(attr, attrs[attr]));
  if (textContentEl) {
    elem.textContent = textContentEl;
  }
  return elem;
};

export const renderElement = (elem: Node, parent: Node): Node | undefined => parent.appendChild(elem);

const getElement = (selector: string): HTMLElement | null => document.querySelector(selector);

const getElements = (selector: string): NodeListOf<Element> => document.querySelectorAll(selector);

export const buildLayout = (pageElement: HTMLElement, context: Match | undefined, hideFooter = false): HTMLElement => {
  const result = createElement('div', { class: 'main-container' });
  renderElement(buildSideBar(context), result);
  const main = createElement('main', { class: 'main' });
  renderElement(pageElement, main);
  renderElement(main, result);
  if (!hideFooter) {
    renderElement(buildFooter(), result);
  }
  return result;
};

export const renderPage = (pageElement: HTMLElement, context: Match | undefined): void => {
  const layout = buildLayout(pageElement, context);
  document.body.innerHTML = '';
  document.body.appendChild(layout);
};
