import './game.scss';
import { getElement, createHTMLelement, IstateTextContentEn } from '../../utils/utils';
import { sprint, data } from '../../components/sprint/sprintApp';

export const viewGame = (stateTextContentEn:IstateTextContentEn) : HTMLElement => {
  const parent = getElement('.body');
  const gameSection = createHTMLelement('section', { id: 'game-section', class: 'game-section' }, parent);
  const gameWrapper = createHTMLelement('div', { class: 'game-wrapper' }, gameSection);
  const gameContent = createHTMLelement('div', { class: 'game-wrapper-content' }, gameWrapper);
  sprint(gameContent, data, stateTextContentEn);
  return gameSection;
};
