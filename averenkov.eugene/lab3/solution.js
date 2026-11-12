export function findMostFrequent(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('Массив пуст или не является массивом');
  }

  const counts = new Map();
  let mostFrequent = arr[0];
  let maxCount = 0;

  for (const item of arr) {
    const count = (counts.get(item) || 0) + 1;
    counts.set(item, count);
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = item;
    }
  }

  return mostFrequent;
}
