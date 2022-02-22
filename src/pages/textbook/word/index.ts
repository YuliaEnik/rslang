import { appState } from '../../../app';
import { API_ENDPOINT } from '../../../utils/constants';
import {
  addWordToDifficult,
  addWordToLearned,
  removeWordFromDifficult,
  removeWordFromLearned,
} from '../../../utils/stat';
import { router } from '../../../utils/router';
import { UserState, Word } from '../../../utils/types';
import { createElement } from '../../../utils/utils';
import html from './index.html';
import './style.scss';

function appendUserButtons(wordElement: HTMLElement) {
  if (appState.user?.userId) {
    const addToStudiedButton = createElement('button', { class: 'btn btn--studied' });
    const addToDifficultButton = createElement('button', { class: 'btn btn--difficult' });
    wordElement.appendChild(addToStudiedButton);
    wordElement.appendChild(addToDifficultButton);
  }
}

function showOrHideUserAttr(wordElement: HTMLElement, userState: UserState | null) {
  if (userState?.userId) {
    wordElement.classList.remove('hidden');
  }
}

function stopAudio(node: NodeListOf<Element>) {
  node.forEach((element) => {
    const audio = element as HTMLAudioElement;
    audio.pause();
  });
}

async function clickOnDiffOrLearnedButton(
  button: HTMLButtonElement,
  difficultOption: string,
  word: Word,
  addHandler: (word: Word) => Promise<Response>,
  removeHandler: (word: Word) => Promise<Response>,
) {
  button.addEventListener('click', async () => {
    if (word.userWord?.difficulty !== difficultOption) {
      await addHandler(word);
      button.classList.add('active');
      router.reload();
    } else {
      await removeHandler(word);
      button.classList.remove('active');
      router.reload();
    }
  });

  if (word.userWord?.difficulty === difficultOption) {
    button.classList.add('active');
  }
}

