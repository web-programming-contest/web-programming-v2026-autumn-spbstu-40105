export function zipArrays(...arrays) {
  if (arrays.length === 0) {
    return [];
  }

  const length = Math.min(...arrays.map((array) => array.length));
  return Array.from({length}, (_, index) =>
    arrays.map((array) => array[index]),
  );
}
