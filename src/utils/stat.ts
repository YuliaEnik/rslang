import { appState } from '../app';
import {
  createUserWord,
  getWord,
  updateUserWord,
  getUserStatistics,
  updateUserStatistics,
} from './api';
import {
  GamesStat,
  GameStat,
  GameStatistics,
  UserState,
  UserStatistics,
  UserStatisticsResponse,
  UserWord, UserWordAction, UserWordOptional, UserWordOptionalGames, UserWordResponse, Word,
} from './types';

function updateAnsweredCorrectly(word: UserWord, currentDate: string): UserWord {
  if (word.difficulty === 'default' && word.optional.correctAnswers < 2) {
    word.optional.correctAnswers++;
    word.optional.correctAnswersLastUpdate = currentDate;
    return word;
  }
  if (word.difficulty === 'default' && word.optional.correctAnswers === 2) {
    word.optional.correctAnswers++;
    word.optional.correctAnswersLastUpdate = currentDate;
    word.difficulty = 'studied';
    // todo: update statistics
    return word;
  }
  if (word.difficulty === 'difficult' && word.optional.correctAnswers < 4) {
    word.optional.correctAnswers++;
    word.optional.correctAnswersLastUpdate = currentDate;
    return word;
  }
  if (word.difficulty === 'difficult' && word.optional.correctAnswers === 4) {
    word.optional.correctAnswers++;
    word.optional.correctAnswersLastUpdate = currentDate;
    word.difficulty = 'studied';
    // todo: update statistics
    return word;
  }
  return word;
}

function updateAnsweredWrongly(word: UserWord, currentDate: string) {
  if (word.difficulty === 'default' && word.optional.correctAnswers <= 2) {
    word.optional.correctAnswers = 0;
    word.optional.correctAnswersLastUpdate = currentDate;
    return word;
  }
  if (word.difficulty === 'difficult' && word.optional.correctAnswers <= 4) {
    word.optional.correctAnswers = 0;
    word.optional.correctAnswersLastUpdate = currentDate;
    return word;
  }
  if (word.difficulty === 'studied') {
    word.difficulty = 'default';
    word.optional.correctAnswers = 0;
    word.optional.correctAnswersLastUpdate = currentDate;
  }
  return word;
}

function updateMarkedDifficult(word: UserWord, currentDate: string) {
  if (word.difficulty === 'default') {
    word.difficulty = 'difficult';
    word.optional.correctAnswers = 0;
    word.optional.correctAnswersLastUpdate = currentDate;
    return word;
  }
  if (word.difficulty === 'studied') {
    word.difficulty = 'difficult';
    word.optional.correctAnswers = 0;
    word.optional.correctAnswersLastUpdate = currentDate;
    return word;
  }
  return word;
}

function updateRemovedDifficult(word: UserWord, currentDate: string): UserWord {
  if (word.optional.correctAnswers > 3) {
    word.difficulty = 'studied';
    word.optional.correctAnswersLastUpdate = currentDate;
  }
  word.difficulty = 'default';
  word.optional.correctAnswersLastUpdate = currentDate;
  return word;
}

function updateMarkedStudied(word: UserWord, currentDate: string): UserWord {
  if (word.difficulty === 'default') {
    word.difficulty = 'studied';
    word.optional.correctAnswers = 3;
    word.optional.correctAnswersLastUpdate = currentDate;
    // todo: update statistics
    return word;
  }
  if (word.difficulty === 'difficult') {
    word.difficulty = 'studied';
    word.optional.correctAnswers = 5;
    word.optional.correctAnswersLastUpdate = currentDate;
    // todo: update statistics
    return word;
  }
  return word;
}

function updateRemovedStudied(word: UserWord, currentDate: string): UserWord {
  word.difficulty = 'default';
  word.optional.correctAnswers = 0;
  word.optional.correctAnswersLastUpdate = currentDate;
  return word;
}

