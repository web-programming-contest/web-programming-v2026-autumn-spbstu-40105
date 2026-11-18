export function findPairsWithSum(arr, sum) {
  if (!Array.isArray(arr) || typeof sum !== 'number' || Number.isNaN(sum)) {
    return [];
  }

  const pairs = [];

  for (let i = 0; i < arr.length; i += 1) {
    if (typeof arr[i] !== 'number' || Number.isNaN(arr[i])) {
      continue;
    }

    for (let j = i + 1; j < arr.length; j += 1) {
      if (typeof arr[j] !== 'number' || Number.isNaN(arr[j])) {
        continue;
      }

      if (arr[i] + arr[j] === sum) {
        pairs.push([arr[i], arr[j]]);
      }
    }
  }

  return pairs;
}
