import { createElement, renderElement } from '../../utils/utils';
import './style.scss';

const developers = [
  {
    github: 'yenik',
    url: 'url',
  },
  {
    github: 'ylepner',
    url: 'url',
  },
  {
    github: 'mserykh',
    url: 'url',
  },
];

export const buildFooter = (): HTMLElement => {
  const result = createElement('footer', { class: 'footer' });
  const footerLogo = createElement('img',
    { class: 'logo-rss', src: 'svg/heart.svg', alt: 'Rolling Scopes School' });
  renderElement(footerLogo, result);
  const developersContainer = createElement('div', { class: 'developers' });
  const heart = createElement('span', { class: 'heart' });
  const developersTitle = createElement('h5', { class: 'developers__title' }, `Created with ${heart} by:`);
  renderElement(developersTitle, developersContainer);
  const developersList = createElement('ul', { class: 'developers__list' });
  developers.forEach((developer : { github: string; url: string }) => {
    const developerItem = createElement('li', { class: 'developers__item' });
    const link = createElement('a', { class: 'developers__link', href: '' }, developer.github);
    renderElement(link, developerItem);
    renderElement(developerItem, developersList);
  });
  renderElement(developersList, developersContainer);
  renderElement(developersContainer, result);
  const copyrights = createElement('p', { class: 'copyrights' }, '© 2022');
  renderElement(copyrights, result);
  return result;
};
