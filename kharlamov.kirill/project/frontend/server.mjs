import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {extname, resolve, sep} from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const pages = new Set(['/', '/login', '/catalog', '/cart']);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
};

createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname,
    );
    const file = resolve(root, `.${pages.has(path) ? '/index.html' : path}`);
    const type = types[extname(file)];
    if (!file.startsWith(resolve(root) + sep) || !type) {
      response.writeHead(404).end();
      return;
    }
    const content = await readFile(file);
    response.writeHead(200, {'Content-Type': type}).end(content);
  } catch {
    response.writeHead(404).end();
  }
}).listen(3000, '127.0.0.1', () =>
  console.warn('Gadget Hub — http://127.0.0.1:3000'),
);
