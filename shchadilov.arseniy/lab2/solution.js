const OPENING_BRACKETS = new Set(['(', '[', '{']);
const BRACKET_PAIRS = new Map([
  [')', '('],
  [']', '['],
  ['}', '{'],
]);

export function isBalanced(str) {
  if (typeof str !== 'string') {
    return false;
  }

  const stack = [];

  for (const char of str) {
    if (OPENING_BRACKETS.has(char)) {
      stack.push(char);
    } else if (BRACKET_PAIRS.has(char)) {
      if (stack.pop() !== BRACKET_PAIRS.get(char)) {
        return false;
      }
    }
  }

  return stack.length === 0;
}
