import {scrypt, timingSafeEqual} from 'node:crypto';
import {Buffer} from 'node:buffer';
import {promisify} from 'node:util';

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;

export async function verifyPassword(password, salt, expectedHash) {
  const actual = await scryptAsync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(expectedHash, 'hex');

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
