import React, {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

function App() {
  const [display, setDisplay] = useState('0');
  const [firstNumber, setFirstNumber] = useState(null);
  const [operation, setOperation] = useState(null);
  const [newNumber, setNewNumber] = useState(false);

  function handleNumber(number) {
    if (newNumber || display === '0' || display === 'Ошибка') {
      setDisplay(number);
      setNewNumber(false);
    } else {
      setDisplay(`${display}${number}`);
    }
  }

  function handleDot() {
    if (newNumber || display === 'Ошибка') {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(`${display}.`);
    }
  }

  function handleClear() {
    setDisplay('0');
    setFirstNumber(null);
    setOperation(null);
    setNewNumber(false);
  }

  function handleSign() {
    if (display !== '0' && display !== 'Ошибка') {
      setDisplay(String(-Number(display)));
    }
  }

  function handlePercent() {
    if (display !== 'Ошибка') {
      setDisplay(String(Number(display) / 100));
    }
  }

  function calculate(first, second, selectedOperation) {
    if (selectedOperation === 'add') {
      return first + second;
    }

    if (selectedOperation === 'subtract') {
      return first - second;
    }

    if (selectedOperation === 'multiply') {
      return first * second;
    }

    if (selectedOperation === 'divide') {
      if (second === 0) {
        return null;
      }

      return first / second;
    }

    return second;
  }

  function handleOperation(selectedOperation) {
    if (display === 'Ошибка') {
      return;
    }

    if (firstNumber !== null && operation !== null && !newNumber) {
      const result = calculate(firstNumber, Number(display), operation);

      if (result === null) {
        setDisplay('Ошибка');
        setFirstNumber(null);
        setOperation(null);
        return;
      }

      setFirstNumber(result);
      setDisplay(String(result));
    } else {
      setFirstNumber(Number(display));
    }

    setOperation(selectedOperation);
    setNewNumber(true);
  }

  function handleEquals() {
    if (firstNumber === null || operation === null) {
      return;
    }

    const result = calculate(firstNumber, Number(display), operation);

    if (result === null) {
      setDisplay('Ошибка');
    } else {
      setDisplay(String(result));
    }

    setFirstNumber(null);
    setOperation(null);
    setNewNumber(true);
  }

  return (
    <div className="calculator">
      <h1>Калькулятор</h1>

      <div className="display" data-testid="calculator-display">
        {display}
      </div>

      <div className="buttons">
        <button
          className="special"
          data-testid="calculator-clear"
          onClick={handleClear}
        >
          C
        </button>
        <button className="special" onClick={handleSign}>
          +/−
        </button>
        <button className="special" onClick={handlePercent}>
          %
        </button>
        <button
          className="operator"
          data-operation="divide"
          onClick={() => handleOperation('divide')}
        >
          ÷
        </button>

        <button
          data-testid="calculator-key"
          data-value="7"
          onClick={() => handleNumber('7')}
        >
          7
        </button>
        <button
          data-testid="calculator-key"
          data-value="8"
          onClick={() => handleNumber('8')}
        >
          8
        </button>
        <button
          data-testid="calculator-key"
          data-value="9"
          onClick={() => handleNumber('9')}
        >
          9
        </button>
        <button
          className="operator"
          data-operation="multiply"
          onClick={() => handleOperation('multiply')}
        >
          ×
        </button>

        <button
          data-testid="calculator-key"
          data-value="4"
          onClick={() => handleNumber('4')}
        >
          4
        </button>
        <button
          data-testid="calculator-key"
          data-value="5"
          onClick={() => handleNumber('5')}
        >
          5
        </button>
        <button
          data-testid="calculator-key"
          data-value="6"
          onClick={() => handleNumber('6')}
        >
          6
        </button>
        <button
          className="operator"
          data-operation="subtract"
          onClick={() => handleOperation('subtract')}
        >
          −
        </button>

        <button
          data-testid="calculator-key"
          data-value="1"
          onClick={() => handleNumber('1')}
        >
          1
        </button>
        <button
          data-testid="calculator-key"
          data-value="2"
          onClick={() => handleNumber('2')}
        >
          2
        </button>
        <button
          data-testid="calculator-key"
          data-value="3"
          onClick={() => handleNumber('3')}
        >
          3
        </button>
        <button
          className="operator"
          data-operation="add"
          onClick={() => handleOperation('add')}
        >
          +
        </button>

        <button
          className="zero"
          data-testid="calculator-key"
          data-value="0"
          onClick={() => handleNumber('0')}
        >
          0
        </button>
        <button onClick={handleDot}>.</button>
        <button
          className="equals"
          data-testid="calculator-equals"
          onClick={handleEquals}
        >
          =
        </button>
      </div>
    </div>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
