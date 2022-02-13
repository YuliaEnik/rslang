import { StateTextContentEn, StateSprint } from './types';

export const API_ENDPOINT = 'http://localhost:3000';

export const stateTextContentEn: StateTextContentEn = {
  btnTrue: 'true',
  btnFalse: 'false',
  exit: 'exit',
};

export const stateSprint: StateSprint = {
  curIndex: 0,
  score: 0,
  countCorrectAnsw: 0,
  questionsArray: [],
  falseAnsw: 0,
  trueAnsw: 1,
  randomTrueFalse: null,
  max_sec: 60,
};
