import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './NavBar.tsx';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <React.StrictMode>
      <NavBar />
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
