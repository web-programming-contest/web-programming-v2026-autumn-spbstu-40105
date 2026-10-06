import {createApp} from './app.js';
import {PORT} from './config.js';

createApp().listen(PORT, () => {
  console.warn(`Gadget Hub API: http://localhost:${PORT}`);
});
