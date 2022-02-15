import { appState } from '../app';
import { createUserWord, getUserStatistic, getWord, updateUserStatistic, updateUserWord } from './api';
import { UserState, UserStatistics, UserStatisticsOptional, UserStatisticsResponse, UserWord, UserWordResponse } from './types';

export function addWordToDifficultList(wordId: string) {
  return createUserWord(appState.user, wordId, { difficulty: 'difficult' });
}

function initiateStatisctics(date: string, answer: number): UserWord {
  const body: UserWord = {
    optional: {
      date,
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
    content.optional.date = dateString;
  } else {
    content.optional = {};
    content.optional.date = dateString;
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

export async function addGameResult(userState: UserState | null, wordId: string, answer: number) {
  const result = await getWord(userState, wordId);

  const date = new Date();
  const dateString = date.toISOString().substring(0, date.toISOString().indexOf('T'));

  if (!result.ok) {
    const body = initiateStatisctics(dateString, answer);
    updateNewWords();
    createUserWord(appState.user, wordId, body);
  } else if (result.ok) {
    const content = await result.json();
    const body = updateWordStatistics(content, answer);
    updateUserWord(appState.user, wordId, body);
  }
}
