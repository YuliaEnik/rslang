import { createElement, renderElement } from '../../utils/utils';
import './style.scss';

const pages = [
  {
    title: 'Home',
    link: '/',
  },
  {
    title: 'Dictionary',
    link: '/dictionary',
  },
  {
    title: 'Sprint',
    link: '/sprint',
  },
  {
    title: 'Statistics',
    link: '/statistics',
  },
  {
    title: 'Developers',
    link: '/developers',
  },
];

const buildNavItem = (page: { title: string; link: string; }): HTMLElement => {
  const result = createElement('li');
  result.className = 'nav__item';
  const link = createElement('a', { 'data-navigo': '', href: page.link });
  link.className = 'nav__link';
  link.textContent = page.title;
  renderElement(link, result);
  return result;
};

export const buildNavigation = (): HTMLElement => {
  const result = createElement('nav');
  result.className = 'nav';
  const list = createElement('ul');
  list.className = 'nav__list';
  pages.forEach((page) => {
    renderElement(buildNavItem(page), list);
  });
  renderElement(list, result);
  return result;
};
