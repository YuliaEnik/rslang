import './sprint.scss';
import { createHTMLelement } from '../../utils/utils';
import { Word, StateTextContentEn } from '../../utils/types';
import { checkAnswer, updateCurIndex, setWords } from './init/init';
import { stateSprint } from './init/state';
import { createPics } from './init/pictures/pictures';
import { checkEnd } from './init/result/result';

export const sprint = (parent:Node, data: Word[], stateTextContentEn:StateTextContentEn): HTMLElement => {
  const arrayBtnEl:HTMLElement[] = [];
  const sprintWrapper = createHTMLelement('div', { class: 'sprint-wrapper' }, parent);
  const sprintContent = createHTMLelement('div', { class: 'sprint-content' }, sprintWrapper);
  const timerSoundWrap = createHTMLelement('div', { class: 'horizontal-wrap' }, sprintContent);
  const timer = createHTMLelement('div', { class: 'timer' }, timerSoundWrap, 'timer');
  const scoreWrap = createHTMLelement('div', { class: 'score' }, timerSoundWrap);
  const sound = createHTMLelement('div', { class: 'sound sound-on' }, timerSoundWrap);
  const answerPicturesWrap = createHTMLelement('div', { class: 'answ-pic-wrap' }, sprintContent);
  const wordWrapEn = createHTMLelement('div', { class: 'sprintWord' }, sprintContent);
  const wordWrapRu = createHTMLelement('div', { class: 'sprintWord' }, sprintContent);
  const btnContainer = createHTMLelement('div', { class: 'horizontal-wrap' }, sprintContent);
  const btnTrue = createHTMLelement('button',
    { class: 'button true', 'data-answ': String(stateSprint.trueAnsw) },
    btnContainer, stateTextContentEn.btnTrue);
  arrayBtnEl.push(btnTrue);
  const btnFalse = createHTMLelement('button',
    { class: 'button false', 'data-answ': String(stateSprint.falseAnsw) },
    btnContainer, stateTextContentEn.btnFalse);
  arrayBtnEl.push(btnFalse);
  arrayBtnEl.forEach((el) => {
    el.addEventListener(('click'), () => {
      checkAnswer(data, el, scoreWrap);
      createPics(stateSprint, data, answerPicturesWrap);
      updateCurIndex();
      setWords(data, wordWrapEn, wordWrapRu);
      checkEnd(data, stateSprint);
    });
  });
  setWords(data, wordWrapEn, wordWrapRu);
  return sprintWrapper;
};

export const data:Word[] = [
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
    correctAnswer: null,
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
    correctAnswer: null,
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
    correctAnswer: null,
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
    correctAnswer: null,
  },
  {
    id: 'string',
    group: 0,
    page: 0,
    word: 'end',
    image: 'string',
    audio: 'string',
    audioMeaning: 'string',
    audioExample: 'string',
    textMeaning: 'string',
    textExample: 'string',
    transcription: 'string',
    wordTranslate: 'конец',
    textMeaningTranslate: 'string',
    textExampleTranslate: 'string',
    correctAnswer: null,
  },
  {
    id: 'string',
    group: 0,
    page: 0,
    word: 'picture',
    image: 'string',
    audio: 'string',
    audioMeaning: 'string',
    audioExample: 'string',
    textMeaning: 'string',
    textExample: 'string',
    transcription: 'string',
    wordTranslate: 'картинка',
    textMeaningTranslate: 'string',
    textExampleTranslate: 'string',
    correctAnswer: null,
  },
  {
    id: 'string',
    group: 0,
    page: 0,
    word: 'red',
    image: 'string',
    audio: 'string',
    audioMeaning: 'string',
    audioExample: 'string',
    textMeaning: 'string',
    textExample: 'string',
    transcription: 'string',
    wordTranslate: 'красный',
    textMeaningTranslate: 'string',
    textExampleTranslate: 'string',
    correctAnswer: null,
  },
  {
    id: 'string',
    group: 0,
    page: 0,
    word: 'green',
    image: 'string',
    audio: 'string',
    audioMeaning: 'string',
    audioExample: 'string',
    textMeaning: 'string',
    textExample: 'string',
    transcription: 'string',
    wordTranslate: 'зеленый',
    textMeaningTranslate: 'string',
    textExampleTranslate: 'string',
    correctAnswer: null,
  },
  {
    id: 'string',
    group: 0,
    page: 0,
    word: 'around',
    image: 'string',
    audio: 'string',
    audioMeaning: 'string',
    audioExample: 'string',
    textMeaning: 'string',
    textExample: 'string',
    transcription: 'string',
    wordTranslate: 'вокруг',
    textMeaningTranslate: 'string',
    textExampleTranslate: 'string',
    correctAnswer: null,
  },
  {
    id: 'string',
    group: 0,
    page: 0,
    word: 'super',
    image: 'string',
    audio: 'string',
    audioMeaning: 'string',
    audioExample: 'string',
    textMeaning: 'string',
    textExample: 'string',
    transcription: 'string',
    wordTranslate: 'супер',
    textMeaningTranslate: 'string',
    textExampleTranslate: 'string',
    correctAnswer: null,
  },
];
