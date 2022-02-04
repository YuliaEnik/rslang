export const buildMainPage = (): HTMLElement => {
  const result = document.createElement('a');
  result.setAttribute('data-navigo', '');
  result.href = '/dictionary';
  result.textContent = 'Dictionary';
  return result;
};
