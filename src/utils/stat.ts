import { appState } from '../app';
import {
  createUserWord,
  getUserWord,
  saveUserWord,
  getUserStatistics,
  saveUserStatistics,
} from './api';
import { stateAudioG, stateSprint } from './constants';
import {
  GamesStat,
  GameStat,
  WordGameStatistics,
  UserState,
  UserStatistics,
  UserWord,
  UserWordAction,
  UserWordOptional,
  UserWordOptionalGames,
  UpdateUserWordStatisticsResult,
  UpdateUserWordStatusResult,
  UserStatisticsOptional,
  Word,
} from './types';

function calculateAnsweredCorrectly(userWord: UserWord, currentDate: string): UpdateUserWordStatusResult {
  if (userWord.difficulty === 'default' && userWord.optional.correctAnswers < 2) {
    userWord.optional.correctAnswers++;
    userWord.optional.correctAnswersLastUpdate = currentDate;
    return { userWord, justBecameStudied: false, justRemovedFromStudied: false };
  }

  if (userWord.difficulty === 'default' && userWord.optional.correctAnswers === 2) {
    userWord.optional.correctAnswers++;
    userWord.optional.correctAnswersLastUpdate = currentDate;
    userWord.difficulty = 'studied';
    return { userWord, justBecameStudied: true, justRemovedFromStudied: false };
  }

  if (userWord.difficulty === 'difficult' && userWord.optional.correctAnswers < 4) {
    userWord.optional.correctAnswers++;
    userWord.optional.correctAnswersLastUpdate = currentDate;
    return { userWord, justBecameStudied: false, justRemovedFromStudied: false };
  }

  if (userWord.difficulty === 'difficult' && userWord.optional.correctAnswers === 4) {
    userWord.optional.correctAnswers++;
    userWord.optional.correctAnswersLastUpdate = currentDate;
    userWord.difficulty = 'studied';
    return { userWord, justBecameStudied: true, justRemovedFromStudied: false };
  }

  return { userWord, justBecameStudied: false, justRemovedFromStudied: false };
}

function calculateAnsweredWrongly(userWord: UserWord, currentDate: string): UpdateUserWordStatusResult {
  if (userWord.difficulty === 'default' && userWord.optional.correctAnswers <= 2) {
    userWord.optional.correctAnswers = 0;
    userWord.optional.correctAnswersLastUpdate = currentDate;
    return { userWord, justBecameStudied: false, justRemovedFromStudied: false };
  }

  if (userWord.difficulty === 'difficult' && userWord.optional.correctAnswers <= 4) {
    userWord.optional.correctAnswers = 0;
    userWord.optional.correctAnswersLastUpdate = currentDate;
    return { userWord, justBecameStudied: false, justRemovedFromStudied: false };
  }

  if (userWord.difficulty === 'studied') {
    userWord.difficulty = 'default';
    userWord.optional.correctAnswers = 0;
    userWord.optional.correctAnswersLastUpdate = currentDate;
    return { userWord, justBecameStudied: false, justRemovedFromStudied: true };
  }

  return { userWord, justBecameStudied: false, justRemovedFromStudied: false };
}

function calculateMarkedDifficult(userWord: UserWord, currentDate: string): UpdateUserWordStatusResult {
  if (userWord.difficulty === 'default') {
    userWord.difficulty = 'difficult';
    userWord.optional.correctAnswers = 0;
    userWord.optional.correctAnswersLastUpdate = currentDate;
    return { userWord, justBecameStudied: false, justRemovedFromStudied: false };
  }

  if (userWord.difficulty === 'studied') {
    userWord.difficulty = 'difficult';
    userWord.optional.correctAnswers = 0;
    userWord.optional.correctAnswersLastUpdate = currentDate;
    return { userWord, justBecameStudied: false, justRemovedFromStudied: true };
  }

  return { userWord, justBecameStudied: false, justRemovedFromStudied: false };
}

function calculateRemovedDifficult(userWord: UserWord, currentDate: string): UpdateUserWordStatusResult {
  if (userWord.optional.correctAnswers > 3) {
    userWord.difficulty = 'studied';
    userWord.optional.correctAnswersLastUpdate = currentDate;
    return { userWord, justBecameStudied: true, justRemovedFromStudied: false };
  }

  userWord.difficulty = 'default';
  userWord.optional.correctAnswersLastUpdate = currentDate;
  return { userWord, justBecameStudied: false, justRemovedFromStudied: false };
}

