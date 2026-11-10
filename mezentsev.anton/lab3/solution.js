// Вариант 28. Задача 3.
// Вернуть наиболее часто встречающийся элемент массива.
export function findMostFrequent(arr) {
  const counts = new Map();

  // Подсчитываем, сколько раз встречается каждый элемент.
  for (const item of arr) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  let mostFrequent;
  let maxCount = 0;

  // Map сохраняет порядок первого появления элементов.
  // При равной частоте оставляем первый встретившийся элемент.
  for (const [item, count] of counts) {
    if (count > maxCount) {
      mostFrequent = item;
      maxCount = count;
    }
  }

  return mostFrequent;
}
