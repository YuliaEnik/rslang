import './style.scss';
import { appState, runApp } from './app';
import { getWord, updateWord } from './utils/api';

runApp();
// console.log(getWord(appState.user, '5e9f5ee35eb9e72bc21af4b4'));
// console.log(updateWord(appState.user, '5e9f5ee35eb9e72bc21af4b4', { difficulty: 'difficult', optional: {isLearned: false} }, 'PUT'));
