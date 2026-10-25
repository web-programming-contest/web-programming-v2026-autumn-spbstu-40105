import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

import {DATA_DIR} from './config.js';

const writeQueues = new Map();

function resolve(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

export async function readJson(name) {
  const content = await readFile(resolve(name), 'utf8');

  return JSON.parse(content);
}

export function updateJson(name, update) {
  const previous = writeQueues.get(name) ?? Promise.resolve();

  const next = previous.then(async () => {
    const data = await readJson(name);
    const result = await update(data);

    await writeFile(resolve(name), `${JSON.stringify(data, null, 2)}\n`);

    return result;
  });

  writeQueues.set(
    name,
    next.catch(() => undefined),
  );

  return next;
}
