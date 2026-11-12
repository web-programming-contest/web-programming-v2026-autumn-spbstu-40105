export function zipArrays(...arrays) {
  if (arrays.length === 0) {
    return [];
  }

  const result = [];
  const length = arrays[0].length;

  for (let i = 0; i < length; i++) {
    const row = [];

    for (let j = 0; j < arrays.length; j++) {
      row.push(arrays[j][i]);
    }

    result.push(row);
  }

  return result;
}
