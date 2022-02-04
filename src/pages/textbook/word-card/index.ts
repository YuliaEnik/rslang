import html from './index.html';

export function renderWordCard(): HTMLDivElement {
  const template = document.createElement('div');
  template.innerHTML = html;
  return template.children[0] as HTMLDivElement;
}
