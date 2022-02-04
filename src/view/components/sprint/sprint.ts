import './sprint.scss';
import { createElement, renderElement, getElement, getElements, createHTMLelement, stateTextContentEn, IstateTextContentEn } from '../../../utils/utils';


export const sprint = (parent:Node, data: IData[], stateTextContentEn:IstateTextContentEn ): void => {
  const sprintWrapper = createHTMLelement('div', { class: 'sprint-wrapper' }, parent);
  const sprintContent = createHTMLelement('div', { class: 'sprint-content' }, sprintWrapper);
  const timerSoundWrap = createHTMLelement('div', { class: 'horizontal-wrap' }, sprintContent);
  const timer = createHTMLelement('div', { class: 'timer' }, timerSoundWrap, 'timer');
  const score = createHTMLelement('div', { class: 'score' }, timerSoundWrap, 'score');
  const sound = createHTMLelement('div', { class: 'sound sound-on' }, timerSoundWrap);
  const answerPicturesWrap = createHTMLelement('div', { class: 'answ-pic-wrap' }, sprintContent);
  for (let i = 0; i < 3; i++) {
    createAnswerPicture();
  }
  const wordEn = createHTMLelement('div', { class: 'word' }, sprintContent, data[0].word);
  const wordRu = createHTMLelement('div', { class: 'word' }, sprintContent, data[0].wordTranslate);
  const btnContainer = createHTMLelement('div', { class: 'horizontal-wrap' }, sprintContent);
  const btnTrue = createHTMLelement('div', { class: 'button true' }, btnContainer, stateTextContentEn.btnTrue);
  const btnFalse = createHTMLelement('div', { class: 'button false' }, btnContainer, stateTextContentEn.btnFalse);
}


const createAnswerPicture = (): void => {
  const parent = getElement('.answ-pic-wrap');
  const elem = createHTMLelement('div', { class: 'answerPic' }, parent) as HTMLElement;
  elem.style.backgroundImage = `url(1.png)`;
}

export let data:IData[]  = [
  {
    id: "string",
    group: 0,
    page: 0,
    word: "table",
    image: "string",
    audio: "string",
    audioMeaning: "string",
    audioExample: "string",
    textMeaning: "string",
    textExample: "string",
    transcription: "string",
    wordTranslate: "стол",
    textMeaningTranslate: "string",
    textExampleTranslate: "string"
  },
  {
    id: "string",
    group: 0,
    page: 0,
    word: "window",
    image: "string",
    audio: "string",
    audioMeaning: "string",
    audioExample: "string",
    textMeaning: "string",
    textExample: "string",
    transcription: "string",
    wordTranslate: "окно",
    textMeaningTranslate: "string",
    textExampleTranslate: "string"
  },
  {
    id: "string",
    group: 0,
    page: 0,
    word: "cat",
    image: "string",
    audio: "string",
    audioMeaning: "string",
    audioExample: "string",
    textMeaning: "string",
    textExample: "string",
    transcription: "string",
    wordTranslate: "кот",
    textMeaningTranslate: "string",
    textExampleTranslate: "string"
  },
  {
    id: "string",
    group: 0,
    page: 0,
    word: "start",
    image: "string",
    audio: "string",
    audioMeaning: "string",
    audioExample: "string",
    textMeaning: "string",
    textExample: "string",
    transcription: "string",
    wordTranslate: "старт",
    textMeaningTranslate: "string",
    textExampleTranslate: "string"
  }
]

interface IData {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}
