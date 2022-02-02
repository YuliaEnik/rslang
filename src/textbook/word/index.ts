import html from './index.html';
import './style.css';

export function renderWord(): HTMLDivElement {
  const template = document.createElement('div');
  template.innerHTML = html;
  return template.children[0] as HTMLDivElement;
}