export function updateWordStatus(
  userWord: UserWord,
  currentDate:
  string,
  userWordAction: UserWordAction,
  answer?: number,
) {
  userWord.difficulty = userWord.difficulty || 'default';
  userWord.optional = userWord.optional || {} as UserWordOptional;
  userWord.optional.correctAnswers = userWord.optional.correctAnswers || 0;
  userWord.optional.correctAnswersLastUpdate = currentDate;

  switch (userWordAction) {
    case UserWordAction.ANSWERED_CORRECTLY: {
      const userWordsResponse = updateAnsweredCorrectly(userWord, currentDate);
      const result = {
        difficulty: userWordsResponse.difficulty,
        optional: userWordsResponse.optional,
      };
      return result;
    }
    case UserWordAction.ANSWERED_WRONGLY:
      return updateAnsweredWrongly(userWord, currentDate);
    case UserWordAction.MARKED_DIFFICULT: {
      const userWordsResponse = updateMarkedDifficult(userWord, currentDate);
      const result = {
        difficulty: userWordsResponse.difficulty,
        optional: userWordsResponse.optional,
      };
      return result;
    }
    case UserWordAction.REMOVED_DIFFICULT: {
      const userWordsResponse = updateRemovedDifficult(userWord, currentDate);
      const result = {
        difficulty: userWordsResponse.difficulty,
        optional: userWordsResponse.optional,
      };
      return result;
    }
    case UserWordAction.MARKED_STUDIED: {
      const userWordsResponse = updateMarkedStudied(userWord, currentDate);
      const result = {
        difficulty: userWordsResponse.difficulty,
        optional: userWordsResponse.optional,
      };
      return result;
    }
    case UserWordAction.REMOVED_STUDIED: {
      const userWordsResponse = updateRemovedStudied(userWord, currentDate);
      const result = {
        difficulty: userWordsResponse.difficulty,
        optional: userWordsResponse.optional,
      };
      return result;
    }
    default:
      console.warn(`Unexpected userWordAction '${userWordAction}'`);
      return userWord;
  }
}

function initiateStatisctics(wordLastUpdate: string, answer: number, game: string, currentDate: string): UserWord {
  const userWord = {} as UserWord;
  userWord.difficulty = 'default';
  userWord.optional = {} as UserWordOptional;
  userWord.optional.correctAnswers = answer || 0;
  userWord.optional.correctAnswersLastUpdate = currentDate;
  userWord.optional.games = {} as UserWordOptionalGames;
  userWord.optional.games[game] = {} as GameStatistics;
  userWord.optional.games[game].correct = answer || 0;
  userWord.optional.games[game].wrong = answer || 1;

  return userWord;
}

export async function updateNewWords(currentDate: string, game: string) {
  const currentUserStat: UserStatisticsResponse = await getUserStatistics(appState.user)
  || {} as UserStatisticsResponse;

  if (currentUserStat.optional?.games?.[game].newWordsGame
    && currentUserStat.optional?.games?.[game].newWordsGameLastUpdate) {
    if (currentDate !== currentUserStat.optional.games?.[game].newWordsGameLastUpdate) {
      currentUserStat.optional.games[game].newWordsGameLastUpdate = currentDate;
      currentUserStat.optional.games[game].newWordsGame = 1;
    }
    if (currentDate === currentUserStat.optional?.games?.[game].newWordsGameLastUpdate) {
      currentUserStat.optional.games[game].newWordsGame++;
    }
  } else {
    currentUserStat.optional = currentUserStat.optional || {};
    currentUserStat.optional.games = currentUserStat.optional.games || {} as GamesStat;

    const gameStat = currentUserStat.optional.games[game] || {} as GameStat;
    gameStat.newWordsGame = 1;
    gameStat.newWordsGameLastUpdate = currentDate;

    currentUserStat.optional.games[game] = gameStat;
  }

  const userStatistics: UserStatistics = {
    learnedWords: currentUserStat.learnedWords,
    optional: currentUserStat.optional,
  };
  await updateUserStatistics(appState.user, userStatistics);
}

