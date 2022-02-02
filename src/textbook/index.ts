import html from './index.html';
import './style.css';
import { renderWord } from './word';

export function renderTextbook(): HTMLDivElement {
  const template = document.createElement('div');
  template.innerHTML = html;
  const levelBtn = template.querySelectorAll('.level');
  const words = template.querySelector('.words') as HTMLElement;
  function renderWords() {
    for (let i = 0; i < 20; i++) {
      words?.appendChild(renderWord());
    }
  }
  renderWords();
  levelBtn.forEach((el) => {
    el.addEventListener('click', () => {
      words.innerText = '';
      renderWords();
    });
  });
  const wordAll = template.querySelectorAll('.word');
  wordAll.forEach((el) => {
    el.addEventListener('click', () => {
      console.log(1111);
    })
  })
  return template;
}
