import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import router from './router.jsx';
import './index.scss';

import {SocketContext, socket} from './socket.js';

import moment from 'moment'
import 'moment/locale/it'  // without this line it didn't work
moment.locale('it')


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <RouterProvider router={router} />
    </SocketContext.Provider>
  </React.StrictMode>
);
