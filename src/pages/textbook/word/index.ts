import html from './index.html';
import './style.scss';

export function renderWord(params: { word: string, onclick?: () => void }): HTMLDivElement {
  const template = document.createElement('div');
  template.innerHTML = html;
  const word = template.querySelector('.word');
  word?.addEventListener('click', () => {
    params.onclick?.();
  });
  return template.children[0] as HTMLDivElement;
}
