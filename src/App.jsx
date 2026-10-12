import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Customer from './features/customer/Customer';
import { CustomerLoader } from './features/customer/CustomerLoader';
import Dashboard from './features/dashboard/Dashboard';
import Login from './features/login/Login';
import Setting from './features/setting/Setting';
import User from './features/user/User';
import { UserLoader } from './features/user/UserLoader';
import AppLayout from './ui/AppLayout';

// Create the router once, outside the React component.
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Login />,
      },
      {
        path: '/customer',
        element: <Customer />,
        loader: CustomerLoader,
      },
      {
        path: '/user',
        element: <User />,
        loader: UserLoader,
      },
      {
        path: '/setting',
        element: <Setting />,
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
