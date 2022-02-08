import { API_ENDPOINT } from '../../utils/constants';
import { router } from '../../utils/router';
import { NewUser, ResponseStatus, User } from '../../utils/types';

export async function createUser(newUser: NewUser): Promise<void> {
  const response = await fetch(`${API_ENDPOINT}/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });

  if (response.status === ResponseStatus.EXISTED) {
    console.log('User already exits. Please go to sign in');
    return;
    // show pop up and
    // navigate to sign in page
  }
  const content = await response.json();
  if (response.status === ResponseStatus.SUCCESS) {
    // show pop up and
    router.navigate('/');
  }

  if (response.status === ResponseStatus.CREDENTIALS) {
    // show message
    console.log(content.error.errors[0].message);
  }
}

export const registeredUser: User = {
  id: '61ffee4722bec43941d5013',
  name: 'DummyUser',
  email: 'dummy1@email.com',
};

export async function signIn(user: User) {
  const rawResponse = await fetch(`${API_ENDPOINT}/signin`, {
    method: 'POST',
  });
}
