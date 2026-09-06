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
    console.log('Login response content-type:', res.headers.get('content-type'));

    const responseText = await res.text();
    console.log('Login response body:', responseText);

    if (!res.ok) {
      throw new Error(`Login failed with status ${res.status}`);
    }

    return responseText;
  } catch (error) {
    console.error('doLogin error:', error);
    throw new Error('Failed to login', { cause: error });
  }
}

export function getUserName() {
  const token = sessionStorage.getItem('jwtToken');

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userName = payload.sub;

    console.log('Logged-in user:', userName);
    return userName;
  }
}

export function getJWTRemainingTime() {
  const token = sessionStorage.getItem('jwtToken');
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
