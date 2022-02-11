import { API_ENDPOINT } from '../../../utils/constants';
import { UserState, Word } from '../../../utils/types';
import { createElement } from '../../../utils/utils';
import html from './index.html';
import './style.scss';

function appendUserButtons(wordElement: HTMLElement, userState: UserState | null) {
  if (userState?.userId) {
    // TODO: add classes and eventListeners
    const addToStudiedButton = createElement('button', {});
    wordElement.appendChild(addToStudiedButton);

    const addToDifficultButton = createElement('button', {});
    wordElement.appendChild(addToDifficultButton);
  }
}

export function renderWord(params: { word: Word, onclick?: () => void }, userState: UserState | null): HTMLDivElement {
  const template = document.createElement('div');
  template.innerHTML = html;

  const wordElement = template.querySelector('.word') as HTMLElement;
  // const wordImgEl = template.querySelector('.word-img') as HTMLImageElement;
  wordElement?.addEventListener('click', () => {
    params.onclick?.();
  });

  const { word } = params;
  const engWord = `Word: ${word.word}`;
  const transcription = `Transcription: ${word.transcription}`;
  const translate = `Translate: ${word.wordTranslate}`;
  const meaning = `Meaning: ${word.textMeaning}`;
  const example = `Example: ${word.textExample}`;
  const exampleTranslate = `Example (rus): ${word.textExampleTranslate}`;

  wordElement.innerHTML = `${engWord} <br> ${transcription} <br> ${translate} <br> ${meaning} <br> ${example}
  <br> ${exampleTranslate}`;

  const imgEl = document.createElement('img') as HTMLImageElement;
  const img = `${API_ENDPOINT}/${word.image}`;
  imgEl.src = img;
  wordElement.appendChild(imgEl);

  const audioEl = document.createElement('audio') as HTMLAudioElement;
  const audio = `${API_ENDPOINT}/${word.audioMeaning}`;
  audioEl.src = audio;

  const audioButton = document.createElement('button') as HTMLButtonElement;
  audioButton.classList.add('audio-btn');
  audioButton.textContent = '🔊';
  audioButton.appendChild(audioEl);

  wordElement.appendChild(audioButton);

  template.querySelectorAll('.audio-btn').forEach((el) => {
    el.addEventListener('click', () => {
      audioEl.play();
    });
  });

  appendUserButtons(wordElement, userState);

  return template.children[0] as HTMLDivElement;
}
