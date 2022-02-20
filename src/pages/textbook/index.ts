import { appState } from '../../app';
import { getAggregatedWords } from '../../utils/api';
import { convertWordFromAggregated, getWordsForRendering } from '../../utils/operations';
import { router } from '../../utils/router';
import { UserState } from '../../utils/types';
import { playGame } from './games';
import html from './index.html';
import './style.scss';
import { renderWord } from './word';

function applyAuthentication(levelButton: HTMLElement, gamesEl: HTMLElement, levelEl: HTMLLIElement, userState: UserState | null) {
  if (userState?.userId) {
    levelButton.classList.remove('level__item--hidden');
    gamesEl.classList.remove('hidden');
  } else {
    levelEl.style.borderRadius = '0px 10px 10px 0px';
  }
}

export function buildDictionaryPage(): HTMLDivElement {
  let currentPage = appState.groupState.pageNumber;
  let { group } = appState.groupState;
  const template = document.createElement('div');
  template.innerHTML = html;
  const levelButtons = template.querySelectorAll('.level__item');
  const words = template.querySelector('.words__list') as HTMLElement;
  const wordsDiv = template.querySelector('.words') as HTMLElement;
  const gamesEl = template.querySelector('.games') as HTMLDivElement;
  const level5 = template.querySelector('.level-5') as HTMLLIElement;
  const paginationEl = template.querySelector('.pagination') as HTMLDivElement;

  // add options to select

  const pageSelector = template.querySelector('.page-selector') as HTMLInputElement;
  for (let i = 0; i < 30; i++) {
    const option = document.createElement('option') as HTMLOptionElement;
    option.classList.add('select__item');
    option.classList.add(`select__item-${i}`);
    // option.classList.add('active');
    option.value = String(i + 1);
    option.innerText = `Page ${option.value}`;
    pageSelector.appendChild(option);
  }

  function renderCard() {
    // wordCard.innerHTML = '';
    // wordCard.classList.add('active');
  }

  applyAuthentication(template.querySelector('.difficult') as HTMLElement, gamesEl, level5, appState.user);

  async function renderDifficultPage() {
    words.innerHTML = '';
    paginationEl.classList.add('hidden');
    appState.groupState.group = 6;
    template.querySelector('.level-6')?.classList.add('active');
    getAggregatedWords(appState.user, {
      page: appState.groupState.pageNumber || 0,
      wordsPerPage: 3600,
      filter: JSON.stringify({ 'userWord.difficulty': 'difficult' }),
    }).then(async (wordsData) => {
      const convertedWords = wordsData[0].paginatedResults.map((el) => convertWordFromAggregated(el));
      if (wordsData[0].paginatedResults.length === 0) {
        const pagination = template.querySelector('.pagination') as HTMLDivElement;
        pagination.classList.add('hidden');
        gamesEl.classList.add('hidden');
        wordsDiv.innerHTML = 'No words have been added yet';
      }
      convertedWords.forEach(async (el) => {
        const renderEl = renderWord({ word: el }, appState.user);
        (await renderEl).querySelector('.btn--difficult')?.classList.add('active');
        words?.appendChild(await renderEl);
      });
    });
  }

  function showMessageAllLearned() {
    gamesEl.innerHTML = 'YOU LEARNED ALL WORDS FROM THIS PAGE';
  }

  function stylePageElements() {
    pageSelector.style.color = '#605bff';
  }

  function checkIfPageLearned() {
    getAggregatedWords(appState.user, {
      group: appState.groupState.group,
      page: appState.groupState.pageNumber,
      wordsPerPage: 20,
    }).then(async (wordsData) => {
      const checkDefaultOpt = wordsData[0].paginatedResults.every((el) => el.userWord?.difficulty === 'studied');
      // console.log(checkDefaultOpt);
      if (checkDefaultOpt && wordsData[0].paginatedResults.length !== 0) {
        showMessageAllLearned();
        stylePageElements();
      }
    });
  }

  function renderWordsList(id: number) {
    words.innerHTML = '';
    pageSelector.value = String(currentPage + 1);
    template.querySelector(`.level-${id}`)?.classList.add('active');
    getWordsForRendering(appState.user, { group, page: currentPage, wordsPerPage: 20 }).then((wordsData) => {
      // console.log(wordsData);
      wordsData.forEach(async (wordEl) => {
        words?.appendChild(
          await renderWord(
            {
              word: wordEl,
              onclick: renderCard,
              onDiffOrLearnedClick: checkIfPageLearned,
            },
            appState.user,
          ),
        );
      });
    });
  }
  if (group < 6) {
    renderWordsList(group);
  } else {
    group = 6;
    renderDifficultPage();
  }

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
    const gamesButton = template.querySelectorAll('.games__item');
    gamesButton.forEach((gameButton) => gameButton.addEventListener('click', playGame));
  }
  // Double call = to delete?
  // applyAuthentication(template.querySelector('.difficult') as HTMLElement, gamesEl, appState.user);

  const diffBtn = template.querySelector('.difficult') as HTMLButtonElement;
  diffBtn.addEventListener('click', () => {
    checkIfPageLearned();
    renderDifficultPage();
  });

  checkIfPageLearned();

  return template;
}
