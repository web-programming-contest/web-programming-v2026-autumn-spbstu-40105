import React, {useEffect, useReducer} from 'react';
import {createRoot} from 'react-dom/client';
import {
  createGame,
  gameReducer,
  visibleBoard,
  fallDelay,
  levelOf,
} from './game.js';
import './styles.css';

function Cells({matrix, preview = false}) {
  return matrix.map((row, y) => (
    <div className="board-row" key={y}>
      {row.map((cell, x) => (
        <span
          className={`cell cell-${cell}${preview ? ' preview-cell' : ''}`}
          key={x}
        />
      ))}
    </div>
  ));
}

function App() {
  const [game, dispatch] = useReducer(gameReducer, undefined, createGame);
  const delay = fallDelay(game);

  useEffect(() => {
    if (game.paused || game.over) {
      return undefined;
    }
    const timer = setInterval(() => dispatch('tick'), delay);
    return () => clearInterval(timer);
  }, [game.paused, game.over, delay]);

  useEffect(() => {
    const actions = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowDown: 'down',
      ArrowUp: 'rotate',
      ' ': 'drop',
      p: 'pause',
      P: 'pause',
      з: 'pause',
      З: 'pause',
    };
    function onKey(event) {
      if (event.target instanceof HTMLButtonElement && event.key === ' ') {
        return;
      }
      const action = actions[event.key];
      if (action) {
        event.preventDefault();
        dispatch(action);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="game">
      <header>
        <p className="subtitle">Лабораторная работа 5 · Вариант 12</p>
        <h1>Тетрис</h1>
        <p>Собирайте полные ряды и не дайте фигурам достичь верха.</p>
      </header>
      <div className="game-layout">
        <section className="board-panel" aria-label="Игровое поле">
          <div
            className="board"
            data-testid="game-board"
            aria-label="Поле 10 на 20"
          >
            <Cells matrix={visibleBoard(game)} />
          </div>
          {(game.paused || game.over) && (
            <div className="overlay" role="status">
              {game.over ? 'Игра окончена' : 'Пауза'}
            </div>
          )}
        </section>
        <aside className="sidebar">
          <h2>Результат</h2>
          <p>
            Очки: <strong data-testid="game-score">{game.score}</strong>
          </p>
          <p>
            Линии: <strong>{game.lines}</strong>
          </p>
          <p>
            Уровень: <strong>{levelOf(game)}</strong>
          </p>
          <h2>Следующая фигура</h2>
          <div className="preview" aria-label="Следующая фигура">
            <Cells matrix={game.next} preview />
          </div>
          <div className="actions">
            <button
              type="button"
              onClick={() => dispatch('pause')}
              disabled={game.over}
            >
              {game.paused ? 'Продолжить' : 'Пауза'}
            </button>
            <button type="button" onClick={() => dispatch('restart')}>
              Новая игра
            </button>
          </div>
          <h2>Управление</h2>
          <p>
            ← → — движение
            <br />↑ — поворот
            <br />↓ — ускоренное падение
            <br />
            Пробел — сбросить фигуру
            <br />P — пауза
          </p>
          <p className="hint">
            За 1–4 линии: 100, 300, 500 или 800 очков × уровень. Скорость растёт
            каждые 10 линий и каждые 60 шагов таймера.
          </p>
        </aside>
      </div>
      <div className="touch-controls" aria-label="Кнопки управления">
        <button
          type="button"
          aria-label="Влево"
          onClick={() => dispatch('left')}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Повернуть"
          onClick={() => dispatch('rotate')}
        >
          ↻
        </button>
        <button
          type="button"
          aria-label="Вправо"
          onClick={() => dispatch('right')}
        >
          →
        </button>
        <button
          type="button"
          aria-label="Вниз"
          onClick={() => dispatch('down')}
        >
          ↓
        </button>
        <button type="button" onClick={() => dispatch('drop')}>
          Сбросить
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
