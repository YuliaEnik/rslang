import { appState } from '../app';
import {
  createUserWord,
  getAggregatedWords,
  getUserWord,
  getWords,
  saveUserWord,
} from './api';
import { calculateWordStatus } from './stat';
import {
  UserState,
  UserWord,
  UserWordAction,
  Word,
  WordFromAggregated,
} from './types';

export function convertWordFromAggregated(wordFromAggregated: WordFromAggregated): Word {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: wordFromAggregated._id,
    group: wordFromAggregated.group,
    page: wordFromAggregated.page,
    word: wordFromAggregated.word,
    image: wordFromAggregated.image,
    audio: wordFromAggregated.audio,
    audioMeaning: wordFromAggregated.audioMeaning,
    audioExample: wordFromAggregated.audioExample,
    textMeaning: wordFromAggregated.textMeaning,
    textExample: wordFromAggregated.textExample,
    transcription: wordFromAggregated.transcription,
    textExampleTranslate: wordFromAggregated.textExampleTranslate,
    textMeaningTranslate: wordFromAggregated.textMeaningTranslate,
    wordTranslate: wordFromAggregated.wordTranslate,
    correctAnswer: undefined,
    userWord: wordFromAggregated.userWord,
  };
}

export async function addWordToDifficultList(word: Word) {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));
  const result = await getUserWord(appState.user, word.id);
  if (!result) {
    const bodyUserWord = {} as UserWord;
    const updateUserWordStatusResult = calculateWordStatus(bodyUserWord, currentDate, UserWordAction.MADE_DIFFICULT);
    const response = await createUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
    return response;
  }
  const updateUserWordStatusResult = calculateWordStatus(result, currentDate, UserWordAction.MADE_DIFFICULT);
  const response = await saveUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
  return response;
}

export async function removeWordFromDifficult(word: Word) {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));
  const result = await getUserWord(appState.user, word.id);
  if (!result) {
    const bodyUserWord = {} as UserWord;
    const updateUserWordStatusResult = calculateWordStatus(bodyUserWord, currentDate, UserWordAction.MADE_NOT_DIFFICULT);
    const response = await createUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
    return response;
  }
  const updateUserWordStatusResult = calculateWordStatus(result, currentDate, UserWordAction.MADE_NOT_DIFFICULT);
  const response = await saveUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
  return response;
}

export async function getWordsForRendering(
  userState: UserState | null,
  req?: { group: number, page?: number },
): Promise<Word[]> {
  if (!userState?.userId) {
    const result = await getWords(req);
    return result;
  }
  const result = await getAggregatedWords(userState, req);
  const convertedWords = result[0].paginatedResults.map((el) => convertWordFromAggregated(el));
  return convertedWords;
}

export async function addWordToLearned(word: Word) {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));
  const result = await getUserWord(appState.user, word.id);
  if (!result) {
    const bodyUserWord = {} as UserWord;
    const updateUserWordStatusResult = calculateWordStatus(bodyUserWord, currentDate, UserWordAction.MADE_STUDIED);
    const response = await createUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
    return response;
  }
  const updateUserWordStatusResult = calculateWordStatus(result, currentDate, UserWordAction.MADE_STUDIED);
  const response = await saveUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
  return response;
}

export async function removeWordFromLearned(word: Word) {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));
  const result = await getUserWord(appState.user, word.id);
  if (!result) {
    const bodyUserWord = {} as UserWord;
    const updateUserWordStatusResult = calculateWordStatus(bodyUserWord, currentDate, UserWordAction.MADE_NOT_STUDIED);
    const response = await createUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
    return response;
  }
  const updateUserWordStatusResult = calculateWordStatus(result, currentDate, UserWordAction.MADE_NOT_STUDIED);
  const response = await saveUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
  return response;
}
