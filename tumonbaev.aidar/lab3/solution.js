/**
 * Разбивает массив на подмассивы указанного размера.
 *
 * @param {Array} arr - Исходный массив.
 * @param {number} size - Размер подмассива (положительное целое число).
 * @returns {Array<Array>} Массив подмассивов.
 */
export function chunkArray(arr, size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('size must be a positive integer');
  }

  const result = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}