function calculateMarkedStudied(userWord: UserWord, currentDate: string): UpdateUserWordStatusResult {
  if (userWord.difficulty === 'default') {
    userWord.difficulty = 'studied';
    userWord.optional.correctAnswers = 3;
    userWord.optional.correctAnswersLastUpdate = currentDate;
    return { userWord, justBecameStudied: true, justRemovedFromStudied: false };
  }

  if (userWord.difficulty === 'difficult') {
    userWord.difficulty = 'studied';
    userWord.optional.correctAnswers = 5;
    userWord.optional.correctAnswersLastUpdate = currentDate;
    return { userWord, justBecameStudied: true, justRemovedFromStudied: false };
  }

  return { userWord, justBecameStudied: false, justRemovedFromStudied: false };
}

function calculateRemovedStudied(userWord: UserWord, currentDate: string): UpdateUserWordStatusResult {
  userWord.difficulty = 'default';
  userWord.optional.correctAnswers = 0;
  userWord.optional.correctAnswersLastUpdate = currentDate;
  return { userWord, justBecameStudied: false, justRemovedFromStudied: true };
}

export function calculateWordStatus(
  userWord: UserWord,
  currentDate:
  string,
  userWordAction: UserWordAction,
): UpdateUserWordStatusResult {
  userWord.difficulty = userWord.difficulty || 'default';
  userWord.optional = userWord.optional || {} as UserWordOptional;
  userWord.optional.correctAnswers = userWord.optional.correctAnswers || 0;
  userWord.optional.correctAnswersLastUpdate = currentDate;

  switch (userWordAction) {
    case UserWordAction.ANSWERED_CORRECTLY: {
      return calculateAnsweredCorrectly(userWord, currentDate);
    }
    case UserWordAction.ANSWERED_WRONGLY: {
      return calculateAnsweredWrongly(userWord, currentDate);
    }
    case UserWordAction.MADE_DIFFICULT: {
      return calculateMarkedDifficult(userWord, currentDate);
    }
    case UserWordAction.MADE_NOT_DIFFICULT: {
      return calculateRemovedDifficult(userWord, currentDate);
    }
    case UserWordAction.MADE_STUDIED: {
      return calculateMarkedStudied(userWord, currentDate);
    }
    case UserWordAction.MADE_NOT_STUDIED: {
      return calculateRemovedStudied(userWord, currentDate);
    }
    default:
      console.warn(`Unexpected userWordAction '${userWordAction}'`);
      return { userWord, justBecameStudied: false, justRemovedFromStudied: false };
  }
}

function initializeUserWord(userWordAction: UserWordAction, game: string, currentDate: string): UserWord {
  const userWord = {} as UserWord;
  userWord.difficulty = 'default';
  userWord.optional = {} as UserWordOptional;
  userWord.optional.correctAnswers = userWordAction === UserWordAction.ANSWERED_CORRECTLY ? 1 : 0;
  userWord.optional.correctAnswersLastUpdate = currentDate;
  userWord.optional.games = {} as UserWordOptionalGames;
  userWord.optional.games[game] = {} as WordGameStatistics;
  userWord.optional.games[game].correct = userWordAction === UserWordAction.ANSWERED_CORRECTLY ? 1 : 0;
  userWord.optional.games[game].wrong = userWordAction !== UserWordAction.ANSWERED_CORRECTLY ? 1 : 0;

  return userWord;
}

export function calculateNewWords(userStatistics: UserStatistics, currentDate: string, game: string) {
  if (userStatistics.optional?.games?.[game]?.newWordsGame
    && userStatistics.optional?.games?.[game]?.newWordsGameLastUpdate) {
    if (currentDate !== userStatistics.optional.games?.[game].newWordsGameLastUpdate) {
      userStatistics.optional.games[game].newWordsGameLastUpdate = currentDate;
      userStatistics.optional.games[game].newWordsGame = 1;
    }
    if (currentDate === userStatistics.optional?.games?.[game].newWordsGameLastUpdate) {
      userStatistics.optional.games[game].newWordsGame++;
    }
  } else {
    userStatistics.optional = userStatistics.optional || {};
    userStatistics.optional.games = userStatistics.optional.games || {} as GamesStat;

    const gameStat = userStatistics.optional.games[game] || {} as GameStat;
    gameStat.newWordsGame = 1;
    gameStat.newWordsGameLastUpdate = currentDate;

    userStatistics.optional.games[game] = gameStat;
  }

  return userStatistics;
}

