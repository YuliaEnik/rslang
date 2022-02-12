import { appState } from '../../app';
import { getWords } from '../../utils/api';
import { router } from '../../utils/router';
import { UserState } from '../../utils/types';
import html from './index.html';
import './style.scss';
import { renderWord } from './word';

function applyAuthentication(levelButton: HTMLElement, userState: UserState | null) {
  if (userState?.userId) {
    levelButton.classList.remove('level__item--hidden');
  }
}

export function buildDictionaryPage(): HTMLDivElement {
  let currentPage = appState.groupState.pageNumber;
  let { group } = appState.groupState;
  const template = document.createElement('div');
  template.innerHTML = html;
  const levelButtons = template.querySelectorAll('.level');
  const words = template.querySelector('.words') as HTMLElement;
  const wordCard = template.querySelector('.word-card') as HTMLElement;

  // add options to select
  const pageSelector = template.querySelector('.page-selector') as HTMLSelectElement;
  for (let i = 0; i < 30; i++) {
    const option = document.createElement('option') as HTMLOptionElement;
    option.value = String(i + 1);
    option.innerHTML = option.value;
    pageSelector.appendChild(option);
  }

  function renderCard() {
    wordCard.innerHTML = '';
    wordCard.classList.add('active');
  }

  function renderWordsList(id: number, page: number) {
    words.innerHTML = '';
    getWords({ group: id, page }).then((wordsData) => {
      // console.log(wordsData);
      wordsData.forEach((wordEl) => {
        words?.appendChild(renderWord({ word: wordEl, onclick: renderCard }, appState.user));
      });
    });
  }
  renderWordsList(group, currentPage);

  levelButtons.forEach((el) => {
    const levelBtnEl = el as HTMLElement;
    applyAuthentication(levelBtnEl, appState.user);
    el.addEventListener('click', () => {
      words.innerText = '';
      group = Number(levelBtnEl.dataset.level);
      renderWordsList(group, currentPage);
    });
  });

  pageSelector.addEventListener('change', () => {
    currentPage = Number(pageSelector.value) - 1;
    renderWordsList(group, currentPage);
    router.navigate(`/dictionary/${group + 1}?page=${currentPage + 1}`);
  });

  const prevBtn = template.querySelector('.previous-btn') as HTMLButtonElement;
  const nextBtn = template.querySelector('.next-btn') as HTMLButtonElement;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage -= 1;
      pageSelector.value = String(currentPage + 1);
      renderWordsList(group, currentPage);
      router.navigate(`/dictionary/${group + 1}?page=${currentPage + 1}`);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < 29) {
      currentPage += 1;
      pageSelector.value = String(currentPage + 1);
      renderWordsList(group, currentPage);
      router.navigate(`/dictionary/${group + 1}?page=${currentPage + 1}`);
    }
  });

  return template;
}
