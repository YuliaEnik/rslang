import { Match } from 'navigo';
import { buildFooter } from '../components/footer';
import { data } from '../components/sprint/sprintApp';
import { Word, StateSprint } from './types';
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

export const buildLayout = (pageElement: HTMLElement, context: Match | undefined, hideMenu = false, hideFooter = false): HTMLElement => {
  const result = createElement('div', { class: 'main-container' });
  if (!hideMenu) {
    renderElement(buildSideBar(context), result);
  }
  const main = createElement('main', { class: 'main' });
  renderElement(pageElement, main);
  renderElement(main, result);
  if (!hideFooter) {
    renderElement(buildFooter(), result);
  }
  return result;
};

export const renderPage = (buildPageElement: HTMLElement, context: Match | undefined): void => {
  const layout = buildLayout(buildPageElement, context);
  document.body.innerHTML = '';
  document.body.appendChild(layout);
};