export function calculateUserWordStatistics(
  userWord: UserWord,
  userWordAction: UserWordAction,
  game: string,
  currentDate: string,
): UpdateUserWordStatusResult {
  userWord.optional = userWord.optional || {} as UserWordOptional;
  userWord.optional.games = userWord.optional.games || {} as UserWordOptionalGames;
  userWord.optional.games[game] = userWord.optional.games[game] || ({
    correct: 0,
    wrong: 0,
  });
  userWord.optional.wordLastUpdate = currentDate;

  const updateUserWordStatusResult = calculateWordStatus(userWord, currentDate, userWordAction);

  if (userWordAction === UserWordAction.ANSWERED_CORRECTLY) {
    updateUserWordStatusResult.userWord.optional.games[game].correct++;
  } else if (userWordAction === UserWordAction.ANSWERED_WRONGLY) {
    updateUserWordStatusResult.userWord.optional.games[game].wrong++;
  } else {
    console.warn(`Unexpected userWordAction '${userWordAction}'`);
  }

  return updateUserWordStatusResult;
}

function calculateLearnedWords(
  currentDate: string,
  userStatistics: UserStatistics,
  updateUserWordStatisticsResult: UpdateUserWordStatisticsResult,
  wordCorrectAnswerLastUpdate: string,
) {
  if (updateUserWordStatisticsResult.justBecameStudied) {
    if (userStatistics.optional?.learnedWordsLastUpdate === currentDate) {
      userStatistics.learnedWords++;
    } else {
      userStatistics.learnedWords = 1;
    }
    userStatistics.optional = userStatistics.optional || {} as UserStatisticsOptional;
    userStatistics.optional.learnedWordsLastUpdate = currentDate;
  }

  if (updateUserWordStatisticsResult.justRemovedFromStudied) {
    if (wordCorrectAnswerLastUpdate === currentDate) {
      userStatistics.learnedWords--;
      userStatistics.optional = userStatistics.optional ? userStatistics.optional : {} as UserStatisticsOptional;
      userStatistics.optional.learnedWordsLastUpdate = currentDate;
    }
  }

  return userStatistics;
}

function calculateBestStreak(game: string, date: string, userStatistics: UserStatistics) {
  if (game === 'sprint') {
    if (userStatistics.optional?.games?.[game]) {
      if (date === userStatistics.optional.games[game].streakLastUpdate
        && stateSprint.currentStreak >= userStatistics.optional.games[game].bestStreak) {
        userStatistics.optional.games[game].bestStreak = stateSprint.currentStreak;
        userStatistics.optional.games[game].streakLastUpdate = date;
      } else if (date !== userStatistics.optional.games[game].streakLastUpdate) {
        userStatistics.optional.games[game].bestStreak = stateSprint.currentStreak;
        userStatistics.optional.games[game].streakLastUpdate = date;
      }
    }
  }

  if (game === 'audioChallenge') {
    if (userStatistics.optional?.games?.[game]) {
      if (date === userStatistics.optional.games[game].streakLastUpdate
        && stateAudioG.currentStreak >= userStatistics.optional.games[game].bestStreak) {
        userStatistics.optional.games[game].bestStreak = stateAudioG.currentStreak;
        userStatistics.optional.games[game].streakLastUpdate = date;
      } else if (date !== userStatistics.optional.games[game].streakLastUpdate) {
        userStatistics.optional.games[game].bestStreak = stateAudioG.currentStreak;
        userStatistics.optional.games[game].streakLastUpdate = date;
      }
    }
  }
  return userStatistics;
}

