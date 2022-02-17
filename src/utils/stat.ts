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
  UserState,
  UserStatistics,
  UserStatisticsResponse,
  UserWord, UserWordResponse,
} from './types';

function initiateStatisctics(wordLastUpdate: string, answer: number, game: string): UserWord {
  const body: UserWord = {
    optional: {
      wordLastUpdate,
      games: {
        sprint: {
          correct: answer ? 1 : 0,
          wrong: answer ? 0 : 1,
        },
      },
    },
  };

  return body;
}

export async function updateNewWords(currentDate: string, game: string) {
  const currentUserStat: UserStatisticsResponse = await getUserStatistics(appState.user);

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

export async function updateWordStatistics(body: UserWordResponse, answer: number, game: string, currentDate: string): Promise<UserWord> {
  const content = Object.keys(body).reduce((object: UserWord, property: string) => {
    if (property !== 'id' && property !== 'wordId') {
      object[property] = body[property];
    }
    return object;
  }, {});

  if (content.optional) {
    content.optional.wordLastUpdate = currentDate;
  } else if (!content.optional) {
    content.optional = {};
    content.optional.wordLastUpdate = currentDate;
  }

  if (answer === 1) {
    if (content.optional.games?.sprint) {
      content.optional.games.sprint.correct++;
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
    const body = initiateStatisctics(currentDate, answer, game);
    await updateNewWords(currentDate, game);
    await createUserWord(appState.user, wordId, body);
  } else if (result.ok) {
    const content = await result.json();
    const body = await updateWordStatistics(content, answer, game, currentDate);
    await updateUserWord(appState.user, wordId, body);
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

  const currentUserStat = await getUserStatistics(appState.user);

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
