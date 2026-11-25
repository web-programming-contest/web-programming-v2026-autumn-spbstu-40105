await Promise.all([
  import('./backend/server.mjs'),
  import('./frontend/server.mjs'),
]);
