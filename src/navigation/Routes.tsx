import { createHashRouter } from 'react-router-dom';
import { App } from '../App';
import { Home } from '../pages/home';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import RegistrationPage from '../pages/registration/RegistrationPage';
import User from '../pages/user/User';
import Dashboard from '../pages/user/dashboard/Dashboard';
import Team from '../pages/user/team/Team';
import Staking from '../pages/user/staking/Staking';

export const RoutesConfig = createHashRouter([
  {
    path: '/',
    element: <App></App>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: 'registration',
        element: (
          <ProtectedRoute>
            <RegistrationPage></RegistrationPage>
          </ProtectedRoute>
        ),
      },
      {
        path: 'registration/:referrerAddress',
        element: (
          <ProtectedRoute>
            <RegistrationPage></RegistrationPage>
          </ProtectedRoute>
        ),
      },
      {
        path: '/user',
        element: (
          <ProtectedRoute>
            <User></User>
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard></Dashboard>,
          },
          {
            path: 'dashboard/:userAddress',
            element: <Dashboard></Dashboard>,
          },
          {
            path: 'dashboard',
            element: <Dashboard></Dashboard>,
          },
          {
            path: 'team',
            element: <Team></Team>,
          },
          {
            path: 'team/:userAddress',
            element: <Team></Team>,
          },
          {
            path: 'staking',
            element: <Staking></Staking>,
          },
          {
            path: 'staking/:userAddress',
            element: <Staking></Staking>,
          },
        ],
      },
    ],
  },
]);
