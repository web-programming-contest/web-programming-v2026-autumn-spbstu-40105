import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

function dataPath(fileName) {
  return path.join(DATA_DIR, fileName);
}

// Читает JSON-файл асинхронно и парсит его в JS-структуру.
// Если файла ещё нет — считаем, что данных пока нет, и возвращаем пустой массив,
// а не падаем с ошибкой (так orders.json может отсутствовать до первого заказа).
export async function readJson(fileName) {
  try {
    const raw = await readFile(dataPath(fileName), 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Записывает JS-структуру обратно в JSON-файл, асинхронно.
export async function writeJson(fileName, data) {
  const json = JSON.stringify(data, null, 2);
  await writeFile(dataPath(fileName), json, 'utf-8');
}
