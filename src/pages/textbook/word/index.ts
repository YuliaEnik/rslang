import { API_ENDPOINT } from '../../../utils/constants';
import { Word } from '../../../utils/types';
import html from './index.html';
import './style.scss';

export function renderWord(params: { word: Word, onclick?: () => void }): HTMLDivElement {
  const template = document.createElement('div');
  template.innerHTML = html;
  const wordElement = template.querySelector('.word') as HTMLElement;
  const { word } = params;
  // const wordImgEl = template.querySelector('.word-img') as HTMLImageElement;
  wordElement?.addEventListener('click', () => {
    params.onclick?.();
  });
  const engWord = `Eng. word: ${word.word}`;
  const transcription = `Transcription: ${word.transcription}`;
  const translate = `Translate: ${word.wordTranslate}`;
  const meaning = `Meaning: ${word.textMeaning}`;
  const example = `Example: ${word.textExample}`;
  const exampleTranslate = `Example (rus): ${word.textExampleTranslate}`;
  const img = `${API_ENDPOINT}/${word.image}`;
  wordElement.innerHTML = `${engWord} <br> ${transcription} <br> ${translate} <br> ${meaning} <br> ${example} 
  <br> ${exampleTranslate}`;
  const imgEl = document.createElement('img') as HTMLImageElement;
  imgEl.src = img;
  wordElement.appendChild(imgEl);
  const audioEl = document.createElement('audio') as HTMLAudioElement;
  const audioButton = document.createElement('button') as HTMLButtonElement;
  audioButton.classList.add('audio-btn');
  audioButton.textContent = '🔊';
  const audio = `${API_ENDPOINT}/${word.audioMeaning}`;
  wordElement.appendChild(audioButton);
  audioButton.appendChild(audioEl);
  audioEl.src = audio;
  template.querySelectorAll('.audio-btn').forEach((el) => {
    el.addEventListener('click', () => {
      audioEl.play();
    });
  });
  return template.children[0] as HTMLDivElement;
}
