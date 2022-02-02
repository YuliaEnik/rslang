import './style.scss';
import { renderTextbook } from './textbook';

function goToTextBook(): void {
  document.body.innerHTML = '';
  document.body.appendChild(renderTextbook());
}

goToTextBook();
