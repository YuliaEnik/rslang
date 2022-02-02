import html from './index.html';
import './style.css';
import { renderWord } from './word';

export function renderTextbook(): HTMLDivElement {
  const template = document.createElement('div');
  template.innerHTML = html;
  const levelBtn = template.querySelectorAll('.level');
  const words = template.querySelector('.words') as HTMLElement;
  levelBtn.forEach((el) => {
    el.addEventListener('click', () => {
      words.innerText = '';
      for (let i = 0; i < 20; i++) {
        words?.appendChild(renderWord());
      }
    });
  });
  return template;
}
