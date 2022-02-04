import html from './index.html';
import './style.scss';
import { renderWord } from './word';
import { renderWordCard } from './word-card';

export async function renderTextbook(): Promise<HTMLDivElement> {
  const template = document.createElement('div');
  template.innerHTML = html;
  const levelBtn = template.querySelectorAll('.level');
  const words = template.querySelector('.words') as HTMLElement;
  const wordCard = template.querySelector('.word-card') as HTMLElement;
  function renderCard() {
    wordCard.innerHTML = '';
    wordCard.appendChild(renderWordCard());
    wordCard.classList.add('active');
  }
  function renderWords() {
    for (let i = 0; i < 20; i++) {
      words?.appendChild(renderWord({ word: 'flower', onclick: () => { renderCard(); } }));
    }
  }
  // enderWords();
  levelBtn.forEach((el) => {
    el.addEventListener('click', () => {
      words.innerText = '';
      renderWords();
    });
  });
  async function getWords(): Promise<void> {
    const result = await fetch('http://localhost:3000/words/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await result.json();
    return data;
  }

  async function getApiWords() {
    const wordsData = await getWords();
    return wordsData;
  }

  const data = getApiWords();
  console.log(data);

  return template;
}

// interface Word {
//   'id': string;
//   'group': number;
//   'page': number;
//   'word': string;
//   'image': string;
//   'audio': string;
//   'audioMeaning': string;
//   'audioExample': string;
//   'textMeaning': string;
//   'textExample': string;
//   'transcription': string;
//   'textExampleTranslate': string;
//   'textMeaningTranslate': string;
//   'wordTranslate': string;
// }
