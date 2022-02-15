import { appState } from '../../../app';
import { loadUserFromLocalStorage } from '../../../services/auth/login';
import { createUserWord, getAggregatedWords, getUserWords } from '../../../utils/api';
import { API_ENDPOINT } from '../../../utils/constants';
import { addWordToDifficultList } from '../../../utils/operations';
import { AppState, UserState, Word } from '../../../utils/types';
import { createElement, getElement } from '../../../utils/utils';
import html from './index.html';
import './style.scss';

function appendUserButtons(wordElement: HTMLElement, appState: AppState) {
  if (appState.user?.userId) {
    const addToStudiedButton = createElement('button', { class: 'btn btn--studied' });
    const addToDifficultButton = createElement('button', { class: 'btn btn--difficult' });
    wordElement.appendChild(addToStudiedButton);
    wordElement.appendChild(addToDifficultButton);
  }
}

function showOrHideUserAttr(wordElement: HTMLElement, userState: UserState | null) {
  if (userState?.userId) {
    wordElement.classList.remove('hidden');
  }
}

function stopAudio(node: NodeListOf<Element>) {
  node.forEach((element) => {
    const audio = element as HTMLAudioElement;
    audio.pause();
  });
}

export function renderWord(params: { word: Word, onclick?: () => void }, userState: UserState | null): HTMLDivElement {
  const template = document.createElement('div');
  template.innerHTML = html;

  const wordElement = template.querySelector('.word__popup') as HTMLElement;
  wordElement?.addEventListener('click', () => {
    params.onclick?.();
  });
  const { word } = params;
  const engWord = word.word;
  const { transcription } = word;
  const translate = word.wordTranslate;
  const meaning = word.textMeaning;
  const meaningRus = word.textMeaningTranslate;
  const example = word.textExample;
  const exampleTranslate = word.textExampleTranslate;
  const audioWord = word.audio;
  const { audioMeaning } = word;
  const { audioExample } = word;

  const wordEngEl = template.querySelector('.word__eng') as HTMLParagraphElement;
  const transcriptionEl = template.querySelector('.word__transcription') as HTMLParagraphElement;
  const translationEl = template.querySelector('.word__translation') as HTMLParagraphElement;
  const imgEl = template.querySelector('.word__img') as HTMLImageElement;
  const meaningEl = template.querySelector('.word__phrase--eng') as HTMLParagraphElement;
  const meaningElRus = template.querySelector('.word__phrase--rus') as HTMLParagraphElement;
  const exampleEl = template.querySelector('.eng-phrase') as HTMLParagraphElement;
  const exampleRus = template.querySelector('.rus-phrase') as HTMLParagraphElement;
  const audioBtnElWord = template.querySelector('.audio-word-btn') as HTMLButtonElement;
  const audioBtnElMeaning = template.querySelector('.audio-meaning-btn') as HTMLButtonElement;
  const audioBtnElExample = template.querySelector('.audio-example-btn') as HTMLButtonElement;
  const audioElWord = template.querySelector('.audio-word') as HTMLAudioElement;
  const audioElMeaning = template.querySelector('.audio-meaning') as HTMLAudioElement;
  const audioElExample = template.querySelector('.audio-example') as HTMLAudioElement;

  wordEngEl.textContent = engWord;
  transcriptionEl.textContent = transcription;
  translationEl.textContent = translate;
  imgEl.src = `${API_ENDPOINT}/${word.image}`;
  meaningEl.innerHTML = meaning;
  meaningElRus.innerHTML = meaningRus;
  exampleEl.innerHTML = example;
  exampleRus.innerHTML = exampleTranslate;
  audioElWord.src = `${API_ENDPOINT}/${audioWord}`;
  audioElMeaning.src = `${API_ENDPOINT}/${audioMeaning}`;
  audioElExample.src = `${API_ENDPOINT}/${audioExample}`;

  function stopAllAudio() {
    stopAudio(document.querySelectorAll('.audio-word'));
    stopAudio(document.querySelectorAll('.audio-meaning'));
    stopAudio(document.querySelectorAll('.audio-example'));
  }

  audioBtnElWord.addEventListener('click', () => {
    stopAllAudio();
    audioElWord.play();
  });

  audioBtnElMeaning.addEventListener('click', () => {
    stopAllAudio();
    audioElMeaning.play();
  });

  audioBtnElExample.addEventListener('click', () => {
    stopAllAudio();
    audioElExample.play();
  });

  const cardColumn = template.querySelector('.column__header') as HTMLHeadElement;
  const wordStat = template.querySelector('.word_stat') as HTMLElement;
  appendUserButtons(cardColumn, appState);
  showOrHideUserAttr(wordStat, appState.user);

  if (userState?.userId) {
    const diffBtn = template.querySelector('.btn--difficult') as HTMLButtonElement;
    diffBtn.addEventListener('click', () => {
      diffBtn.classList.add('active');
      diffBtn.style.pointerEvents = 'none';
      addWordToDifficultList(word.id).then(() => {
        alert('Word added')
      });
      getUserWords(appState.user).then(async (wordsData) => {
        const result = await wordsData.json();
        console.log(result);
      });
      getAggregatedWords(appState.user, {
        group: appState.groupState.group,
        page: appState.groupState.pageNumber,
      }).then(async (wordsData) => {
        console.log(wordsData);
      });
    });
  }

  return template.children[0] as HTMLDivElement;
}
