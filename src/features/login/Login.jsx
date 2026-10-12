import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Button from '../../ui/Button';
import { iconLockClosed } from '../../ui/icons/AppIcons';
import { doLogin } from '../../utils/apiMiniCRM';
import { updateName, updateToken } from './authSlice';

function Login() {
  // Pull the setter function from the outlet context
  const { setFooterText, startLoader, stopLoader } = useOutletContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setFooterText('Login to manage client relationships');
  }, [setFooterText]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const login = {
      userName: username,
      password,
    };

    // Show Loader and start the timer.
    const minimumDelay = startLoader();

    try {
      // 1. Authenticate
      const jwtToken = await doLogin(login);

      // 2. Save authentication details
      dispatch(updateName(username));
      dispatch(updateToken(jwtToken));

      // 3. Wait before navigating
      await minimumDelay;

      // 4. Navigate to Customers
      await navigate('/customer');
    } catch (error) {
      console.error('Login failed:', error);
      setFooterText('Invalid User Name and/or Password');
    } finally {
      // If login failed early, wait for the remaining delay.
      // If the delay already finished, this resolves immediately.
      await minimumDelay;

      // Stop manual loading.
      stopLoader();
    }
  };

  return (
    <div className="mt-20 flex items-center justify-center">
      <form className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-6 shadow-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-stone-200">
            {iconLockClosed}
          </div>
        </div>

        <div className="mb-2 flex items-center justify-center">
          <span className="text-3xl font-semibold">Log In</span>
        </div>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <label htmlFor="username" className="sm:basis-20">
            User Name
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="grow rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:ring-3 focus:ring-indigo-400 focus:outline-none md:px-6 md:py-3"
            placeholder="Enter username"
          />
        </div>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <label htmlFor="password" className="sm:basis-20">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="grow rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:ring-3 focus:ring-indigo-400 focus:outline-none md:px-6 md:py-3"
            placeholder="Enter password"
          />
        </div>

        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!username || !password ? true : false}
        >
          Continue
        </Button>
      </form>
    </div>
  );
}

export default Login;
