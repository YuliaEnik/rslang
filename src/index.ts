import './style.scss';
import { runApp } from './app';
import { API_ENDPOINT } from './utils/constants';

runApp();

const getUserId = () => localStorage.getItem('userId');
const getToken = () => localStorage.getItem('token');

const getUserWords = async (userId: string, token: string) => {
  const result = await fetch(`${API_ENDPOINT}/users/${userId}/words`,
    {
      method: 'GET',
      credentials: 'omit',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  const content = await result.json();
  console.log(content);
};

const isAuthorised = () => {
  const userId = getUserId();
  const token = getToken();
  if (typeof userId === 'string' && typeof token === 'string') {
    getUserWords(userId, token);
  } else {
    console.log('not authorised');
  }
};

// isAuthorised();
