import './style.scss';
import html from './index.html';
import { appState } from '../../app';

export const buildMainPage = () => {
  const template = document.createElement('div');
  template.innerHTML = html;

  if (appState.user) {
    const buttonSignIns = template.querySelectorAll('.btn--sign') as NodeListOf<HTMLElement>;
    if (buttonSignIns) {
      buttonSignIns.forEach((btn: HTMLElement) => {
        btn.style.display = 'none';
      });
    }
  }
  return template;
};
