import { Match } from 'navigo';
import { buildFooter } from '../components/footer';
import { buildSideBar } from '../components/nav';
import { Word } from './types';

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

export const buildLayout = (
  pageElement: HTMLElement | Array<HTMLElement>,
  context: Match | undefined,
  hideMenu: boolean,
  hideFooter: boolean,
): HTMLElement => {
  const result = createElement('div', { class: 'main-container' });

  if (!hideMenu) {
    renderElement(buildSideBar(context), result);
  }

  const main = createElement(
    'main',
    { class: `main ${hideMenu ? 'hidden-menu' : ''} ${hideFooter ? 'hidden-footer' : ''}` },
  );

  // const mainTitle = createElement('h1', { class: 'visually-hidden' }, 'Learn English with RS Lang application');
  // renderElement(mainTitle, main);
  if (Array.isArray(pageElement)) {
    pageElement.forEach((el) => renderElement(el, main));
  } else {
    renderElement(pageElement, main);
  }

  renderElement(main, result);

  if (!hideFooter) {
    renderElement(buildFooter(), result);
  }

  return result;
};

export const renderPage = (
  buildPageElement: HTMLElement | Array<HTMLElement>,
  context: Match | undefined,
  hideMenu = false,
  hideFooter = false,
): void => {
  const layout = buildLayout(buildPageElement, context, hideMenu, hideFooter);
  document.body.innerHTML = '';
  document.body.appendChild(layout);
};

export const random = (max_num:number):number => Math.floor(Math.random() * max_num);

export const createRandomAnswerFalse = (data: Word[], currentIndex: number): number => {
  const getRandomTranslateWord = ():number => Math.floor(Math.random() * data.length);
  let k = getRandomTranslateWord();
  while (k === currentIndex) {
    k = getRandomTranslateWord();
  }
  return k;
};

export function shuffle(array:string[]):void {
  array.sort(() => Math.random() - 0.5);
}

export function createEl<T extends keyof HTMLElementTagNameMap>(tagName: T, config?: {
  elementConfiguration?: (input: HTMLElementTagNameMap[T]) => void,
  children?: HTMLElement[],
  attrs?: Partial<HTMLElementTagNameMap[T]>,
  classes?: string,
}) {
  const el = document.createElement(tagName);
  config?.elementConfiguration?.(el);
  if (config?.children) {
    config.children.forEach((child) => {
      el.appendChild(child);
    });
  }

  if (config?.attrs) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.keys(config.attrs).forEach((attr) => el.setAttribute(attr, (config.attrs as any)[attr]));
  }

  if (config?.classes) {
    config.classes.split(' ').forEach((classEl) => el.classList.add(classEl));
  }
  return el;
}
