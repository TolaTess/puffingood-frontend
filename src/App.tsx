import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import FoodMenu from './pages/FoodMenu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import TermsAndConditions from './pages/TermsAndConditions';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'menu', element: <FoodMenu /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'orders', element: <Orders /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'terms', element: <TermsAndConditions /> },
    ],
  },
  {
    path: '/admin',
    element: <Layout />,
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { index: true, element: <AdminDashboard /> },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
