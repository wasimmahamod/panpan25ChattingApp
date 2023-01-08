import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store'
import { Provider } from 'react-redux'
import firebaseConfig from './firebaseConfig';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Singup from './pages/singup';
import Login from './pages/login';
import Forgetpassword from './pages/forgetpass';
import Message from './pages/message/Message';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Singup/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/forget",
    element: <Forgetpassword/>,
  },
  {
    path: "/home",
    element: <App/>,
  },
  {
    path: "/msg",
    element: <Message/>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

);

