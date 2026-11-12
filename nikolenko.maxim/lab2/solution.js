export function analyzieString(str) {
  const result = {
    letters: 0,
    digits: 0,
    spaces: 0,
    other: 0,
  };

  for (const char of str) {
    if (/\p{L}/u.test(char)) {
      result.letters++;
    } else if (/\d/.test(char)) {
      result.digits++;
    } else if (char === ' ') {
      result.spaces++;
    } else {
      result.other++;
    }
  }

  return result;
}