function calculateStreak(
  game: string,
  userWordAction: UserWordAction,
  currentDate: string,
  userStatistics: UserStatistics,
) {
  if (userWordAction === UserWordAction.ANSWERED_CORRECTLY) {
    if (userStatistics.optional?.games?.[game]) {
      if (currentDate === userStatistics.optional.games[game].streakLastUpdate) {
        if (game === 'sprint') {
          stateSprint.currentStreak += 1;
        }

        if (game === 'audioChallenge') {
          stateAudioG.currentStreak += 1;
        }
      } else if (currentDate !== userStatistics.optional.games[game].streakLastUpdate
        || userStatistics.optional.games[game].streakLastUpdate === 'undefined') {
        if (game === 'sprint') {
          stateSprint.currentStreak = 1;
        }

        if (game === 'audioChallenge') {
          stateAudioG.currentStreak += 1;
        }
      }
    }
  } else if (userWordAction === UserWordAction.ANSWERED_WRONGLY) {
    if (userStatistics.optional?.games?.[game]) {
      if (game === 'sprint') {
        if (currentDate === userStatistics.optional.games[game].streakLastUpdate) {
          if (stateSprint.currentStreak
            > userStatistics.optional.games[game].bestStreak) {
            stateSprint.currentStreak = 0;
            userStatistics.optional.games[game].bestStreak = stateSprint.currentStreak;
            userStatistics.optional.games[game].streakLastUpdate = currentDate;
          }
        } else if (currentDate !== userStatistics.optional.games[game].streakLastUpdate) {
          userStatistics.optional.games[game].bestStreak = 0;
          stateSprint.currentStreak = 0;
          userStatistics.optional.games[game].streakLastUpdate = currentDate;
        }
      }

      if (game === 'audioChallenge') {
        if (currentDate === userStatistics.optional.games[game].streakLastUpdate) {
          if (stateAudioG.currentStreak
            > userStatistics.optional.games[game].bestStreak) {
            stateAudioG.currentStreak = 0;
            userStatistics.optional.games[game].bestStreak = stateAudioG.currentStreak;
            userStatistics.optional.games[game].streakLastUpdate = currentDate;
          }
        } else if (currentDate !== userStatistics.optional.games[game].streakLastUpdate) {
          userStatistics.optional.games[game].bestStreak = 0;
          stateAudioG.currentStreak = 0;
          userStatistics.optional.games[game].streakLastUpdate = currentDate;
        }
      }
    } else {
      userStatistics.optional = userStatistics.optional || {};
      userStatistics.optional.games = userStatistics.optional.games || {} as GamesStat;

      const gameStat = userStatistics.optional.games[game] || {} as GameStat;

      if (game === 'sprint') {
        gameStat.bestStreak = stateSprint.currentStreak;
      }

      if (game === 'audioChallenge') {
        gameStat.bestStreak = stateAudioG.currentStreak;
      }
      gameStat.currentStreak = 0;
      gameStat.streakLastUpdate = currentDate;

      userStatistics.optional.games[game] = gameStat;
    }
  } else {
    console.warn(`Unexpected userWordAction '${userWordAction}'`);
  }

  const updatedUserStatistics = calculateBestStreak(game, currentDate, userStatistics);
  return updatedUserStatistics;
}

function calculateGameStatistics(
  game: string,
  userWordAction: UserWordAction,
  currentDate: string,
  currentUserStatistics: UserStatistics,
) {
  if (currentUserStatistics.optional?.games?.[game]) {
    if (currentDate === currentUserStatistics.optional.games[game].gameLastUpdate) {
      if (userWordAction === UserWordAction.ANSWERED_CORRECTLY) {
        currentUserStatistics.optional.games[game].correct++;
        currentUserStatistics.optional.games[game].gameLastUpdate = currentDate;
      } else {
        currentUserStatistics.optional.games[game].wrong++;
        currentUserStatistics.optional.games[game].gameLastUpdate = currentDate;
      }
    } else if (currentDate !== currentUserStatistics.optional.games[game].gameLastUpdate
    || currentUserStatistics.optional.games[game].gameLastUpdate === 'undefined') {
      currentUserStatistics.optional.games[game].correct = userWordAction === UserWordAction.ANSWERED_CORRECTLY ? 1 : 0;
      currentUserStatistics.optional.games[game].wrong = userWordAction !== UserWordAction.ANSWERED_CORRECTLY ? 0 : 1;
      currentUserStatistics.optional.games[game].gameLastUpdate = currentDate;
    }
  } else {
    currentUserStatistics.optional = currentUserStatistics.optional || {};
    currentUserStatistics.optional.games = currentUserStatistics.optional.games || {} as GamesStat;

    const gameStat = currentUserStatistics.optional.games[game] || {} as GameStat;
    gameStat.correct = userWordAction === UserWordAction.ANSWERED_CORRECTLY ? 1 : 0;
    gameStat.wrong = userWordAction !== UserWordAction.ANSWERED_CORRECTLY ? 0 : 1;
    gameStat.gameLastUpdate = currentDate;

    currentUserStatistics.optional.games[game] = gameStat;
  }

  return currentUserStatistics;
}

