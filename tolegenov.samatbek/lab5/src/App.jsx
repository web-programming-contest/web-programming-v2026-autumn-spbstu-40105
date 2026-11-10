import React, {useEffect, useRef, useState} from 'react';
import {getComputerMove, getWinner} from './game.js';

const emptyBoard = () => Array(9).fill(null);

function App() {
  const [board, setBoard] = useState(emptyBoard);
  const [mode, setMode] = useState('computer');
  const boardRef = useRef(null);
  const firstCellRef = useRef(null);
  const replayButtonRef = useRef(null);

  const winner = getWinner(board);
  const isDraw = !winner && board.every((cell) => cell !== null);
  const isGameOver = Boolean(winner || isDraw);
  const moveCount = board.filter(Boolean).length;
  const isComputerTurn = mode === 'computer' && moveCount % 2 === 1;
  const currentPlayer = moveCount % 2 === 0 ? 'X' : 'O';

  useEffect(() => {
    if (isGameOver) {
      replayButtonRef.current?.focus();
    }
  }, [isGameOver]);

  useEffect(() => {
    if (!isComputerTurn || isGameOver) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      const computerMove = getComputerMove(board);

      if (computerMove !== null && computerMove !== undefined) {
        setBoard((currentBoard) => {
          if (currentBoard[computerMove] !== null) {
            return currentBoard;
          }

          const nextBoard = [...currentBoard];
          nextBoard[computerMove] = 'O';
          return nextBoard;
        });
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [board, isComputerTurn, isGameOver]);

  function handleCellClick(index) {
    if (board[index] !== null || isGameOver || isComputerTurn) {
      return;
    }

    setBoard((currentBoard) => {
      const nextBoard = [...currentBoard];
      const moveNumber = currentBoard.filter(Boolean).length;
      const symbol = mode === 'computer' || moveNumber % 2 === 0 ? 'X' : 'O';

      nextBoard[index] = symbol;
      return nextBoard;
    });
  }

  function startNewGame(nextMode = mode) {
    setMode(nextMode);
    setBoard(emptyBoard());
  }

  function startGame() {
    startNewGame();
    boardRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
    firstCellRef.current?.focus({preventScroll: true});
  }

  let status;
  if (winner) {
    status =
      mode === 'computer' && winner === 'O'
        ? 'Компьютер выиграл'
        : `Победил игрок ${winner}`;
  } else if (isDraw) {
    status = 'Ничья';
  } else if (isComputerTurn) {
    status = 'Компьютер думает…';
  } else if (mode === 'computer') {
    status = 'Ваш ход — X';
  } else {
    status = `Ход игрока ${currentPlayer}`;
  }

  const resultTitle = isDraw
    ? 'Ничья!'
    : mode === 'computer'
      ? winner === 'X'
        ? 'Вы выиграли!'
        : 'Вы проиграли'
      : `Победил игрок ${winner}`;
  const resultMessage = isDraw
    ? 'В этой партии победителя нет.'
    : mode === 'computer'
      ? winner === 'X'
        ? 'Вы обыграли компьютер.'
        : 'Компьютер оказался сильнее. Попробуйте ещё раз!'
      : `Игрок ${winner} победил в этой партии.`;

  return (
    <div className="game">
      <header className="splash-screen">
        <div className="splash-symbols" aria-hidden="true">
          <span>X</span>
          <span>O</span>
          <span>X</span>
        </div>
        <p className="eyebrow">Классическая игра</p>
        <h1>Крестики-нолики</h1>
        <p className="subtitle">
          Проверьте свою стратегию: играйте против компьютера или друг друга.
        </p>
        <button
          className="splash-start-button"
          type="button"
          onClick={startGame}
        >
          Начать игру
        </button>
      </header>

      <section className="game-panel" aria-label="Игра в крестики-нолики">
        <div className="mode-selector" aria-label="Режим игры">
          <button
            className={`mode-button${mode === 'computer' ? ' is-selected' : ''}`}
            type="button"
            aria-pressed={mode === 'computer'}
            onClick={() => startNewGame('computer')}
          >
            Против компьютера
          </button>
          <button
            className={`mode-button${mode === 'players' ? ' is-selected' : ''}`}
            type="button"
            aria-pressed={mode === 'players'}
            onClick={() => startNewGame('players')}
          >
            Два игрока
          </button>
        </div>

        <p className="game-status" aria-live="polite">
          {status}
        </p>

        <div
          ref={boardRef}
          className="game-board"
          data-testid="game-board"
          role="grid"
          aria-label="Игровое поле"
        >
          {board.map((cell, index) => (
            <button
              key={index}
              ref={index === 0 ? firstCellRef : undefined}
              className={`game-cell${cell === 'O' ? ' cell-o' : ''}`}
              type="button"
              data-testid="game-cell"
              role="gridcell"
              aria-label={`Клетка ${index + 1}${cell ? `: ${cell}` : ': пустая'}`}
              disabled={cell !== null || isGameOver || isComputerTurn}
              onClick={() => handleCellClick(index)}
            >
              {cell}
            </button>
          ))}
        </div>

        <button
          className="restart-button"
          type="button"
          data-testid="game-restart"
          onClick={() => startNewGame()}
        >
          Новая игра
        </button>

        {isGameOver && (
          <div className="result-overlay">
            <section
              className="result-dialog"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="result-title"
              aria-describedby="result-message"
            >
              <p className="result-eyebrow">Игра остановлена</p>
              <h2 id="result-title">{resultTitle}</h2>
              <p className="result-message" id="result-message">
                {resultMessage}
              </p>
              <button
                ref={replayButtonRef}
                className="restart-button"
                type="button"
                onClick={() => startNewGame()}
              >
                Играть снова
              </button>
            </section>
          </div>
        )}

        <footer className="game-footer">
          <span>X — первый игрок</span>
          <span>O — второй игрок</span>
        </footer>
      </section>
    </div>
  );
}

export default App;
