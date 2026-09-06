import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import AppLayout from './ui/AppLayout';
import Login from './ui/Login';
import { menuItems } from './ui/MenuItems';

function RequireAuth({ children }) {
  const token = sessionStorage.getItem('jwtToken');
  if (!token) {
    return <Navigate to='/login' replace />;
  }
  return children;
}

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: menuItems.map((item) => ({
      path: item.path,
      element: item.element,
    })),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
