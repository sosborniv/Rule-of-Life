import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles/index.css';
import App from './App';
import { AuthProvider } from './lib/useAuth';
import SignIn from './app/onboarding/SignIn';
import Silence from './app/silence/Silence';
import Examen from './app/examen/Examen';
import Lectio from './app/lectio/Lectio';
import Breath from './app/breath/Breath';
import Rule from './app/rule/Rule';
import Journal from './app/journal/Journal';
import Settings from './app/settings/Settings';
import Protected from './components/Protected';

const router = createBrowserRouter([
  { path: '/onboarding/sign-in', element: <SignIn /> },
  {
    path: '/', element: (
      <Protected>
        <App />
      </Protected>
    ),
    children: [
      { index: true, element: <Silence /> },
      { path: 'silence', element: <Silence /> },
      { path: 'examen', element: <Examen /> },
      { path: 'lectio', element: <Lectio /> },
      { path: 'breath', element: <Breath /> },
      { path: 'rule', element: <Rule /> },
      { path: 'journal', element: <Journal /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
