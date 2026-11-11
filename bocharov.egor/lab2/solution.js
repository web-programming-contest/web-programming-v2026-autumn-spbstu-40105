// Вариант 21. Задача 2.
// Генерация всех простых чисел до заданного числа (решето Эратосфена).

export function generatePrimes(limit) {
  if (!Number.isInteger(limit)) {
    throw new TypeError('Аргумент должен быть целым числом.');
  }

  if (limit < 2) {
    return [];
  }

  const isPrime = new Array(limit + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) {
        isPrime[j] = false;
      }
    }
  }

  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }

  return primes;
}
