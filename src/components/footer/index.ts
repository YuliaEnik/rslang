import { createElement, createEl, renderElement } from '../../utils/utils';
import './style.scss';

const developers = [
  {
    github: 'YuliaEnik',
    url: 'https://github.com/YuliaEnik',
  },
  {
    github: 'ylepner',
    url: 'https://github.com/ylepner',
  },
  {
    github: 'mserykh',
    url: 'https://github.com/mserykh',
  },
];

export const buildFooter = (): HTMLElement => {
  const result = createElement('footer', { class: 'footer' });
  // const footerLogo = createElement('img',
  //   { class: 'logo-rss', src: 'svg/rs-school.svg', alt: 'Rolling Scopes School' });
  const footerLogo = createEl('a', {
    children: [
      createEl('img', {
        attrs: {
          src: 'svg/rs-school.svg',
          alt: 'Rolling Scopes School',
        },
        classes: 'logo-rss',
      }),
    ],
    attrs: {
      href: 'https://rs.school/js/',
      target: '_blank',
    },
  });
  renderElement(footerLogo, result);
  const developersContainer = createElement('div', { class: 'developers' });
  const heart = createElement('span', { class: 'heart' });
  const developersTitle = createElement('h5', { class: 'developers__title' });
  developersTitle.append('Created with ');
  developersTitle.append(heart);
  developersTitle.append(' by:');
  renderElement(developersTitle, developersContainer);
  const developersList = createElement('ul', { class: 'developers__list' });
  developers.forEach((developer) => {
    const developerItem = createElement('li', { class: 'developers__item' });
    const link = createElement('a', {
      class: 'developers__link',
      href: developer.url,
      target: '_blank',
    }, developer.github);
    renderElement(link, developerItem);
    renderElement(developerItem, developersList);
  });
  renderElement(developersList, developersContainer);
  renderElement(developersContainer, result);
  const copyrights = createElement('p', { class: 'copyrights' }, '© 2022');
  renderElement(copyrights, result);
  return result;
};
