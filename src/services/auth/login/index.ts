import { appState } from '../../../app';
import { API_ENDPOINT } from '../../../utils/constants';
import { router } from '../../../utils/router';
import {
  AuthInfo, ResponseStatus, UserLogIn, UserState,
} from '../../../utils/types';

function updateAppStateUser(userState: UserState): void {
  appState.user = userState;
}

export function saveUserToLocalStorage(userState: UserState): void {
  if (userState) {
    localStorage.setItem('userState', JSON.stringify(userState));
  }
}

export function loadUserFromLocalStorage(): UserState | null {
  const userStateJson = localStorage.getItem('userState');
  if (userStateJson) {
    const result = JSON.parse(userStateJson) as UserState;
    return result;
  }

  return null;
}

export async function logInUser(user: UserLogIn): Promise<void> {
  const response = await fetch(`${API_ENDPOINT}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (response.status === ResponseStatus.SUCCESS) {
    const content: AuthInfo = await response.json();
    const userState = {
      token: content.token,
      refreshToken: content.refreshToken,
      userId: content.userId,
      name: content.name,
      email: user.email,
    };
    updateAppStateUser(userState);
    saveUserToLocalStorage(userState);
    alert(`${user.email}, you logged in`);
    // show pop up about success
    setTimeout(() => router.navigate('/'), 1000);
  }

  if (response.status === ResponseStatus.INVALID_TOKEN) {
    // show message
    alert('Wrong email / password. Please check spelling.');
  }
}
