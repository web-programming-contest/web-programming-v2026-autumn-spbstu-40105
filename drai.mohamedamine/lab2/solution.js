export function findLongestPalindrome(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return '';
  }

  let start = 0;
  let maxLength = 0;

  const expandAroundCenter = (left, right) => {
    let l = left;
    let r = right;
    while (l >= 0 && r < str.length && str[l] === str[r]) {
      l -= 1;
      r += 1;
    }
    return r - l - 1;
  };

  for (let i = 0; i < str.length; i += 1) {
    const lenOdd = expandAroundCenter(i, i);
    const lenEven = expandAroundCenter(i, i + 1);
    const currentMax = Math.max(lenOdd, lenEven);

    if (currentMax > maxLength) {
      maxLength = currentMax;
      start = i - Math.floor((currentMax - 1) / 2);
    }
  }

  return str.slice(start, start + maxLength);
}
