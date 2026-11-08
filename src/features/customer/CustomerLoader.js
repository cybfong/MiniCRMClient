import { redirect } from 'react-router-dom';
import store, { persistor } from '../../store.js';
import {
  fetchContactById,
  fetchCustomers,
  fetchNoteById,
} from '../../utils/apiMiniCRM';

const getActiveRecords = (records = []) =>
  records.filter((record) => !record.deleted && record.id != null);

const getRequestedIds = (url, key) => [
  ...new Set(
    url.searchParams
      .getAll(key)
      .map(Number)
      .filter((id) => Number.isSafeInteger(id) && id > 0),
  ),
];

export async function CustomerLoader({ request }) {
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

  const url = new URL(request.url);

  // Mode 2: load related records for a clicked customer.
  if (url.searchParams.get('mode') === 'related') {
    const contactIds = getRequestedIds(url, 'contactId');
    const noteIds = getRequestedIds(url, 'noteId');

    const [contacts, notes] = await Promise.all([
      Promise.all(contactIds.map(fetchContactById)),
      Promise.all(noteIds.map(fetchNoteById)),
    ]);

    return {
      mode: 'related',
      contacts: getActiveRecords(contacts),
      notes: getActiveRecords(notes),
    };
  }

  // Mode 1: initial Customer page load.
  const customers = await fetchCustomers();

  const initialCustomer =
    customers.find((customer) => !customer.deleted) ?? customers[0] ?? null;

  return {
    mode: 'initial',
    customers,
    activeCustomerId: initialCustomer?.id ?? null,

    // Your current customer API already embeds these records.
    contacts: getActiveRecords(initialCustomer?.contacts ?? []),
    notes: getActiveRecords(initialCustomer?.notes ?? []),
  };
}
