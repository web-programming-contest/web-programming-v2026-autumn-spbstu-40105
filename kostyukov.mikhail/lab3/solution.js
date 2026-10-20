export function chunkArray(arr, size) {
  if (!Array.isArray(arr) || !Number.isInteger(size) || size <= 0) {
    return [];
  }

  const result = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}
