import { createHTMLelement } from '../../utils/utils';

export const createAnswerPicture = (parent: HTMLElement) => {
  const elem = createHTMLelement('div', { class: 'answerPic' }, parent);
  elem.style.backgroundImage = 'url(1.png)';
};
