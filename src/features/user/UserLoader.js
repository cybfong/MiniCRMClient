import { redirect } from 'react-router-dom';
import store, { persistor } from '../../store.js';

export async function UserLoader() {
  const state = store.getState();
  const token = state.auth?.token;

  console.log('UserLoader diagnostic:', {
    bootstrapped: persistor.getState().bootstrapped,
    tokenExists: Boolean(token),
    authState: state.auth,
  });

  if (!token) {
    throw redirect('/');
  }

  return null;
}
