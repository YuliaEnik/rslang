import { createElement } from '../../utils/utils';

export const buildMainPage = (): HTMLElement => {
  const result = createElement('h1', { class: 'title' });
  result.textContent = 'Main';
  return result;
};
