import { logOut } from '../components/nav';
import { saveUserToLocalStorage } from '../services/auth/login';
import { API_ENDPOINT } from './constants';
import { ResponseStatus, UserState, Word } from './types';

function buildGetParams(params?: { [key: string]: string | number }) {
  if (!params) {
    return '';
  }
  const queryString = Object.entries(params)
    .map((el) => `${el[0]}=${el[1]}`)
    .join('&');
  return `?${queryString}`;
}

export async function getWords(req?: { group: number, page?: number }): Promise<Word[]> {
  const result = await fetch(`${API_ENDPOINT}/words/${buildGetParams(req)}`);
  const data = await result.json();
  return data;
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

async function fetchForUser(url: string, userState: UserState) {
  let response = await fetch(url,
    {
      method: 'GET',
      credentials: 'omit',
      headers: {
        Authorization: `Bearer ${userState.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

  if (response.status === ResponseStatus.SUCCESS) {
    const result = await response.json();
    return result;
  }
  if (response.status === ResponseStatus.UNAUTHORIZED) {
    await refreshUserToken(userState);
  }

  response = await fetch(url,
    {
      method: 'GET',
      credentials: 'omit',
      headers: {
        Authorization: `Bearer ${userState.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

  const result = await response.json();
  return result;
}

export async function getAllUserWords(userState: UserState | null): Promise<Word[]> {
  if (!userState) throw Error('User state is null. Cannot get user words.');

  const url = `${API_ENDPOINT}/users/${userState.userId}/words`;
  const response = await fetchForUser(url, userState);
  return response;
}

export async function getUserWords(userState: UserState | null, req?: { group: number, page?: number }) {
  if (!userState) throw Error('User state is null. Cannot get user words.');

  const url = `${API_ENDPOINT}/users/${userState.userId}/aggregatedWords${buildGetParams(req)}&wordsPerPage=20`;
  const response = await fetchForUser(url, userState);
  return response;
}
