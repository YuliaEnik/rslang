import html from './index.html';
import './style.css';
import { renderWord } from './word';
import { renderWordCard } from './word-card';

export function renderTextbook(): HTMLDivElement {
  const template = document.createElement('div');
  template.innerHTML = html;
  const levelBtn = template.querySelectorAll('.level');
  const words = template.querySelector('.words') as HTMLElement;
  const wordCard = template.querySelector('.word-card') as HTMLElement;
  function renderCard() {
    wordCard.appendChild(renderWordCard());
    wordCard.classList.add('active');
  }
  function renderWords() {
    for (let i = 0; i < 20; i++) {
      words?.appendChild(renderWord({ word: 'flower', onclick: () => { renderCard() } }));
    }
  }
  // enderWords();
  levelBtn.forEach((el) => {
    el.addEventListener('click', () => {
      words.innerText = '';
      renderWords();
    });
  });
  return template;
}
