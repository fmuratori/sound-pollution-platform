import {
    createBrowserRouter,
  } from 'react-router-dom';
import React from 'react';

import App from './App.jsx';
import Device from './routes/Device.jsx';
import Devices from './routes/Devices.jsx';
import ErrorPage from './routes/ErrorPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/device',
        element: <Device />,
      },
      {
        path: '/',
        element: <Devices />,
      },
      {
        path: '*',
        element: <ErrorPage />,
      }
    ]
  }
]);

export default router;