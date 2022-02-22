import './style.scss';
import html from './index.html';

export const buildDevelopersPage = (): HTMLElement => {
  const template = document.createElement('section');
  template.innerHTML = html;
  template.classList.add('dev-page');
  template.classList.add('section--developers');

  return template;
};
