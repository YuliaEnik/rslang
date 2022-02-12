import { API_ENDPOINT } from '../../../utils/constants';
import { NewUser, ResponseStatus } from '../../../utils/types';
import { logInUser } from '../login';

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
    alert('User already exits. Please go to sign in');
    // show pop up and
    // navigate to log in page
    // router.navigate('/login');
  }
  const content = await response.json();
  if (response.status === ResponseStatus.SUCCESS) {
    // show pop up
    logInUser(newUser);
  }

  if (response.status === ResponseStatus.CREDENTIALS) {
    // show error message
    console.log(content.error.errors[0].message);
  }
}
