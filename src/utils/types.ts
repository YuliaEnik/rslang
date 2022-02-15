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
  correctAnswer?: number;
  userWord?: UserWord;
}

export interface UserWord {
  [key: string]: string | UserWordOptional | undefined;
  difficulty?: string;
  optional?: UserWordOptional;
}

export interface UserWordOptional {
  isLearned?: true | null;
  date?: string;
  games?: {
    sprint?: GameStatistics;
    audiochallenge?: GameStatistics;
  };
}

export interface GameStatistics {
  correct: number;
  wrong: number;
  streak?: number;
}

export interface UserWordResponse {
  [key: string]: string | UserWordOptional | undefined;
  id: string,
  wordId: string;
  difficulty?: string;
  optional?: UserWordOptional;
}

export interface UserStatistics {
  [key: string]: UserStatisticsOptional | number | undefined;
  learnedWords: number;
  optional?: UserStatisticsOptional;
}

export interface UserStatisticsResponse {
  [key: string]: UserStatisticsOptional | number | string | undefined;
  id: string;
  learnedWords: number;
  optional?: UserStatisticsOptional;
}

export interface UserStatisticsOptional {
  newWords?: number;
  newWordsLastUpdate?: string;
}

export interface StateSprint {
  curIndex: number;
  score: number;
  countCorrectAnsw: number;
  questionsArray: Word[];
  falseAnsw: number;
  trueAnsw: number;
  isTrueTranslate: number | null;
  game_time: number;
  points: number;
}

export interface StateTextContentEn {
  btnTrue: string;
  btnFalse: string;
  exit: string;
}

export interface Page {
  title: string;
  link: string;
  type: string;
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
}

export enum ResponseStatus {
  SUCCESS = 200,
  IS_DELETED = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INVALID_TOKEN = 403,
  NOT_FOUND = 404,
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

export interface AuthInfo {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface UserState {
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
  email: string;
}

export interface AppState {
  user: UserState | null;
  groupState: GroupState;
}

export interface GroupState {
  group: number;
  pageNumber: number;
}

export interface UserLogIn {
  email: string;
  password: string;
}

export interface Data {
  words: Word[];
}

export interface AggregateResponse {
  paginatedResults: PaginatedResult[];
  totalCount: TotalCount[];
}

export interface PaginatedResult {
  _id: string;
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
  userWord: UserWord;
}

export interface TotalCount {
  count: number;
}
