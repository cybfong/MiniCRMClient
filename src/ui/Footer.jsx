import { useSelector } from 'react-redux';
import { getUsername } from '../features/login/authSlice';
import { getJWTRemainingTime } from '../utils/apiMiniCRM';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Footer({ message }) {
  const username = useSelector(getUsername);
  const [timeLeft, setTimeLeft] = useState(getJWTRemainingTime());
  const navigate = useNavigate();

  // Auto-update remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getJWTRemainingTime();
      setTimeLeft(remaining);
      // Optional: Auto-logout if token expires
      if (remaining === 'Expired') {
        sessionStorage.removeItem('jwtToken');
        navigate('/');
      }
    }, 1000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [navigate]);

  return (
    <footer className="border-t border-slate-400 bg-gray-500 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between text-lg font-semibold text-stone-200">
        <span>{message}</span>
        {username && <span>Time to logout : [{timeLeft}]</span>}
      </div>
    </footer>
  );
}

export default Footer;
