import { appState } from '../../../app';
import { data } from '../../../components/sprint/sprintApp';
import { getUserWordsforGame } from '../../../utils/api';
import { router } from '../../../utils/router';
import { Word } from '../../../utils/types';

async function getWordsforGame(game: string) {
  let result = await getUserWordsforGame(appState.user, {
    group: appState.groupState.group,
    page: appState.groupState.pageNumber,
    wordsPerPage: 20,
  });
  data.splice(0, data.length);

  const content = [...result];
  if (content[0]) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    const words = content[0]['paginatedResults'] as Word[];
    words.forEach((word: Word) => {
      if (!word.userWord?.optional.isLearned) {
        data.push(word);
      }
    });

    if (data.length < 20 && appState.groupState.pageNumber > 0) {
      result = await getUserWordsforGame(appState.user, {
        group: appState.groupState.group,
        page: appState.groupState.pageNumber - 1,
        wordsPerPage: 20,
      });
      const contentNew = [...result];
      if (contentNew[0]) {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        const wordsNew = contentNew[0]['paginatedResults'] as Word[];
        wordsNew.forEach((word: Word) => {
          if (!word.userWord?.optional.isLearned) {
            if (data.length < 20) {
              data.push(word);
            }
          }
        });
      }
    }

    if (game === 'sprint') {
      router.navigate('/games');
    } else if (game === 'audio') {
      alert(`Game ${game} is under contruction`)
    }
  }
}

export async function playGame(event: Event): Promise<void> {
  const target = (event.target as HTMLElement).closest('.games__item');
  if (target) {
    const game = target.getAttribute('data-game') as string;
    getWordsforGame(game);
  }
}
