export interface Word {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
}

export interface StateTextContentEn {
  btnTrue: string,
  btnFalse: string,
  exit: string
}

export interface IData {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
}

export enum ResponseStatus {
  SUCCESS = 200,
  CREDENTIALS = 422,
  EXISTED = 417,
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Input {
  type: string;
  id: string;
  class: string;
}

export interface Auth {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}
