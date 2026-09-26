export function calculateExpression(expr) {
  const tokens = expr.match(/\d+\.?\d*|[+\-*/()]/g);
  if (!tokens) throw new Error('Пустое или некорректное выражение');

  let pos = 0;

  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseExpr() {
    let value = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = next();
      const right = parseTerm();
      value = op === '+' ? value + right : value - right;
    }
    return value;
  }

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