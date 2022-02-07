import { Match } from 'navigo';
import { createElement, renderElement } from '../../utils/utils';
import './style.scss';

const pages = [
  {
    title: 'Main',
    link: '/',
    type: 'main',
  },
  {
    title: 'Dictionary',
    link: '/dictionary',
    type: 'dictionary',
  },
  {
    title: 'Sprint',
    link: '/games',
    type: 'games',
  },
  {
    title: 'Statistics',
    link: '/statistics',
    type: 'statistics',
  },
  {
    title: 'Developers',
    link: '/developers',
    type: 'developers',
  },
  {
    title: 'Settings',
    link: '/settings',
    type: 'settings',
  },
];

const buildActiveClass = (pageLink: string, context: Match | undefined): string => {
  if (!context || !context.route) {
    return '';
  }
  const currentUrl = `/${context.route.name}`;
  return currentUrl === pageLink ? ' active' : '';
};

export const buildLogo = (): HTMLElement => {
  const result = createElement('div', { class: 'logo logo__nav' });
  const logoImg = createElement('div', { class: 'logo__img' });
  renderElement(logoImg, result);
  const logoText = createElement('p', { class: 'logo__text' }, 'RS Lang');
  renderElement(logoText, result);
  return result;
};

const buildNavItem = (page: { title: string; link: string; type: string }, context: Match | undefined): HTMLElement => {
  const result = createElement('li', { class: 'nav__item' });
  const link = createElement(
    'a',
    {
      class: `nav__link nav__link--${page.type}${buildActiveClass(page.link, context)}`,
      'data-navigo': '',
      href: page.link,
    },
    page.title,
  );
  renderElement(link, result);
  return result;
};

export const buildNavigation = (context: Match | undefined): HTMLElement => {
  const result = createElement('nav', { class: 'nav' });
  const list = createElement('ul', { class: 'nav__list' });
  pages.forEach((page) => {
    renderElement(buildNavItem(page, context), list);
  });
  renderElement(list, result);
  return result;
};

export const buildSideBar = (context: Match | undefined): HTMLElement => {
  const result = createElement('aside', { class: 'menu' });
  renderElement(buildLogo(), result);
  renderElement(buildNavigation(context), result);
  return result;
};
