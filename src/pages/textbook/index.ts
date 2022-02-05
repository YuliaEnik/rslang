import { getWords } from '../../utils/api';
import html from './index.html';
import './style.scss';
import { renderWord } from './word';
import { renderWordCard } from './word-card';

export function buildTextbook(): HTMLDivElement {
  const template = document.createElement('div');
  template.innerHTML = html;
  const levelBtn = template.querySelectorAll('.level');
  const words = template.querySelector('.words') as HTMLElement;
  const wordCard = template.querySelector('.word-card') as HTMLElement;
  function renderCard() {
    wordCard.innerHTML = '';
    wordCard.appendChild(renderWordCard());
    wordCard.classList.add('active');
  }

  function renderWordsList(id: number, page?: number) {
    getWords({ group: id }).then((wordsData) => {
      console.log(wordsData);
      wordsData.forEach((wordEl) => {
        words?.appendChild(renderWord({ word: wordEl, onclick: () => { renderCard(); } }));
      });
    });
  }

  levelBtn.forEach((el) => {
    const levelBtnEl = el as HTMLElement;
    el.addEventListener('click', () => {
      words.innerText = '';
      const id = Number(levelBtnEl.dataset.level);
      renderWordsList(id);
    });
  });

  return template;
}
