import { createHTMLelement } from '../../../utils/utils';

const createAudio = (parent: HTMLElement) => {
  const audio = createHTMLelement('Audio', { class: 'volume' }, parent);
  return audio;
};

const right = 'right';
const wrong = 'wrong';

const playSound = (answer: string) => {
  const audio = document.querySelector('.volume') as HTMLAudioElement;
  if (!audio) return;
  audio.setAttribute('src', `sounds/${answer}.mp3`);
  audio.currentTime = 0;
  audio.play();
};

export {
  createAudio,
  playSound,
  right,
  wrong,
};
