/**
 * Преобразует десятичное число в двоичную строку без ведущих нулей.
 *
 * @param {number} num - Целое десятичное число (может быть отрицательным).
 * @returns {string} Строковое представление числа в двоичной системе.
 */
export function toBinary(num) {
  if (!Number.isInteger(num)) {
    throw new TypeError('toBinary expects an integer');
  }

  if (num === 0) {
    return '0';
  }

  const sign = num < 0 ? '-' : '';
  const binary = Math.abs(num).toString(2);

  return sign + binary;
}
