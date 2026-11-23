import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { BASE } from './lib/media.js';
import './styles/global.css';

const el = document.getElementById('root');
const app = (
  <React.StrictMode>
    <BrowserRouter basename={BASE || '/'} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Prerendered pages hydrate; the dev server renders from scratch.
if (el.firstElementChild) hydrateRoot(el, app);
else createRoot(el).render(app);