export async function updateWordStatistics(
  userWordResponse: UserWordResponse,
  answer: number,
  game: string,
  currentDate: string,
): Promise<UserWord> {
  const content = Object.keys(userWordResponse).reduce((object: UserWord, property: string) => {
    if (property !== 'id' && property !== 'wordId') {
      object[property] = userWordResponse[property];
    }
    return object;
  }, {} as UserWord);

  if (content.optional) {
    content.optional.wordLastUpdate = currentDate;
  } else if (!content.optional) {
    content.optional = {} as UserWordOptional;
    content.optional.wordLastUpdate = currentDate;
  }

  if (answer === 1) {
    updateWordStatus(content, currentDate, UserWordAction.ANSWERED_CORRECTLY);
    if (content.optional?.games?.[game].correct) {
      content.optional.games[game].correct++;
    }
    if (!content.optional.games) {
      await updateNewWords(currentDate, game);
      content.optional.games = {};
      content.optional.games.sprint = {
        correct: 1,
        wrong: 0,
      };
    }
  } else if (answer === 0) {
    updateWordStatus(content, currentDate, UserWordAction.ANSWERED_WRONGLY);
    if (content.optional.games?.sprint) {
      content.optional.games.sprint.wrong++;
    }
    if (!content.optional.games) {
      await updateNewWords(currentDate, game);
      content.optional.games = {};
      content.optional.games.sprint = {
        correct: 0,
        wrong: 1,
      };
    }
  }
  return content;
}

export async function addGameResult(userState: UserState | null, wordId: string, answer: number, game: string) {
  const result = await getWord(userState, wordId);

  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));

  if (!result.ok) {
    const bodyUserWord = initiateStatisctics(currentDate, answer, game, currentDate);
    await updateNewWords(currentDate, game);
    await createUserWord(appState.user, wordId, bodyUserWord);
  } else if (result.ok) {
    const content = await result.json();
    const bodyUserWord = await updateWordStatistics(content, answer, game, currentDate);
    await updateUserWord(appState.user, wordId, bodyUserWord);
  }
  return true;
}

async function countStreak(
  game: string,
  answer: number,
  currentDate: string,
  currentUserStat: UserStatisticsResponse,
) {
  if (answer) {
    if (currentUserStat.optional?.games?.[game]) {
      if (currentDate === currentUserStat.optional.games[game].streakLastUpdate) {
        currentUserStat.optional.games[game].currentStreak += 1;
        currentUserStat.optional.games[game].streakLastUpdate = currentDate;
      } else if (currentDate !== currentUserStat.optional.games[game].streakLastUpdate
        || currentUserStat.optional.games[game].streakLastUpdate === 'undefined') {
        currentUserStat.optional.games[game].bestStreak = 1;
        currentUserStat.optional.games[game].currentStreak = 1;
        currentUserStat.optional.games[game].streakLastUpdate = currentDate;
      }
    } else {
      currentUserStat.optional = currentUserStat.optional || {};
      currentUserStat.optional.games = currentUserStat.optional.games || {} as GamesStat;

      const gameStat = currentUserStat.optional.games[game] || {} as GameStat;
      gameStat.bestStreak = 1;
      gameStat.currentStreak = 1;
      gameStat.streakLastUpdate = currentDate;

      currentUserStat.optional.games[game] = gameStat;
    }
  }

  if (!answer) {
    if (currentUserStat.optional?.games?.[game]) {
      if (currentDate === currentUserStat.optional.games[game].streakLastUpdate) {
        if (currentUserStat.optional.games[game].currentStreak
          > currentUserStat.optional.games[game].bestStreak) {
          currentUserStat.optional.games[game].bestStreak = currentUserStat.optional.games[game].currentStreak;
          currentUserStat.optional.games[game].currentStreak = 0;
          currentUserStat.optional.games[game].streakLastUpdate = currentDate;
        }
        currentUserStat.optional.games[game].currentStreak = 0;
        currentUserStat.optional.games[game].streakLastUpdate = currentDate;
      } else if (currentDate !== currentUserStat.optional.games[game].streakLastUpdate) {
        currentUserStat.optional.games[game].bestStreak = 0;
        currentUserStat.optional.games[game].currentStreak = 0;
        currentUserStat.optional.games[game].streakLastUpdate = currentDate;
      }
    } else {
      currentUserStat.optional = currentUserStat.optional || {};
      currentUserStat.optional.games = currentUserStat.optional.games || {} as GamesStat;

      const gameStat = currentUserStat.optional.games[game] || {} as GameStat;
      gameStat.bestStreak = currentUserStat.optional.games[game].currentStreak;
      gameStat.currentStreak = 0;
      gameStat.streakLastUpdate = currentDate;

      currentUserStat.optional.games[game] = gameStat;
    }
  }

  const userStatistics: UserStatistics = {
    learnedWords: currentUserStat.learnedWords,
    optional: currentUserStat.optional,
  };
  return userStatistics;
}

