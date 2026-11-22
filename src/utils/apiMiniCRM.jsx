import axios from 'axios';

// You cannot use useSelector outside REACT component !!
import store from '../store';

const API_URL = 'http://localhost:8080/api';

export async function doLogin(login) {
  try {
    const res = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(login),
    });

    console.log('Login response status:', res.status);
    console.log(
      'Login response content-type:',
      res.headers.get('content-type'),
    );

    const responseText = await res.text();
    // console.log('Login response body:', responseText);

    if (!res.ok) {
      throw new Error(`Login failed with status ${res.status}`);
    }

    return responseText;
  } catch (error) {
    console.error('doLogin error:', error);
    throw new Error('Failed to login', { cause: error });
  }
}

export function getJWTRemainingTime() {
  const token = store.getState().auth.token;
  // console.log(`JWT Token in getJWTRemainingTime() = ${token}`);

  if (!token) return '00:00';

  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return '00:00';

    // Decode Base64URL string safely
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return 'No Exp';

    const totalSeconds = exp - Math.floor(Date.now() / 1000);
    if (totalSeconds <= 0) return 'Expired';

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Formats into MM:SS (e.g. 04:05)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } catch (err) {
    console.error('Error decoding JWT:', err);
    return 'Invalid';
  }
}

export const fetchCustomers = async () => {
  const token = store.getState().auth.token;
  // console.log(`JWT Token in fetchCustomers() = ${token}`);

  try {
    const response = await axios.get(`${API_URL}/customers`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach Bearer token
      },
    });
    console.log('Customer Data from server:', response.data);
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.response?.status);
    throw error;
  }
};

export const fetchContactById = async (id) => {
  const token = store.getState().auth.token;
  // console.log(`JWT Token in fetchContactById() = ${token}`);

  try {
    const response = await axios.get(`${API_URL}/contacts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach Bearer token
      },
    });
    console.log('Contact Data from server:', response.data);
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.response?.status);
    throw error;
  }
};

export const fetchNoteById = async (id) => {
  const token = store.getState().auth.token;
  // console.log(`JWT Token in fetchNoteById() = ${token}`);

  try {
    const response = await axios.get(`${API_URL}/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach Bearer token
      },
    });
    console.log('Note Data from server:', response.data);
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.response?.status);
    throw error;
  }
};

export const fetchUserDetails = async (userName) => {
  const token = store.getState().auth.token;
  // console.log(`JWT Token in fetchUserDetails() = ${token}`);

  try {
    const response = await axios.get(`${API_URL}/user/${userName}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach Bearer token
      },
    });
    console.log('User Data from server:', response.data);
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.response?.status);
    throw error;
  }
};

export const createCustomer = async (newCustomer) => {
  const token = store.getState().auth.token;
  // console.log(`JWT Token in createCustomers() = ${token}`);

  try {
    // axios.post(url, data, config) : must follow sequence
    const response = await axios.post(
      `${API_URL}/customers`,
      {
        address: newCustomer.address,
        city: newCustomer.city,
        country: newCustomer.country,
        customerName: newCustomer.customerName,
        deleted: false,
        email: newCustomer.email,
        industry: newCustomer.industry,
        phone: newCustomer.phone,
        status: newCustomer.status,
        website: newCustomer.website,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach Bearer token
        },
      },
    );
    console.log('New Customer Data send to server:', response.data);
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.response?.status);
    throw error;
  }
};

export const updateCustomer = async (updateCustomer) => {
  const token = store.getState().auth.token;
  // console.log(`JWT Token in updateCustomers() = ${token}`);

  try {
    // axios.post(url, data, config) : must follow sequence
    const response = await axios.put(
      `${API_URL}/customers/${updateCustomer.id}`,
      {
        address: updateCustomer.address,
        city: updateCustomer.city,
        country: updateCustomer.country,
        customerName: updateCustomer.customerName,
        deleted: updateCustomer.deleted,
        email: updateCustomer.email,
        industry: updateCustomer.industry,
        phone: updateCustomer.phone,
        status: updateCustomer.status,
        website: updateCustomer.website,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach Bearer token
        },
      },
    );
    console.log('Update Customer Data send to server:', response.data);
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.response?.status);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  const token = store.getState().auth.token;
  // console.log(`JWT Token in deleteCustomers() = ${token}`);

  try {
    // axios.post(url, data, config) : must follow sequence
    const response = await axios.delete(`${API_URL}/customers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach Bearer token
      },
    });
    console.log('Deleted Customer server response :', response.data);
    return response.data;
  } catch (error) {
    console.error('Request failed:', error.response?.status);
    throw error;
  }
};
