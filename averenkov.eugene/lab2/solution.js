function calculateExpression(expr) {
  // 1. Токенизация
  const tokens = expr.match(/\d+\.?\d*|[+\-*/()]/g);
  if (!tokens) throw new Error('Пустое или некорректное выражение');

  let pos = 0;

  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  // expr := term (('+' | '-') term)*
  function parseExpr() {
    let value = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = next();
      const right = parseTerm();
      value = op === '+' ? value + right : value - right;
    }
    return value;
  }

  // term := factor (('*' | '/') factor)*
  function parseTerm() {
    let value = parseFactor();
    while (peek() === '*' || peek() === '/') {
      const op = next();
      const right = parseFactor();
      if (op === '/' && right === 0) throw new Error('Деление на ноль');
      value = op === '*' ? value * right : value / right;
    }
    return value;
  }

  // factor := number | '(' expr ')' | '-' factor
  function parseFactor() {
    const token = next();
    if (token === '(') {
      const value = parseExpr();
      if (next() !== ')') throw new Error('Не хватает закрывающей скобки');
      return value;
    }
    if (token === '-') {
      return -parseFactor();
    }
    const num = parseFloat(token);
    if (isNaN(num)) throw new Error(`Неожиданный токен: ${token}`);
    return num;
  }

  const result = parseExpr();
  if (pos !== tokens.length) throw new Error('Лишние символы после выражения');
  return result;
}

console.log(calculateExpression("2 + 3 * 4")); // 14
console.log(calculateExpression("(2 + 3) * 4")); // 20
console.log(calculateExpression("10 / 2 - 3")); // 2
console.log(calculateExpression("-5 + 3")); // -2