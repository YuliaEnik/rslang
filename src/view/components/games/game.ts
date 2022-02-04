import './game.scss';
import { getElement, createHTMLelement, IstateTextContentEn } from '../../../utils/utils';
import { sprint, data } from '../sprint/sprint';

export const viewGame = (stateTextContentEn:IstateTextContentEn) => {
  const parent = getElement('.body');
  const gameSection = createHTMLelement('section', { id: 'game-section', class: 'game-section' }, parent);
  const gameWrapper = createHTMLelement('div', { class: 'game-wrapper' }, gameSection);
  const gameContent = createHTMLelement('div', { class: 'game-wrapper-content' }, gameWrapper);
  const btnGameExt = createHTMLelement('div', { class: 'exit' }, gameWrapper, stateTextContentEn.exit);
  sprint(gameContent, data, stateTextContentEn);
}
