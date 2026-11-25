function findPairsWithSum(arr, sum) {
  const pairs = [];
  const seen = new Set();

  for (const x of arr) {
    const complement = sum - x;
    if (seen.has(complement)) {
      pairs.push([complement, x]);
    }
    seen.add(x);
  }

  return pairs;
}

export {findPairsWithSum};
