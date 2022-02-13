import { appState } from '../../app';
import { getWords } from '../../utils/api';
import { router } from '../../utils/router';
import { UserState } from '../../utils/types';
import { createElement, getElement, renderElement } from '../../utils/utils';
import { playGame } from './games';
import html from './index.html';
import './style.scss';
import { renderWord } from './word';

function applyAuthentication(levelButton: HTMLElement, gamesEl: HTMLElement, userState: UserState | null) {
  if (userState?.userId) {
    levelButton.classList.remove('level__item--hidden');
    gamesEl.classList.remove('hidden');
  }
}

export function buildDictionaryPage(): HTMLDivElement {
  let currentPage = appState.groupState.pageNumber;
  let { group } = appState.groupState;
  const template = document.createElement('div');
  template.innerHTML = html;
  const levelButtons = template.querySelectorAll('.level__item');
  const words = template.querySelector('.words__list') as HTMLElement;
  const wordCard = template.querySelector('.word__popup') as HTMLElement;

  // add options to select

  const pageSelector = template.querySelector('.page-selector') as HTMLInputElement;
  for (let i = 0; i < 30; i++) {
    const option = document.createElement('option') as HTMLOptionElement;
    option.classList.add('select__item');
    option.value = String(i + 1);
    option.innerText = `Page ${option.value}`;
    pageSelector.appendChild(option);
  }

  function renderCard() {
    // wordCard.innerHTML = '';
    // wordCard.classList.add('active');
  }

  function renderWordsList(id: number, page: number) {
    words.innerHTML = '';
    pageSelector.value = String(currentPage + 1);
    template.querySelector(`.level-${id}`)?.classList.add('active');
    getWords({ group: id, page }).then((wordsData) => {
      wordsData.forEach((wordEl) => {
        words?.appendChild(renderWord({ word: wordEl, onclick: renderCard }, appState.user));
      });
    });
  }
  renderWordsList(group, currentPage);

  levelButtons.forEach((el) => {
    el.addEventListener('click', () => {
      el.classList.add('active');
    });
  });

  pageSelector.addEventListener('change', () => {
    currentPage = Number(pageSelector.value) - 1;
    router.navigate(`/dictionary/${group + 1}?page=${currentPage + 1}`);
  });

  const prevBtn = template.querySelector('.previous-btn') as HTMLButtonElement;
  const nextBtn = template.querySelector('.next-btn') as HTMLButtonElement;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage -= 1;
      pageSelector.value = String(currentPage + 1);
      router.navigate(`/dictionary/${group + 1}?page=${currentPage + 1}`);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < 29) {
      currentPage += 1;
      pageSelector.value = String(currentPage + 1);
      router.navigate(`/dictionary/${group + 1}?page=${currentPage + 1}`);
    }
  });
  if (appState?.user?.userId) {
    const sprintButton = createElement('button', { class: 'btn btn--signin' }, 'Play sprint');
    sprintButton.addEventListener('click', playGame);
    renderElement(sprintButton, template);
  }

  if (appState?.user?.userId) {
    const gamesButton = template.querySelectorAll('.games__item');
    gamesButton.forEach((gameButton) => gameButton.addEventListener('click', playGame));
  }

  // for authorized user

  const gamesEl = template.querySelector('.games') as HTMLDivElement;
  applyAuthentication(template.querySelector('.difficult') as HTMLElement, gamesEl, appState.user);

  return template;
}