export function calculateUserStatistics(
  currentUserStat: UserStatistics,
  game: string,
  userWordAction: UserWordAction,
): UserStatistics {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));

  const userStatsGames = calculateGameStatistics(game, userWordAction, currentDate, currentUserStat);
  const userStatesWithStreak = calculateStreak(game, userWordAction, currentDate, userStatsGames);

  return userStatesWithStreak;
}

export async function updateUserWordStatistics(
  userState: UserState | null,
  wordId: string,
  userWordAction: UserWordAction,
  game: string,
  currentDate: string,
): Promise<UpdateUserWordStatisticsResult> {
  const userWordResult = await getUserWord(userState, wordId);
  const doesUserWordExist = !!userWordResult;
  const isUserWordNew = !doesUserWordExist || !userWordResult?.optional?.games;

  const userWord = userWordResult || initializeUserWord(userWordAction, game, currentDate);

  if (doesUserWordExist) {
    const updateUserWordStatusResult = calculateUserWordStatistics(userWord, userWordAction, game, currentDate);
    await saveUserWord(appState.user, wordId, updateUserWordStatusResult.userWord);
    return {
      isUserWordNew,
      justBecameStudied: updateUserWordStatusResult.justBecameStudied,
      justRemovedFromStudied: updateUserWordStatusResult.justRemovedFromStudied,
    };
  }

  await createUserWord(appState.user, wordId, userWord);

  return {
    isUserWordNew,
    justBecameStudied: false,
    justRemovedFromStudied: false,
  };
}

export async function updateStatisticsFromGames(
  userState: UserState | null,
  word: Word,
  game: string,
  answer: number,
): Promise<void> {
  const userWordAction = answer === 1
    ? UserWordAction.ANSWERED_CORRECTLY
    : UserWordAction.ANSWERED_WRONGLY;

  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));

  let userStatistics = await getUserStatistics(appState.user) || {} as UserStatistics;

  const updateUserWordStatisticsResult = await updateUserWordStatistics(
    userState,
    word.id,
    userWordAction,
    game,
    currentDate,
  );
  if (updateUserWordStatisticsResult.isUserWordNew) {
    userStatistics = calculateNewWords(userStatistics, currentDate, game);
  }
  const userWord = word.userWord || {} as UserWord;
  userWord.optional = userWord.optional || {} as UserWordOptional;
  userWord.optional.correctAnswers = userWord.optional.correctAnswers || 0;
  userWord.optional.correctAnswersLastUpdate = userWord.optional.correctAnswersLastUpdate || currentDate;
  const correctAnswersLastUpdateword = userWord.optional.correctAnswersLastUpdate;

  userStatistics = calculateLearnedWords(currentDate,
    userStatistics,
    updateUserWordStatisticsResult,
    correctAnswersLastUpdateword);

  userStatistics = calculateUserStatistics(userStatistics, game, userWordAction);

  await saveUserStatistics(appState.user, userStatistics);
}

export async function updateStatisticsFromTextbook(
  userState: UserState | null,
  currentDate: string,
  updateUserWordStatisticsResult: UpdateUserWordStatisticsResult,
  word: Word,
) {
  if (!userState) throw Error('User state is null. Cannot update statistics.');

  let userStatistics = await getUserStatistics(userState) || {} as UserStatistics;
  userStatistics.learnedWords = userStatistics.learnedWords || 0;

  const userWord = word.userWord || {} as UserWord;
  userWord.optional = userWord.optional || {} as UserWordOptional;
  userWord.optional.correctAnswers = userWord.optional.correctAnswers || 0;
  userWord.optional.correctAnswersLastUpdate = userWord.optional.correctAnswersLastUpdate || currentDate;
  const correctAnswersLastUpdateword = userWord.optional.correctAnswersLastUpdate;
  userStatistics = calculateLearnedWords(
    currentDate,
    userStatistics,
    updateUserWordStatisticsResult,
    correctAnswersLastUpdateword,
  );

  await saveUserStatistics(userState, userStatistics);
}

