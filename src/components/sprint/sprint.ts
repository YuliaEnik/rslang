import './sprint.scss';
import { createHTMLelement } from '../../utils/utils';
import { createAnswerPicture } from './answerPic';
import { IData, StateTextContentEn } from '../../utils/types';

export const sprint = (parent:Node, data: IData[], stateTextContentEn: StateTextContentEn) => {
  const sprintWrapper = createHTMLelement('div', { class: 'sprint-wrapper' }, parent);
  const sprintContent = createHTMLelement('div', { class: 'sprint-content' }, sprintWrapper);
  const timerSoundWrap = createHTMLelement('div', { class: 'horizontal-wrap' }, sprintContent);
  const timer = createHTMLelement('div', { class: 'timer' }, timerSoundWrap, 'timer');
  const score = createHTMLelement('div', { class: 'score' }, timerSoundWrap, 'score');
  const sound = createHTMLelement('div', { class: 'sound sound-on' }, timerSoundWrap);
  const answerPicturesWrap = createHTMLelement('div', { class: 'answ-pic-wrap' }, sprintContent);
  for (let i = 0; i < 3; i++) {
    createAnswerPicture(answerPicturesWrap);
  }
  const wordEn = createHTMLelement('div', { class: 'sprintWord' }, sprintContent, data[0].word);
  const wordRu = createHTMLelement('div', { class: 'sprintWord' }, sprintContent, data[0].wordTranslate);
  const btnContainer = createHTMLelement('div', { class: 'horizontal-wrap' }, sprintContent);
  const btnTrue = createHTMLelement('div', { class: 'button true' }, btnContainer, stateTextContentEn.btnTrue);
  const btnFalse = createHTMLelement('div', { class: 'button false' }, btnContainer, stateTextContentEn.btnFalse);
};

export const data:IData[] = [
  {
    id: 'string',
    group: 0,
    page: 0,
    word: 'table',
    image: 'string',
    audio: 'string',
    audioMeaning: 'string',
    audioExample: 'string',
    textMeaning: 'string',
    textExample: 'string',
    transcription: 'string',
    wordTranslate: 'стол',
    textMeaningTranslate: 'string',
    textExampleTranslate: 'string',
  },
  {
    id: 'string',
    group: 0,
    page: 0,
    word: 'window',
    image: 'string',
    audio: 'string',
    audioMeaning: 'string',
    audioExample: 'string',
    textMeaning: 'string',
    textExample: 'string',
    transcription: 'string',
    wordTranslate: 'окно',
    textMeaningTranslate: 'string',
    textExampleTranslate: 'string',
  },
  {
    id: 'string',
    group: 0,
    page: 0,
    word: 'cat',
    image: 'string',
    audio: 'string',
    audioMeaning: 'string',
    audioExample: 'string',
    textMeaning: 'string',
    textExample: 'string',
    transcription: 'string',
    wordTranslate: 'кот',
    textMeaningTranslate: 'string',
    textExampleTranslate: 'string',
  },
  {
    id: 'string',
    group: 0,
    page: 0,
    word: 'start',
    image: 'string',
    audio: 'string',
    audioMeaning: 'string',
    audioExample: 'string',
    textMeaning: 'string',
    textExample: 'string',
    transcription: 'string',
    wordTranslate: 'старт',
    textMeaningTranslate: 'string',
    textExampleTranslate: 'string',
  },
];
