import { createElement } from '../../utils/utils';

export const buildSettingsPage = (): HTMLElement => {
  const result = createElement('h1', { class: '' });
  result.textContent = 'Main';
  return result;
};
