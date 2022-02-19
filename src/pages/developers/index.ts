import './style.scss';
import html from './index.html';

export const buildDevelopersPage = (): HTMLElement => {
  const template = document.createElement('div');
  template.innerHTML = html;
  template.classList.add('dev-page');

  return template;
};
