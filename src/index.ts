import './style.scss';
import { renderTextbook } from './textbook';

function goToTextBook(): void {
  document.body.innerHTML = '';
  document.body.appendChild(renderTextbook());
}

const textbookPageBtn = document.querySelector('.go-to-textbook');
textbookPageBtn?.addEventListener('click', () => {
  goToTextBook();
});

// goToTextBook();