export async function renderWord(
  params: {
    word: Word,
    onclick?: () => void,
    onDiffOrLearnedClick?: () => void,
  },
  userState: UserState | null,
): Promise<HTMLDivElement> {
  const template = document.createElement('div');
  template.innerHTML = html;
  const wordElement = template.querySelector('.word__popup') as HTMLElement;
  wordElement.classList.add(`level-${appState.groupState.group}`);
  // wordElement?.addEventListener('click', () => {
  //   params.onclick?.();
  // });
  const { word } = params;
  const engWord = word.word;
  const { transcription } = word;
  const translate = word.wordTranslate;
  const meaning = word.textMeaning;
  const meaningRus = word.textMeaningTranslate;
  const example = word.textExample;
  const exampleTranslate = word.textExampleTranslate;
  const audioWord = word.audio;
  const { audioMeaning } = word;
  const { audioExample } = word;

  const wordEngEl = template.querySelector('.word__eng') as HTMLParagraphElement;
  const transcriptionEl = template.querySelector('.word__transcription') as HTMLParagraphElement;
  const translationEl = template.querySelector('.word__translation') as HTMLParagraphElement;
  const imgEl = template.querySelector('.word__img') as HTMLImageElement;
  const meaningEl = template.querySelector('.word__phrase--eng') as HTMLParagraphElement;
  const meaningElRus = template.querySelector('.word__phrase--rus') as HTMLParagraphElement;
  const exampleEl = template.querySelector('.eng-phrase') as HTMLParagraphElement;
  const exampleRus = template.querySelector('.rus-phrase') as HTMLParagraphElement;
  const audioBtnElWord = template.querySelector('.audio-word-btn') as HTMLButtonElement;
  const audioBtnElMeaning = template.querySelector('.audio-meaning-btn') as HTMLButtonElement;
  const audioBtnElExample = template.querySelector('.audio-example-btn') as HTMLButtonElement;
  const audioElWord = template.querySelector('.audio-word') as HTMLAudioElement;
  const audioElMeaning = template.querySelector('.audio-meaning') as HTMLAudioElement;
  const audioElExample = template.querySelector('.audio-example') as HTMLAudioElement;
  const sprintCorrect = template.querySelector('.sprint-correct') as HTMLParagraphElement;
  const sprintWrong = template.querySelector('.sprint-wrong') as HTMLParagraphElement;
  const audioChallengeCorrect = template.querySelector('.audio-challenge-correct') as HTMLParagraphElement;
  const audioChallengeWrong = template.querySelector('.audio-challenge-wrong') as HTMLParagraphElement;
  const wordSpeakerImg = template.querySelector('.word__speaker') as HTMLDivElement;

  wordEngEl.textContent = engWord;
  transcriptionEl.textContent = transcription;
  translationEl.textContent = translate;
  imgEl.src = `${API_ENDPOINT}/${word.image}`;
  meaningEl.innerHTML = meaning;
  meaningElRus.innerHTML = meaningRus;
  exampleEl.innerHTML = example;
  exampleRus.innerHTML = exampleTranslate;
  audioElWord.src = `${API_ENDPOINT}/${audioWord}`;
  audioElMeaning.src = `${API_ENDPOINT}/${audioMeaning}`;
  audioElExample.src = `${API_ENDPOINT}/${audioExample}`;

  function stopAllAudio() {
    stopAudio(document.querySelectorAll('.audio-word'));
    stopAudio(document.querySelectorAll('.audio-meaning'));
    stopAudio(document.querySelectorAll('.audio-example'));
  }

  audioBtnElWord.addEventListener('click', () => {
    stopAllAudio();
    audioElWord.play();
  });

  audioBtnElMeaning.addEventListener('click', () => {
    stopAllAudio();
    audioElMeaning.play();
  });

  audioBtnElExample.addEventListener('click', () => {
    stopAllAudio();
    audioElExample.play();
  });

  const cardColumn = template.querySelector('.column__header') as HTMLHeadElement;
  const wordStat = template.querySelector('.word_stat') as HTMLElement;

  appendUserButtons(cardColumn);
  showOrHideUserAttr(wordStat, appState.user);

  if (userState?.userId) {
    const diffBtn = template.querySelector('.btn--difficult') as HTMLButtonElement;
    const learnedBtn = template.querySelector('.btn--studied') as HTMLButtonElement;
    diffBtn.addEventListener('click', () => {
      params.onDiffOrLearnedClick?.();
    });
    learnedBtn.addEventListener('click', () => {
      params.onDiffOrLearnedClick?.();
    });
    await clickOnDiffOrLearnedButton(
      diffBtn,
      'difficult',
      word,
      await addWordToDifficult,
      await removeWordFromDifficult,
    );
    await clickOnDiffOrLearnedButton(
      learnedBtn,
      'studied',
      word,
      await addWordToLearned,
      await removeWordFromLearned,
    );
    diffBtn.setAttribute('title', 'add to difficult words');
    if (diffBtn.classList.contains('active')) {
      diffBtn.setAttribute('title', 'remove from difficult words');
    }
    learnedBtn.setAttribute('title', 'mark as learned');
    if (learnedBtn.classList.contains('active')) {
      learnedBtn.setAttribute('title', 'remove from learned');
    }
  }

  // update game statistic elements

  function setTheText(
    value: number | undefined,
    htmlEl: HTMLParagraphElement,
  ) {
    if (!value) {
      htmlEl.innerText = '0';
    } else {
      htmlEl.innerText = String(value);
    }
  }

  const correctGameAnswerSprint = word.userWord?.optional?.games?.sprint?.correct;
  const wrongGameAnswerSprint = word.userWord?.optional?.games?.sprint?.wrong;
  const correctGameAnswerAudioChallenge = word.userWord?.optional?.games?.audioChallenge?.correct;
  const wrongGameAnswerAudioChallenge = word.userWord?.optional?.games?.audioChallenge?.wrong;
  setTheText(correctGameAnswerSprint, sprintCorrect);
  setTheText(wrongGameAnswerSprint, sprintWrong);
  setTheText(correctGameAnswerAudioChallenge, audioChallengeCorrect);
  setTheText(wrongGameAnswerAudioChallenge, audioChallengeWrong);

  // random word speaker img

  function getAndSetRandomImg() {
    const randomNumber = Math.floor(Math.random() * (8));
    wordSpeakerImg.style.backgroundImage = `url('img/smile/${randomNumber}.jpeg')`;
    // wordSpeakerImg.style.borderRadius = '50%';
    // wordSpeakerImg.style.width = '9rem';
    // wordSpeakerImg.style.height = '4rem';
    // wordSpeakerImg.style.backgroundPosition = 'center';
    // wordSpeakerImg.style.backgroundSize = 'cover';
    // wordSpeakerImg.style.backgroundRepeat = 'no-repeat';
  }

  getAndSetRandomImg();

  return template.children[0] as HTMLDivElement;
}
