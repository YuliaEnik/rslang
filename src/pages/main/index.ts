import './style.scss';
import html from './index.html';
import { appState } from '../../app';

export const buildMainPage = () => {
  const template = document.createElement('div');
  template.innerHTML = html;

  if (appState.user) {
    const buttonWrapper = template.querySelectorAll('.button-wrapper') as NodeListOf<HTMLElement>;
    if (buttonWrapper) {
      buttonWrapper.forEach((btn: HTMLElement) => {
        btn.style.display = 'none';
      });
    }
  }
  return template;
};