export async function addWordToLearned(word: Word) {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));
  const result = await getUserWord(appState.user, word.id);
  if (!result) {
    const bodyUserWord = {} as UserWord;
    const updateUserWordStatusResult = calculateWordStatus(bodyUserWord, currentDate, UserWordAction.MADE_STUDIED);
    const response = await createUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
    await updateStatisticsFromTextbook(
      appState.user,
      currentDate,
      {
        isUserWordNew: false,
        justBecameStudied: true,
        justRemovedFromStudied: false,
      },
      word,
    );
    return response;
  }
  const updateUserWordStatusResult = calculateWordStatus(result, currentDate, UserWordAction.MADE_STUDIED);
  const response = await saveUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
  await updateStatisticsFromTextbook(
    appState.user,
    currentDate,
    {
      isUserWordNew: false,
      justBecameStudied: true,
      justRemovedFromStudied: false,
    },
    word,
  );
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
    await updateStatisticsFromTextbook(
      appState.user,
      currentDate,
      {
        isUserWordNew: false,
        justBecameStudied: false,
        justRemovedFromStudied: true,
      },
      word,
    );
    return response;
  }
  const updateUserWordStatusResult = calculateWordStatus(result, currentDate, UserWordAction.MADE_NOT_STUDIED);
  const response = await saveUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
  await updateStatisticsFromTextbook(
    appState.user,
    currentDate,
    {
      isUserWordNew: false,
      justBecameStudied: false,
      justRemovedFromStudied: true,
    },
    word,
  );
  return response;
}

export async function addWordToDifficult(word: Word) {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));
  const result = await getUserWord(appState.user, word.id);
  if (!result) {
    const bodyUserWord = {} as UserWord;
    const updateUserWordStatusResult = calculateWordStatus(bodyUserWord, currentDate, UserWordAction.MADE_DIFFICULT);
    const response = await createUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
    await updateStatisticsFromTextbook(
      appState.user,
      currentDate, {
        isUserWordNew: false,
        justBecameStudied: updateUserWordStatusResult.justBecameStudied,
        justRemovedFromStudied: updateUserWordStatusResult.justRemovedFromStudied,
      },
      word,
    );
    return response;
  }
  const updateUserWordStatusResult = calculateWordStatus(result, currentDate, UserWordAction.MADE_DIFFICULT);
  const response = await saveUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
  await updateStatisticsFromTextbook(
    appState.user,
    currentDate, {
      isUserWordNew: false,
      justBecameStudied: updateUserWordStatusResult.justBecameStudied,
      justRemovedFromStudied: updateUserWordStatusResult.justRemovedFromStudied,
    },
    word,
  );
  return response;
}

export async function removeWordFromDifficult(word: Word) {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));
  const result = await getUserWord(appState.user, word.id);
  if (!result) {
    const bodyUserWord = {} as UserWord;
    const updateUserWordStatusResult = calculateWordStatus(
      bodyUserWord,
      currentDate,
      UserWordAction.MADE_NOT_DIFFICULT,
    );
    const response = await createUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
    await updateStatisticsFromTextbook(
      appState.user,
      currentDate, {
        isUserWordNew: false,
        justBecameStudied: updateUserWordStatusResult.justBecameStudied,
        justRemovedFromStudied: updateUserWordStatusResult.justRemovedFromStudied,
      },
      word,
    );
    return response;
  }
  const updateUserWordStatusResult = calculateWordStatus(result, currentDate, UserWordAction.MADE_NOT_DIFFICULT);
  const response = await saveUserWord(appState.user, word.id, updateUserWordStatusResult.userWord);
  await updateStatisticsFromTextbook(
    appState.user,
    currentDate,
    {
      isUserWordNew: false,
      justBecameStudied: updateUserWordStatusResult.justBecameStudied,
      justRemovedFromStudied: updateUserWordStatusResult.justRemovedFromStudied,
    },
    word,
  );
  return response;
}
