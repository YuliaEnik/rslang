import { appState, data } from '../../../app';
import { getUserWordsForGame } from '../../../utils/api';
import { router } from '../../../utils/router';
import { Word } from '../../../utils/types';

async function getWordsForGame(game: string) {
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
      if (!word.userWord?.optional?.isLearned) {
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
          if (!word.userWord?.optional?.isLearned) {
            if (data.words.length < 20) {
              data.words.push(word);
            }
          }
        });
      }
    }

    if (game === 'sprint') {
      router.navigate('/sprint/play');
    } else if (game === 'audio') {
      alert(`Game ${game} is under contruction`);
    }
  }
}

export async function playGame(event: Event): Promise<void> {
  const target = (event.target as HTMLElement).closest('.games__item');
  if (target) {
    const game = target.getAttribute('data-game') as string;
    getWordsForGame(game);
  }
}
