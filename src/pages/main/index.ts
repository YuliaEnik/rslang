import './style.scss';
import html from './index.html';

export const buildMainPage = () => {
  const template = document.createElement('div');
  template.innerHTML = html;

  return template;
};
