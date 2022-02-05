import './game.scss';
import { getElement, createHTMLelement } from '../../utils/utils';
import { sprint, data } from '../../components/sprint/sprint';
import { StateTextContentEn } from '../../utils/types';

export const viewGame = (stateTextContentEn: StateTextContentEn) : HTMLElement => {
  const parent = getElement('div');
  const gameSection = createHTMLelement('section', { id: 'game-section', class: 'game-section' }, parent);
  const gameWrapper = createHTMLelement('div', { class: 'game-wrapper' }, gameSection);
  const gameContent = createHTMLelement('div', { class: 'game-wrapper-content' }, gameWrapper);
  const btnGameExt = createHTMLelement('div', { class: 'exit' }, gameWrapper, stateTextContentEn.exit);
  sprint(gameContent, data, stateTextContentEn);
  return gameSection;
};
