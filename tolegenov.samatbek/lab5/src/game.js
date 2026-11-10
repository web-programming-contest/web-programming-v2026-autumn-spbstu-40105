const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function getWinner(board) {
  for (const [first, second, third] of winningLines) {
    if (
      board[first] &&
      board[first] === board[second] &&
      board[first] === board[third]
    ) {
      return board[first];
    }
  }

  return null;
}

export function getComputerMove(board) {
  const availableCells = board
    .map((cell, index) => (cell === null ? index : null))
    .filter((index) => index !== null);

  function findWinningMove(symbol) {
    for (const index of availableCells) {
      const nextBoard = [...board];
      nextBoard[index] = symbol;

      if (getWinner(nextBoard) === symbol) {
        return index;
      }
    }

    return null;
  }

  const winningMove = findWinningMove('O');

  if (winningMove !== null) {
    return winningMove;
  }

  const blockingMove = findWinningMove('X');

  if (blockingMove !== null) {
    return blockingMove;
  }

  if (board[4] === null) {
    return 4;
  }

  return availableCells[Math.floor(Math.random() * availableCells.length)];
}
