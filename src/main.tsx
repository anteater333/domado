import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';

import '@/index.css';
import '@/style/global.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/">
    <RecoilRoot>
      <React.StrictMode>
        <App />
        <ToastContainer />
      </React.StrictMode>
    </RecoilRoot>
  </BrowserRouter>,
);
