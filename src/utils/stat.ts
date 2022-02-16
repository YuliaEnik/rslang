import { appState } from '../app';
import {
  createUserWord,
  getWord,
  updateUserWord,
  getUserStatistic,
  updateUserStatistic,
} from './api';
import {
  UserState,
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

  const response = await getUserStatistic(appState.user);

  if (response.optional?.newWordsLastUpdate && response.optional?.newWords) {
    if (currentDate !== response.optional.newWordsLastUpdate) {
      response.optional.newWordsLastUpdate = currentDate;
      response.optional.newWords = 1;
    }
    if (currentDate === response.optional.newWordsLastUpdate) {
      response.optional.newWords++;
    }
  }

  if (!response.optional?.newWordsLastUpdate) {
    response.optional = {};
    response.optional.newWordsLastUpdate = currentDate;
    response.optional.newWords = 1;
  }

  const body = {
    learnedWords: response.learnedWords,
    optional: {
      newWordsLastUpdate: response.optional.newWordsLastUpdate,
      newWords: response.optional.newWords,
    },
  };

  updateUserStatistic(appState.user, body);
}

export function updateWordStatistics(body: UserWordResponse, answer: number): UserWord {
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
  } else {
    content.optional = {};
    content.optional.wordLastUpdate = dateString;
  }

  if (answer === 1) {
    if (content.optional.games?.sprint) {
      content.optional.games.sprint.correct++;
    }
    if (!content.optional.games) {
      updateNewWords();
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
      updateNewWords();
      content.optional.games = {};
      content.optional.games.sprint = {
        correct: 0,
        wrong: 1,
      };
    }
  }
  return content;
}

// eslint-disable-next-line consistent-return
export async function addGameResult(userState: UserState | null, wordId: string, answer: number) {
  const result = await getWord(userState, wordId);

  const date = new Date();
  const wordLastUpdate = date.toISOString().substring(0, date.toISOString().indexOf('T'));

  if (!result.ok) {
    const body = initiateStatisctics(wordLastUpdate, answer);
    updateNewWords();
    createUserWord(appState.user, wordId, body);
  } else if (result.ok) {
    const content = await result.json();
    const body = updateWordStatistics(content, answer);
    updateUserWord(appState.user, wordId, body);
    return true;
  }
}

function countStreak(game: string, answer: number, currentDate: string, response: UserStatisticsResponse) {
  if (answer) {
    if (response.optional?.games?.game) {
      if (currentDate === response.optional.games.game.streakLastUpdate) {
        response.optional.games.game.currentStreak += 1;
        response.optional.games.game.streakLastUpdate = currentDate;
      } else if (currentDate !== response.optional.games.game.streakLastUpdate) {
        response.optional.games.game.bestStreak = 1;
        response.optional.games.game.currentStreak = 1;
        response.optional.games.game.streakLastUpdate = currentDate;
      } else if (response.optional.games.game.streakLastUpdate === 'undefined') {
        response.optional.games.game.bestStreak = 1;
        response.optional.games.game.currentStreak = 1;
        response.optional.games.game.streakLastUpdate = currentDate;
      }
    }
  }
  if (!answer) {
    if (response.optional?.games?.game) {
      if (currentDate === response.optional.games.game.streakLastUpdate) {
        if (response.optional.games.game.currentStreak > response.optional.games.game.bestStreak) {
          response.optional.games.game.bestStreak = response.optional.games.game.currentStreak;
          response.optional.games.game.currentStreak = 0;
          response.optional.games.game.streakLastUpdate = currentDate;
        }
        response.optional.games.game.currentStreak = 0;
        response.optional.games.game.streakLastUpdate = currentDate;
      } else if (currentDate !== response.optional.games.game.streakLastUpdate) {
        response.optional.games.game.bestStreak = 0;
        response.optional.games.game.currentStreak = 0;
        response.optional.games.game.streakLastUpdate = currentDate;
      }
    }
  }

  const result = {
    learnedWords: response.learnedWords,
    optional: {
      games: {
      },
    },
  };
  if (response.optional?.games) {
    result.optional.games = response.optional.games;
  }

  updateUserStatistic(appState.user, result);
}

function getBestStreak(date: string, response: UserStatisticsResponse) {
  if (response.optional?.games?.game) {
    if (date === response.optional.games.game.streakLastUpdate
      && response.optional.games.game.currentStreak >= response.optional.games.game.bestStreak) {
      response.optional.games.game.bestStreak = response.optional.games.game.currentStreak;
      response.optional.games.game.streakLastUpdate = date;
    } else if (date !== response.optional.games.game.streakLastUpdate) {
      response.optional.games.game.bestStreak = response.optional.games.game.currentStreak;
      response.optional.games.game.streakLastUpdate = date;
    }
  }

  const result = {
    learnedWords: response.learnedWords,
    optional: {
      games: {
      },
    },
  };
  if (response.optional?.games) {
    result.optional.games = response.optional.games;
  }

  return result;
}

