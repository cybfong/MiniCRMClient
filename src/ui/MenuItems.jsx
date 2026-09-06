import Customer from '../features/customer/Customer';
import Dashboard from '../features/dashboard/Dashboard';
import Setting from '../features/setting/Setting';
import User from '../features/user/User';
import { iconCog8Tooth, iconHome, iconInboxStack, iconUsers } from './icons/AppIcons';

export const menuItems = [
  {
    text: 'Dashboard',
    path: '/dashboard',
    icon: iconHome,
    element: <Dashboard />,
  },
  {
    text: 'Users',
    path: '/user',
    icon: iconUsers,
    element: <User />,
  },
  {
    text: 'Customers',
    path: '/customer',
    icon: iconInboxStack,
    element: <Customer />,
  },
  {
    text: 'Settings',
    path: '/setting',
    icon: iconCog8Tooth,
    element: <Setting />,
  },
];
