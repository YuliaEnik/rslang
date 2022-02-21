import { createHTMLelement } from '../../../utils/utils';

const createAudio = (parent: HTMLElement) => {
  const audio = createHTMLelement('Audio', { class: 'volume' }, parent) as HTMLAudioElement;
  audio.muted = false;
  return audio;
};

const right = 'right';
const wrong = 'wrong';

const playSound = (answer: string) => {
  const audio = document.querySelector('.volume') as HTMLAudioElement;
  if (!audio) return;
  audio.setAttribute('src', `sounds/${answer}.mp3`);
  audio.currentTime = 0;
  audio.volume = 0.4;
  audio.play();
  audio.volume = 0.15;
};

const muteSound = (el:HTMLElement) => {
  const audio = document.querySelector('.volume') as HTMLAudioElement;
  if (audio.muted === true) {
    el.classList.add('sound-on');
    el.classList.remove('sound-off');
    audio.muted = false;
    return;
  }
  el.classList.add('sound-off');
  el.classList.remove('sound-on');
  audio.muted = true;
};

export {
  createAudio,
  playSound,
  muteSound,
  right,
  wrong,
};
