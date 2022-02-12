import { getWords } from '../../utils/api';
import { AppState, UserState } from '../../utils/types';
import html from './textbook.html';
import './style.scss';
import { renderWord } from './word';

function applyAuthentication(levelButton: HTMLElement, userState: UserState | null) {
  if (userState?.userId) {
    levelButton.classList.remove('level__item--hidden');
  }
}

export function buildTextbook(appState: AppState, group: number): HTMLDivElement {
  let currentPage = 0;
  const template = document.createElement('div');
  template.innerHTML = html;
  const levelButtons = template.querySelectorAll('.level__item');
  const words = template.querySelector('.words__list') as HTMLElement;
  const wordCard = template.querySelector('.word__popup') as HTMLElement;

  // // add options to select
  // const pageSelector = template.querySelector('.select__list') as HTMLInputElement;
  // for (let i = 0; i < 30; i++) {
  //   const option = document.createElement('li') as HTMLLIElement;
  //   option.classList.add('.select__item');
  //   option.innerText = String(i + 1);
  //   pageSelector.appendChild(option);
  // }

  function renderCard() {
    // wordCard.innerHTML = '';
    // wordCard.classList.add('active');
  }

  function renderWordsList(id: number, page: number) {
    words.innerHTML = '';
    getWords({ group: id, page }).then((wordsData) => {
      console.log(wordsData);
      wordsData.forEach((wordEl) => {
        words?.appendChild(renderWord({ word: wordEl, onclick: renderCard }, appState.user));
      });
    });
  }
  renderWordsList(group, currentPage);

  // levelButtons.forEach((el) => {
  //   const levelBtnEl = el as HTMLElement;
  //   applyAuthentication(levelBtnEl, appState.user);
  //   el.addEventListener('click', () => {
  //     words.innerText = '';
  //     group = Number(levelBtnEl.dataset.level);
  //     renderWordsList(group, currentPage);
  //   });
  // });

  // pageSelector.addEventListener('change', () => {
  //   currentPage = Number(pageSelector.value) - 1;
  //   renderWordsList(group, currentPage);
  // });

  // const prevBtn = template.querySelector('.btn--prev') as HTMLButtonElement;
  // const nextBtn = template.querySelector('.btn--next') as HTMLButtonElement;
  // prevBtn.addEventListener('click', () => {
  //   if (currentPage > 0) {
  //     currentPage -= 1;
  //     pageSelector.value = String(currentPage + 1);
  //     renderWordsList(group, currentPage);
  //   }
  // });

  // nextBtn.addEventListener('click', () => {
  //   if (currentPage < 29) {
  //     currentPage += 1;
  //     pageSelector.value = String(currentPage + 1);
  //     renderWordsList(group, currentPage);
  //   }
  // });

  return template;
}
