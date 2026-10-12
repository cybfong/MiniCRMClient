import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUsername, logout } from '../features/login/authSlice';
import {
  iconArrowRightStartOnRectangle,
  iconCog8Tooth,
  iconHome,
  iconInboxStack,
  iconUsers,
} from './icons/AppIcons';

import { persistor } from '../store';

const menuItems = [
  {
    text: 'Dashboard',
    path: '/dashboard',
    icon: iconHome,
  },
  {
    text: 'Customers',
    path: '/customer',
    icon: iconInboxStack,
  },
  {
    text: 'Users',
    path: '/user',
    icon: iconUsers,
  },
  {
    text: 'Settings',
    path: '/setting',
    icon: iconCog8Tooth,
  },
  {
    text: 'Logout',
    path: '/',
    icon: iconArrowRightStartOnRectangle,
    action: 'logout',
  },
];

function Header({ onLoadingStart, onLoadingEnd }) {
  const username = useSelector(getUsername);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleIconClick = async (item) => {
    // Show Loader and start the 500ms timer.
    const minimumDelay = onLoadingStart();

    console.log('handleIconCLick in Header Component : ', item);

    try {
      if (item.action === 'logout') {
        dispatch(logout());

        // Continue to login even if persisted-state cleanup fails.
        await persistor.purge().catch((error) => {
          console.error('Logout cleanup failed:', error);
        });
      }

      // Wait before navigating.
      await minimumDelay;

      await navigate(
        item.path,
        item.action === 'logout' ? { replace: true } : undefined,
      );
    } catch (error) {
      console.error('Navigation failed:', error);

      // Also respect the delay if an error occurred early.
      await minimumDelay;
    } finally {
      // Stop manual loading. React Router can keep the
      // Loader visible while destination data is loading.
      onLoadingEnd();
    }
  };

  // Each time clicking an icon, the header is re-rendered.
  // console.log('Header is re-rendered !!');

  return (
    <header className="flex items-center border-b border-slate-400 bg-violet-400 px-4 py-3 tracking-widest text-stone-200 sm:px-6">
      <span className="text-3xl font-semibold italic">Mini-CRM</span>
      {username && (
        <>
          <nav className="ml-12 flex items-center justify-center gap-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleIconClick(item)}
                  title={item.text}
                  aria-label={item.text}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 ${
                    isActive
                      ? 'bg-violet-500 text-white'
                      : 'text-stone-200 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {item.icon}
                </button>
              );
            })}
          </nav>
          <div className="ml-auto">
            <span className="text-xl font-semibold uppercase">{username}</span>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
