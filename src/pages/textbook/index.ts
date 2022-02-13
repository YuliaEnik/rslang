import { appState } from '../../app';
import { data } from '../../components/sprint/sprintApp';
import { getUserWords, getUserWordsforGame, getWords } from '../../utils/api';
import { router } from '../../utils/router';
import { UserState, Word } from '../../utils/types';
import { createElement, renderElement } from '../../utils/utils';
import html from './index.html';
import './style.scss';
import { renderWord } from './word';

function applyAuthentication(levelButton: HTMLElement, userState: UserState | null) {
  if (userState?.userId) {
    levelButton.classList.remove('level__item--hidden');
  }
}

async function getWordsforGame(game: string) {
  const result = await getUserWordsforGame(appState.user, {
    group: appState.groupState.group,
    page: appState.groupState.pageNumber,
    wordsPerPage: 20,
    filter: '%7B%22%24and%22%3A%5B%7B%22userWord.optional.isLearned%22%3Anull%7D%5D%7D',
  });

  const content = [...result];
  if (content[0]) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    const words = content[0]['paginatedResults'] as Word[];
    data.splice(0, data.length);
    words.forEach((word: Word) => data.push(word));
    router.navigate('/games');
  }
}

async function playGame(event: Event) {
  const target = (event.target as HTMLElement).closest('.games__item');
  if (target) {
    const game = target.getAttribute('data-game') as string;
    getWordsforGame(game);
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

  return template;
}
