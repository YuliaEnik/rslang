import { appState } from '../../../app';
import { API_ENDPOINT } from '../../../utils/constants';
import { router } from '../../../utils/router';
import { AuthInfo, ResponseStatus, UserLogIn, UserState } from '../../../utils/types';

function updateAppStateUser(userState: UserState): void {
  appState.user.token = userState.token;
  appState.user.refreshToken = userState.refreshToken;
  appState.user.userId = userState.userId;
  appState.user.name = userState.name;
  appState.user.email = userState.email;
}

function saveToStoreUser(userState: UserState) {
  if (userState.token) {
    localStorage.setItem('token', userState.token);
  }
  if (userState.refreshToken) {
    localStorage.setItem('refreshToken', userState.refreshToken);
  }
  if (userState.userId) {
    localStorage.setItem('userId', userState.userId);
  }
  if (userState.name) {
    localStorage.setItem('userName', userState.name);
  }
  if (userState.email) {
    localStorage.setItem('email', userState.email);
  }
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
    updateAppStateUser({
      token: content.token,
      refreshToken: content.refreshToken,
      userId: content.userId,
      name: content.name,
      email: user.email,
    });
    saveToStoreUser({
      token: content.token,
      refreshToken: content.refreshToken,
      userId: content.userId,
      name: content.name,
      email: user.email,
    });
    alert(`${user.email}, you logged in`);
    // show pop up about success
    setTimeout(() => router.navigate('/'), 1000);
  }

  if (response.status === ResponseStatus.INVALID_TOKEN) {
    // show message
    alert('Wrong email / password. Please check spelling.');
  }
}
