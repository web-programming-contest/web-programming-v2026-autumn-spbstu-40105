export function isPerfectNumber(number) {
  if (number <= 1) {
    return false;
  }

  let sum = 0;

  for (let i = 1; i < number; i++) {
    if (number % i === 0) {
      sum += i;
    }
  }

  return sum === number;
}
