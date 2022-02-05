import { Word } from '../../../utils/types';
import html from './index.html';
import './style.scss';

export function renderWord(params: { word: Word, onclick?: () => void }): HTMLDivElement {
  const template = document.createElement('div');
  template.innerHTML = html;
  const wordElement = template.querySelector('.word') as HTMLElement;
  const word = params.word;
  wordElement?.addEventListener('click', () => {
    params.onclick?.();
  });
  const engWord = `Eng. word: ${word.word}`;
  const transcription = `Transcription: ${word.transcription}`;
  const translate = `Translate: ${word.wordTranslate}`;
  const meaning = `Meaning: ${word.textMeaning}`;
  const example = `Example: ${word.textExample}`;
  const exampleTranslate = `Example (rus): ${word.textExampleTranslate}`;
  wordElement.innerHTML = `${engWord} <br> ${transcription} <br> ${translate} <br> ${meaning} <br> ${example} 
  <br> ${exampleTranslate}`;

  return template.children[0] as HTMLDivElement;
}
