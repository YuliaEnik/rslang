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

function initiateStatisctics(wordLastUpdate: string, answer: number): UserWord {
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

export async function updateNewWords() {
  const date = new Date();
  const dateString = date.toISOString();
  const currentDate = dateString.substring(0, dateString.indexOf('T'));

  const currentUserStatistics = await getUserStatistics(appState.user);

  if (currentUserStatistics.optional?.newWordsLastUpdate && currentUserStatistics.optional?.newWords) {
    if (currentDate !== currentUserStatistics.optional.newWordsLastUpdate) {
      currentUserStatistics.optional.newWordsLastUpdate = currentDate;
      currentUserStatistics.optional.newWords = 1;
    }
    if (currentDate === currentUserStatistics.optional.newWordsLastUpdate) {
      currentUserStatistics.optional.newWords++;
    }
  } else {
    currentUserStatistics.optional = currentUserStatistics.optional || {};
    currentUserStatistics.optional.newWordsLastUpdate = currentDate;
    currentUserStatistics.optional.newWords = 1;
  }

  const userStatistics: UserStatistics = {
    learnedWords: currentUserStatistics.learnedWords,
    optional: currentUserStatistics.optional,
  };
  // eslint-disable-next-line no-debugger
  // debugger;
  await updateUserStatistics(appState.user, userStatistics);
}

export async function updateWordStatistics(body: UserWordResponse, answer: number): Promise<UserWord> {
  const date = new Date();
  const dateString = date.toISOString().substring(0, date.toISOString().indexOf('T'));

  const content = Object.keys(body).reduce((object: UserWord, property: string) => {
    if (property !== 'id' && property !== 'wordId') {
      object[property] = body[property];
    }
    return object;
  }, {});

  if (content.optional) {
    content.optional.wordLastUpdate = dateString;
  } else if (!content.optional) {
    content.optional = {};
    content.optional.wordLastUpdate = dateString;
  }

  if (answer === 1) {
    if (content.optional.games?.sprint) {
      content.optional.games.sprint.correct++;
    }
    if (!content.optional.games) {
      await updateNewWords();
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
      await updateNewWords();
      content.optional.games = {};
      content.optional.games.sprint = {
        correct: 0,
        wrong: 1,
      };
    }
  }
  return content;
}

export async function addGameResult(userState: UserState | null, wordId: string, answer: number) {
  const result = await getWord(userState, wordId);

  const date = new Date();
  const wordLastUpdate = date.toISOString().substring(0, date.toISOString().indexOf('T'));

  if (!result.ok) {
    const body = initiateStatisctics(wordLastUpdate, answer);
    await updateNewWords();
    await createUserWord(appState.user, wordId, body);
  } else if (result.ok) {
    const content = await result.json();
    const body = await updateWordStatistics(content, answer);
    await updateUserWord(appState.user, wordId, body);
  }
  return true;
}

async function countStreak(game: string, answer: number, currentDate: string, response: UserStatisticsResponse) {
  if (answer) {
    if (response.optional?.games?.[game]) {
      if (currentDate === response.optional.games[game].streakLastUpdate) {
        response.optional.games[game].currentStreak += 1;
        response.optional.games[game].streakLastUpdate = currentDate;
      } else if (currentDate !== response.optional.games.game.streakLastUpdate) {
        response.optional.games[game].bestStreak = 1;
        response.optional.games[game].currentStreak = 1;
        response.optional.games[game].streakLastUpdate = currentDate;
      } else if (response.optional.games[game].streakLastUpdate === 'undefined') {
        response.optional.games[game].bestStreak = 1;
        response.optional.games[game].currentStreak = 1;
        response.optional.games[game].streakLastUpdate = currentDate;
      }
    } else {
      response.optional = response.optional || {};
      response.optional.games = response.optional.games || {} as GamesStat;

      const gameStat = response.optional.games[game] || {} as GameStat;
      gameStat.bestStreak = 1;
      gameStat.currentStreak = 1;
      gameStat.streakLastUpdate = currentDate;

      response.optional.games[game] = gameStat;
    }
  }

  if (!answer) {
    if (response.optional?.games?.[game]) {
      if (currentDate === response.optional.games[game].streakLastUpdate) {
        if (response.optional.games[game].currentStreak > response.optional.games[game].bestStreak) {
          response.optional.games[game].bestStreak = response.optional.games[game].currentStreak;
          response.optional.games[game].currentStreak = 0;
          response.optional.games[game].streakLastUpdate = currentDate;
        }
        response.optional.games[game].currentStreak = 0;
        response.optional.games[game].streakLastUpdate = currentDate;
      } else if (currentDate !== response.optional.games[game].streakLastUpdate) {
        response.optional.games[game].bestStreak = 0;
        response.optional.games[game].currentStreak = 0;
        response.optional.games[game].streakLastUpdate = currentDate;
      }
    } else {
      response.optional = response.optional || {};
      response.optional.games = response.optional.games || {} as GamesStat;

      const gameStat = response.optional.games[game] || {} as GameStat;
      gameStat.bestStreak = response.optional.games[game].currentStreak;
      gameStat.currentStreak = 0;
      gameStat.streakLastUpdate = currentDate;

      response.optional.games[game] = gameStat;
    }
  }

  const userStatistics: UserStatistics = {
    learnedWords: response.learnedWords,
    optional: { ...response.optional },
  };
  await updateUserStatistics(appState.user, userStatistics);
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

export async function updateStreak(game: string, answer: number, isFinished: boolean) {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));

  const currentUserStatistics = await getUserStatistics(appState.user);
  if (game === 'sprint') {
    await countStreak(game, answer, currentDate, currentUserStatistics);
    if (isFinished) {
      await countStreak(game, answer, currentDate, currentUserStatistics);
      const updatedUserStatistics = getBestStreak(game, currentDate, currentUserStatistics);
      if (currentUserStatistics.optional?.games?.[game].currentStreak) {
        currentUserStatistics.optional.games[game].currentStreak = 0;
      }

      await updateUserStatistics(appState.user, updatedUserStatistics);
    }
  }
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

  const userStatistics: UserStatistics = {
    learnedWords: currentUserStatistics.learnedWords,
    optional: currentUserStatistics.optional,
  };

  await updateUserStatistics(appState.user, userStatistics);
}

export async function updateGameStatistics(game: string, answer: number): Promise<void> {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));

  const response = await getUserStatistics(appState.user);
  if (game === 'sprint') {
    await calculateGameStatistics(game, answer, currentDate, response);
  }
}

export async function getAnswer(
  userState: UserState | null,
  wordId: string,
  game: string,
  answer: number,
  isFinished: boolean,
): Promise<void> {
  const isAdded = await addGameResult(userState, wordId, answer);
  if (isAdded) {
    await updateGameStatistics(game, answer);
    await updateStreak(game, answer, isFinished);
  }
}
