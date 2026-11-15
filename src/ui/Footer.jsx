import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJWTRemainingTime } from '../utils/apiMiniCRM';
import { useSelector } from 'react-redux';
import { getUserName } from '../features/login/authSlice';

function Footer({
  message,
  optionalMessage,
  optionalMessageStyle = 'text-stone-300',
}) {
  const [timeLeft, setTimeLeft] = useState(getJWTRemainingTime());
  const navigate = useNavigate();
  const userName = useSelector(getUserName);

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
    <footer className="border-t border-slate-400 bg-slate-700 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between text-lg font-semibold text-stone-200">
        <span>
          {message}
          {optionalMessage && optionalMessage.trim() !== '' && (
            <span className="ml-2">
              [
              <span className={`${optionalMessageStyle}`}>
                {optionalMessage}
              </span>
              ]
            </span>
          )}
        </span>
        {userName && <span>Time to logout : [{timeLeft}]</span>}
      </div>
    </footer>
  );
}

export default Footer;
