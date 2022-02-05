import { createElement } from '../../utils/utils';

export const buildDevelopersPage = (): HTMLElement => {
  const result = createElement('h1', { class: 'title' }, 'Developers');
  return result;
};
