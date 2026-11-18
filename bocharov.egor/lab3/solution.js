// Вариант 21. Задача 3.
// Максимальная сумма подмассива длины n (метод скользящего окна).

export function findMaxSubarraySum(arr, n) {
  if (!Array.isArray(arr) || !arr.every(Number.isFinite)) {
    throw new TypeError('Первый аргумент должен быть массивом чисел.');
  }

  if (!Number.isInteger(n)) {
    throw new TypeError('Длина подмассива должна быть целым числом.');
  }

  if (n < 1 || n > arr.length) {
    throw new RangeError('Длина подмассива должна быть от 1 до длины массива.');
  }

  let windowSum = 0;
  for (let i = 0; i < n; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;
  for (let i = n; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - n];
    if (windowSum > maxSum) {
      maxSum = windowSum;
    }
  }

  return maxSum;
}
