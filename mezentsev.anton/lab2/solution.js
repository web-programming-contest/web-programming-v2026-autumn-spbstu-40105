// Вариант 28. Задача 2.
// Вычислить значение математического выражения, переданного строкой.
// Поддерживаются +, -, *, /, скобки и дробные числа с точкой.
// Разбор выполняется без eval() и Function().

export function calculateExpression(expr) {
  if (typeof expr !== 'string') {
    throw new TypeError('Выражение должно быть строкой.');
  }

  let position = 0;

  function skipSpaces() {
    while (position < expr.length && /\s/.test(expr[position])) {
      position++;
    }
  }

  // Сложение и вычитание имеют самый низкий приоритет.
  function parseExpression() {
    let result = parseTerm();
    skipSpaces();

    while (expr[position] === '+' || expr[position] === '-') {
      const operator = expr[position++];
      const value = parseTerm();
      result = operator === '+' ? result + value : result - value;
      skipSpaces();
    }

    return result;
  }

  // Умножение и деление выполняются раньше сложения и вычитания.
  function parseTerm() {
    let result = parseFactor();
    skipSpaces();

    while (expr[position] === '*' || expr[position] === '/') {
      const operator = expr[position++];
      const value = parseFactor();

      if (operator === '/' && value === 0) {
        throw new RangeError('Деление на ноль невозможно.');
      }

      result = operator === '*' ? result * value : result / value;
      skipSpaces();
    }

    return result;
  }

  // Множитель: число, выражение в скобках или значение со знаком.
  function parseFactor() {
    skipSpaces();

    if (expr[position] === '+' || expr[position] === '-') {
      const sign = expr[position++];
      const value = parseFactor();
      return sign === '-' ? -value : value;
    }

    if (expr[position] === '(') {
      position++;
      const value = parseExpression();
      skipSpaces();

      if (expr[position] !== ')') {
        throw new SyntaxError('Пропущена закрывающая скобка.');
      }

      position++;
      return value;
    }

    const match = expr.slice(position).match(/^(\d+(\.\d*)?|\.\d+)/);
    if (!match) {
      throw new SyntaxError(`Ожидалось число на позиции ${position + 1}.`);
    }

    position += match[0].length;
    return Number(match[0]);
  }

  const result = parseExpression();
  skipSpaces();

  if (position !== expr.length) {
    throw new SyntaxError(`Недопустимый символ на позиции ${position + 1}.`);
  }
  if (!Number.isFinite(result)) {
    throw new RangeError('Результат выходит за допустимый диапазон чисел.');
  }

  return result;
}
