import './result.scss';
import { Word, StateSprint } from '../../../../utils/types';
import { createHTMLelement, getElement } from '../../../../utils/utils';
import { stateSprint } from '../state';

const createResult = (stateSprint:StateSprint) => {
  const parent = getElement('.game-wrapper-content');
  const sprintWrapper = getElement('.sprint-wrapper') as HTMLElement;
  sprintWrapper?.remove();
  const resultWrapper = createHTMLelement('div', { class: 'sprint-wrapper' }, parent);
  const sprintContent = createHTMLelement('div', { class: 'sprint-content' }, resultWrapper);
  createHTMLelement('div', { class: 'sprintWord' }, sprintContent, 'Our congratulations');
  createHTMLelement('div', { class: 'sprintWord' }, sprintContent, `your score ${stateSprint.score}`);
  stateSprint.questionsArray.forEach((el) => {
    const wrap = createHTMLelement('div', { class: 'horizontal-wrap' }, sprintContent);
    createHTMLelement('div', { class: 'sprintWord' }, wrap, `${el.word}`);
    createHTMLelement('div', { class: 'sprintWord' }, wrap, `${el.wordTranslate}`);
    createHTMLelement('div', { class: 'sprintWord' }, wrap, `${el.correctAnswer ? 'V' : 'X'}`);
  });
};

const checkEnd = (data:Word[], stateSprint:StateSprint) => {
  if (stateSprint.curIndex === data.length - 1) {
    createResult(stateSprint);
  }
};

export {
  checkEnd,
};