export async function updateStreak(game: string, answer: number, isFinished: boolean) {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));

  const response = await getUserStatistic(appState.user);
  if (game === 'sprint') {
    countStreak('sprint', answer, currentDate, response);
    if (isFinished) {
      countStreak('sprint', answer, currentDate, response);
      const result = getBestStreak(currentDate, response);
      if (response.optional?.games?.game.currentStreak) {
        response.optional.games.game.currentStreak = 0;
      }
      updateUserStatistic(appState.user, result);
    }
  }
  if (game === 'audioChallenge') {
    countStreak('audioChallenge', answer, currentDate, response);
    if (isFinished) {
      countStreak('sprint', answer, currentDate, response);
      const result = getBestStreak(currentDate, response);
      if (response.optional?.games?.game.currentStreak) {
        response.optional.games.game.currentStreak = 0;
      }
      updateUserStatistic(appState.user, result);
    }
  }
}

async function countGameStatistics(game: string, answer: number, currentDate: string, response: UserStatisticsResponse) {
  if (response.optional?.games?.game) {
    if (currentDate === response.optional.games.game.gameLastUpdate) {
      if (answer) {
        response.optional.games.game.correct++;
        response.optional.games.game.gameLastUpdate = currentDate;
      } else {
        response.optional.games.game.wrong++;
        response.optional.games.game.gameLastUpdate = currentDate;
      }
    } else if (currentDate !== response.optional.games.game.gameLastUpdate) {
      if (answer) {
        response.optional.games.game.correct = 1;
        response.optional.games.game.wrong = 0;
        response.optional.games.game.gameLastUpdate = currentDate;
      } else {
        response.optional.games.game.wrong = 1;
        response.optional.games.game.correct = 0;
        response.optional.games.game.gameLastUpdate = currentDate;
      }
    }
  } else if (!response.optional) {
    if (answer) {
      response.optional = {};
      response.optional.games = {};
      response.optional.games.game.correct = 1;
      response.optional.games.game.wrong = 0;
      response.optional.games.game.gameLastUpdate = currentDate;
    } else {
      response.optional = {};
      response.optional.games = {};
      response.optional.games.game.wrong = 1;
      response.optional.games.game.correct = 0;
      response.optional.games.game.gameLastUpdate = currentDate;
    }
  } else if (!response.optional.games) {
    if (answer) {
      response.optional.games = {};
      response.optional.games.game.correct = 1;
      response.optional.games.game.wrong = 0;
      response.optional.games.game.gameLastUpdate = currentDate;
    } else {
      response.optional.games = {};
      response.optional.games.game.wrong = 1;
      response.optional.games.game.correct = 0;
      response.optional.games.game.gameLastUpdate = currentDate;
    }
  } else if (!response.optional.games.game) {
    if (answer) {
      Object.defineProperty(response.optional.games, 'game', {
        value: {},
      });
      Object.defineProperty(response.optional.games.game, 'correct', {
        value: 1,
      });
      Object.defineProperty(response.optional.games.game, 'wrong', {
        value: 0,
      });
      Object.defineProperty(response.optional.games.game, 'gameLastUpdate', {
        value: currentDate,
      });
    } else {
      Object.defineProperty(response.optional.games, 'game', {
        value: {},
      });
      Object.defineProperty(response.optional.games.game, 'correct', {
        value: 0,
      });
      Object.defineProperty(response.optional.games.game, 'wrong', {
        value: 1,
      });
      Object.defineProperty(response.optional.games.game, 'gameLastUpdate', {
        value: currentDate,
      });
    }
  }

  const result = {
    learnedWords: response.learnedWords,
    optional: {
      games: {
      },
    },
  };
  if (response.optional?.games) {
    result.optional.games = response.optional.games;
  }

  return result;
}

export async function updateGameStatistics(game: string, answer: number) {
  const date = new Date();
  const currentDate = date.toISOString().substring(0, date.toISOString().indexOf('T'));

  const response = await getUserStatistic(appState.user);
  if (game === 'sprint') {
    const result = await countGameStatistics(game, answer, currentDate, response);
    updateUserStatistic(appState.user, result);
  }
  if (game === 'audioChallenge') {
    const result = await countGameStatistics(game, answer, currentDate, response);
    updateUserStatistic(appState.user, result);
  }
}

export async function getAnswer(userState: UserState | null, wordId: string, game: string, answer: number, isFinished: boolean) {
  const isAdded = await addGameResult(userState, wordId, answer);
  if (isAdded) {
    updateGameStatistics(game, answer);
    updateStreak(game, answer, isFinished);
  }
}
