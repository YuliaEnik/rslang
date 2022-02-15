import { appState } from '../app';
import { createUserWord, getWord, updateUserWord } from './api';
import { UserState, UserWord, UserWordResponse } from './types';

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

export function updateWordStatistics(body: UserWordResponse, answer: number): UserWord {
  const date = new Date();
  const dateString = date.toISOString();

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
  const dateString = date.toISOString();

  if (!result.ok) {
    const body = initiateStatisctics(dateString, answer);
    createUserWord(appState.user, wordId, body);
  } else if (result.ok) {
    const content = await result.json();
    const body = updateWordStatistics(content, answer);
    updateUserWord(appState.user, wordId, body);
  }
}
