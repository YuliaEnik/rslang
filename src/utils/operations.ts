import { appState } from '../app';
import { createUserWord, getWord, updateUserWord } from './api';
import { UserState, UserWord } from './types';

export function addWordToDifficultList(wordId: string) {
  return createUserWord(appState.user, wordId, { difficulty: 'difficult' });
}

export async function addGameResult(userState: UserState | null, wordId: string, body: UserWord) {
  const result = await getWord(userState, wordId);
  if (!result.ok) {
    createUserWord(appState.user, wordId, body);
  } else if (result.ok) {
    updateUserWord(appState.user, wordId, body);
  }
}
