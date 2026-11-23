import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import { BASE } from './lib/media.js';

export { routes, DEFAULT_DESCRIPTION } from './routes.js';
export { BASE };

// `path` is a route path without the base, e.g. '/rates/'.
export function render(path) {
  return renderToString(
    <StaticRouter basename={BASE || '/'} location={BASE + path} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </StaticRouter>
  );
}
