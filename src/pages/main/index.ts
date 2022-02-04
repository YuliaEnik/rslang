import { createElement } from '../../utils/utils';

export const buildMainPage = (): HTMLElement => {
  const result = createElement('h1');
  result.textContent = 'Main';
  return result;
};
