import './style.scss';
import html from './index.html';
import { electron } from 'webpack';

export const buildMainPage = () => {
  const template = document.createElement('div');
  template.innerHTML = html;

  function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
  }

  function getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    const randomColor = `hsl(${hue}, 70%, 80%)`;
    return randomColor;
  }

  const allSections = template.querySelectorAll('section');
  allSections.forEach((section: HTMLElement, i) => {
    const backgroundColor = getRandomPastelColor();
    section.style.background = `${backgroundColor}`;
  });

  return template;
};
