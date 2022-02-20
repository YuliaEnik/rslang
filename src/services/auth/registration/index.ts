import { appStateUi } from '../../../app';
import { API_ENDPOINT } from '../../../utils/constants';
import { router } from '../../../utils/router';
import { ApiErrorDetails, NewUser, ResponseStatus } from '../../../utils/types';
import { logInUser } from '../login';

export async function createUser(newUser: NewUser): Promise<void> {
  appStateUi.signUpErrors = [];
  const response = await fetch(`${API_ENDPOINT}/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });

  if (!response.ok) {
    let body = '';
    let errorMessages = [];
    if (response.body) {
      body = await response.text();
      errorMessages.push(body);
    }
    try {
      const content = JSON.parse(body);
      const errors = content.error.errors.map((el: ApiErrorDetails) => el.message);
      errorMessages = errors;
    } catch (error) {
      // Ignore
    }
    appStateUi.signUpErrors = errorMessages;
    router.reload();
  }

  if (response.status === ResponseStatus.SUCCESS) {
    // show pop up
    logInUser(newUser);
  }
}
