import { appState, data } from '../../../app';
import { getUserWordsForGame } from '../../../utils/api';
import { convertWordFromAggregated } from '../../../utils/operations';
import { router } from '../../../utils/router';
import { Word } from '../../../utils/types';
import { random } from '../../../utils/utils';

async function getWordsForGame(game: string) {
  if (appState.groupState.group === 6) {
    const requestOptions = {
      wordsPerPage: 3600,
      filter: JSON.stringify({ 'userWord.difficulty': 'difficult' }),
    };
    const responseDifficultWords = await getUserWordsForGame(appState.user, requestOptions);
    const convertedDifficultWords = responseDifficultWords[0]
      .paginatedResults.map((word) => convertWordFromAggregated(word));
    const maxWordsQuantity = convertedDifficultWords.length < 20 ? convertedDifficultWords.length : 20;

    const indexes = new Set();
    while (indexes.size < maxWordsQuantity) {
      indexes.add(random(maxWordsQuantity));
    }
    const setIterator = indexes.values();
    for (let i = 0; i < indexes.size; i++) {
      data.words.push(convertedDifficultWords[setIterator.next().value]);
    }
  } else if (appState.groupState.group !== 6) {
    let result = await getUserWordsForGame(appState.user, {
      group: appState.groupState.group,
      page: appState.groupState.pageNumber,
      wordsPerPage: 20,
    });
    data.words.splice(0, data.words.length);

    const content = [...result];
    if (content[0]) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      const words = content[0]['paginatedResults'] as Word[];
      words.forEach((word: Word) => {
        if (word.userWord?.difficulty !== 'studied') {
          data.words.push(word);
        }
      });

      if (data.words.length < 20 && appState.groupState.pageNumber > 0) {
        result = await getUserWordsForGame(appState.user, {
          group: appState.groupState.group,
          page: appState.groupState.pageNumber - 1,
          wordsPerPage: 20,
        });
        const contentNew = [...result];
        if (contentNew[0]) {
          // eslint-disable-next-line @typescript-eslint/dot-notation
          const wordsNew = contentNew[0]['paginatedResults'] as Word[];
          wordsNew.forEach((word: Word) => {
            if (word.userWord?.difficulty !== 'studied') {
              if (data.words.length < 20) {
                data.words.push(word);
              }
            }
          });
        }
      }
    }
  }

  if (game === 'sprint') {
    router.navigate('/sprint/play');
  } else if (game === 'audioChallenge') {
    router.navigate('/audioChallenge/play');
  }
}

export async function playGame(event: Event): Promise<void> {
  const target = (event.target as HTMLElement).closest('.games__item');
  if (target) {
    const game = target.getAttribute('data-game') as string;
    data.words = [];
    getWordsForGame(game);
  }
}