function getBestStreak(game: string, date: string, response: UserStatisticsResponse) {
  if (response.optional?.games?.[game]) {
    if (date === response.optional.games[game].streakLastUpdate
      && response.optional.games[game].currentStreak >= response.optional.games[game].bestStreak) {
      response.optional.games[game].bestStreak = response.optional.games[game].currentStreak;
      response.optional.games[game].streakLastUpdate = date;
    } else if (date !== response.optional.games[game].streakLastUpdate) {
      response.optional.games[game].bestStreak = response.optional.games[game].currentStreak;
      response.optional.games[game].streakLastUpdate = date;
    }
  }

  const result = {
    learnedWords: response.learnedWords,
    optional: response.optional,
  };

  return result;
}

async function calculateGameStatistics(
  game: string,
  answer: number,
  currentDate: string,
  currentUserStatistics: UserStatisticsResponse,
) {
  if (currentUserStatistics.optional?.games?.[game]) {
    if (currentDate === currentUserStatistics.optional.games[game].gameLastUpdate) {
      if (answer) {
        currentUserStatistics.optional.games[game].correct++;
        currentUserStatistics.optional.games[game].gameLastUpdate = currentDate;
      } else {
        currentUserStatistics.optional.games[game].wrong++;
        currentUserStatistics.optional.games[game].gameLastUpdate = currentDate;
      }
    } else if (currentDate !== currentUserStatistics.optional.games[game].gameLastUpdate
    || currentUserStatistics.optional.games[game].gameLastUpdate === 'undefined') {
      currentUserStatistics.optional.games[game].correct = answer ? 1 : 0;
      currentUserStatistics.optional.games[game].wrong = answer ? 0 : 1;
      currentUserStatistics.optional.games[game].gameLastUpdate = currentDate;
    }
  } else {
    currentUserStatistics.optional = currentUserStatistics.optional || {};
    currentUserStatistics.optional.games = currentUserStatistics.optional.games || {} as GamesStat;

    const gameStat = currentUserStatistics.optional.games[game] || {} as GameStat;
    gameStat.correct = answer ? 1 : 0;
    gameStat.wrong = answer ? 0 : 1;
    gameStat.gameLastUpdate = currentDate;

    currentUserStatistics.optional.games[game] = gameStat;
  }

  return currentUserStatistics;
}

export async function updateGameStatistics(game: string, answer: number, isFinished: boolean): Promise<void> {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));

  const currentUserStat = await getUserStatistics(appState.user) || {} as UserStatisticsResponse;

  const userStatsGames = await calculateGameStatistics(game, answer, currentDate, currentUserStat);
  const userStatesWithStreak = await countStreak(game, answer, currentDate, userStatsGames);

  const updatedUserStat = await updateUserStatistics(appState.user, userStatesWithStreak);

  if (isFinished) {
    const updatedUserStatistics = getBestStreak(game, currentDate, updatedUserStat);
    if (updatedUserStatistics.optional?.games?.[game].currentStreak) {
      updatedUserStatistics.optional.games[game].currentStreak = 0;
    }
    await updateUserStatistics(appState.user, updatedUserStatistics);
  }
}

export async function getAnswer(
  userState: UserState | null,
  wordId: string,
  game: string,
  answer: number,
  isFinished: boolean,
): Promise<void> {
  const isAdded = await addGameResult(userState, wordId, answer, game);
  if (isAdded) {
    await updateGameStatistics(game, answer, isFinished);
  }
}
