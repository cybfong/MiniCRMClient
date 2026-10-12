import { redirect } from 'react-router-dom';
import store, { persistor } from '../../store.js';
import { fetchCustomers } from '../../utils/apiMiniCRM';

export async function CustomerLoader() {
  const state = store.getState();
  const token = state.auth?.token;

  console.log('CustomerLoader diagnostic:', {
    bootstrapped: persistor.getState().bootstrapped,
    tokenExists: Boolean(token),
    authState: state.auth,
  });

  if (!token) {
    throw redirect('/');
  }

  return fetchCustomers();
}
