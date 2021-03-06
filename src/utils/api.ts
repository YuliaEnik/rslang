import { logOut } from '../components/nav';
import { saveUserToLocalStorage } from '../services/auth/login';
import { API_ENDPOINT } from './constants';
import {
  UserWord,
  ResponseStatus,
  UserState,
  Word,
  AggregateResponse,
  UserStatistics,
} from './types';

function buildGetParams(params?: { [key: string]: string | number }) {
  if (!params) {
    return '';
  }
  const queryString = Object.entries(params)
    .map((el) => `${el[0]}=${el[1]}`)
    .join('&');
  return `?${queryString}`;
}

async function refreshUserToken(userState: UserState): Promise<void> {
  const response = await fetch(`${API_ENDPOINT}/users/${userState.userId}/tokens`, {
    headers: {
      Authorization: `Bearer ${userState.refreshToken}`,
    },
  });

  if (response.status !== ResponseStatus.SUCCESS) {
    // throw Error(`Failed to refresh user token. Error: '${response.text}'`);
    logOut();
  }

  const content = await response.json();
  userState.token = content.token;
  userState.refreshToken = content.refreshToken;
  saveUserToLocalStorage(userState);
}

async function fetchForUser(url: string, userState: UserState, body?: UserWord | UserStatistics, method = 'GET') {
  let response = await fetch(url,
    {
      method,
      credentials: 'omit',
      headers: {
        Authorization: `Bearer ${userState.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

  if (response.status === ResponseStatus.SUCCESS) {
    return response;
  }
  if (response.status === ResponseStatus.UNAUTHORIZED) {
    await refreshUserToken(userState);
  }

  response = await fetch(url,
    {
      method,
      credentials: 'omit',
      headers: {
        Authorization: `Bearer ${userState.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

  return response;
}

export async function getWords(req?: { group: number, page?: number }): Promise<Word[]> {
  const result = await fetch(`${API_ENDPOINT}/words/${buildGetParams(req)}`);
  const data = await result.json();
  return data;
}

export async function getUserWords(userState: UserState | null) {
  if (!userState) throw Error('User state is null. Cannot get user words.');

  const url = `${API_ENDPOINT}/users/${userState.userId}/words`;
  const result = await fetchForUser(url, userState);
  return result;
}

export async function getUserWord(userState: UserState | null, wordId: string): Promise<UserWord | null> {
  if (!userState) throw Error('User state is null. Cannot get user word.');

  const url = `${API_ENDPOINT}/users/${userState.userId}/words/${wordId}`;
  const response = await fetchForUser(url, userState);
  if (response.ok) {
    const result = await response.json();
    delete result.id;
    delete result.wordId;
    return result as UserWord;
  }
  return null;
}

export async function createUserWord(userState: UserState | null, wordId: string, userWord?: UserWord) {
  if (!userState) throw Error('User state is null. Cannot create word.');

  const url = `${API_ENDPOINT}/users/${userState.userId}/words/${wordId}`;
  const result = await fetchForUser(
    url,
    userState,
    userWord,
    'POST',
  );

  if (!result.ok) {
    throw new Error('Cannot create word');
  }

  return result;
}

export async function saveUserWord(userState: UserState | null, wordId: string, userWord?: UserWord) {
  if (!userState) throw Error('User state is null. Cannot update word.');

  const url = `${API_ENDPOINT}/users/${userState.userId}/words/${wordId}`;
  const result = await fetchForUser(
    url,
    userState,
    userWord,
    'PUT',
  );

  if (!result.ok) {
    console.log('cannot create word');
  }

  return result;
}

export async function getAggregatedWords(
  userState: UserState | null,
  req?: { group?: number, page?: number, wordsPerPage?: number, filter?: string },
) {
  if (!userState) throw Error('User state is null. Cannot get user words.');

  const url = `${API_ENDPOINT}/users/${userState.userId}/aggregatedWords${buildGetParams(req)}`;
  const response = await fetchForUser(url, userState);
  const result: AggregateResponse[] = await response.json();

  return result;
}

export async function getUserWordsForGame(userState: UserState | null, req?: {
  group?: number,
  page?: number,
  wordsPerPage?: number,
  filter?: string,
}): Promise<AggregateResponse[]> {
  if (!userState) throw Error('User state is null. Cannot get user words.');
  const url = `${API_ENDPOINT}/users/${userState.userId}/aggregatedWords${buildGetParams(req)}`;
  const response = await fetchForUser(url, userState);
  const result: AggregateResponse[] = await response.json();
  return result;
}

export async function getUserStatistics(userState: UserState | null): Promise<UserStatistics | null> {
  if (!userState) throw Error('User state is null. Cannot get user statistics.');

  const url = `${API_ENDPOINT}/users/${userState.userId}/statistics`;
  const response = await fetchForUser(url, userState);

  if (!response.ok) {
    return null;
  }

  const result = await response.json();
  delete result.id;
  return result as UserStatistics;
}

export async function saveUserStatistics(userState: UserState | null, body: UserStatistics): Promise<UserStatistics> {
  if (!userState) throw Error('User state is null. Cannot get user statistics.');
  const url = `${API_ENDPOINT}/users/${userState.userId}/statistics`;
  const response = await fetchForUser(url, userState, body, 'PUT');
  const result = await response.json();
  delete result.id;
  return result;
}
