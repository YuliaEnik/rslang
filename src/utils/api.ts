import { API_ENDPOINT } from './constants';
import { Word } from './types';

function buildGetParams(params?: { [key: string]: string | number }) {
  if (!params) {
    return '';
  }
  const queryString = Object.entries(params).map((el) => `${el[0]}=${el[1]}`).join('&');
  return `?${queryString}`;
}

export async function getWords(req?: { group: number, page?: number }): Promise<Word[]> {
  const result = await fetch(`${API_ENDPOINT}/words/${buildGetParams(req)}`);
  const data = await result.json();
  return data;
}
