import { appState } from "../app";
import { createUserWord } from "./api";
import { UserState } from "./types";

export function addWordToDifficultList(wordId: string) {
  return createUserWord(appState.user, wordId, { difficulty: "difficult" });
}