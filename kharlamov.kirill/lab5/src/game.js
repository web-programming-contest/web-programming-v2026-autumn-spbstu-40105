export const columns = 10;
export const rows = 20;

// Число в клетке определяет тип фигуры и её цвет.
export const shapes = [
  [[1, 1, 1, 1]],
  [
    [2, 2],
    [2, 2],
  ],
  [
    [0, 3, 0],
    [3, 3, 3],
  ],
  [
    [0, 4, 4],
    [4, 4, 0],
  ],
  [
    [5, 5, 0],
    [0, 5, 5],
  ],
  [
    [6, 0, 0],
    [6, 6, 6],
  ],
  [
    [0, 0, 7],
    [7, 7, 7],
  ],
];

export function emptyBoard() {
  return Array.from({length: rows}, () => Array(columns).fill(0));
}

function randomShape() {
  return shapes[Math.floor(Math.random() * shapes.length)].map((row) => [
    ...row,
  ]);
}

function spawn(matrix) {
  return {matrix, x: Math.floor((columns - matrix[0].length) / 2), y: 0};
}

export function createGame() {
  return {
    board: emptyBoard(),
    piece: spawn(randomShape()),
    next: randomShape(),
    score: 0,
    lines: 0,
    ticks: 0,
    paused: false,
    over: false,
  };
}

export function levelOf(game) {
  return 1 + Math.floor(game.lines / 10) + Math.floor(game.ticks / 60);
}

export function fallDelay(game) {
  return Math.max(100, 800 - (levelOf(game) - 1) * 60);
}

export function fits(board, piece) {
  return piece.matrix.every((row, dy) =>
    row.every((cell, dx) => {
      if (!cell) {
        return true;
      }
      const x = piece.x + dx;
      const y = piece.y + dy;
      return x >= 0 && x < columns && y >= 0 && y < rows && board[y][x] === 0;
    }),
  );
}

export function rotate(matrix) {
  return matrix[0].map((_, x) => matrix.map((row) => row[x]).reverse());
}

export function clearLines(board) {
  const remaining = board.filter((row) => row.some((cell) => cell === 0));
  const cleared = rows - remaining.length;
  return {
    board: [
      ...Array.from({length: cleared}, () => Array(columns).fill(0)),
      ...remaining.map((row) => [...row]),
    ],
    cleared,
  };
}

function lockPiece(game) {
  const board = game.board.map((row) => [...row]);
  const {piece} = game;
  for (let y = 0; y < piece.matrix.length; y += 1) {
    for (let x = 0; x < piece.matrix[y].length; x += 1) {
      if (piece.matrix[y][x]) {
        board[piece.y + y][piece.x + x] = piece.matrix[y][x];
      }
    }
  }
  const result = clearLines(board);
  const nextPiece = spawn(game.next);
  return {
    ...game,
    board: result.board,
    piece: nextPiece,
    next: randomShape(),
    score: game.score + [0, 100, 300, 500, 800][result.cleared] * levelOf(game),
    lines: game.lines + result.cleared,
    over: !fits(result.board, nextPiece),
  };
}

function move(game, dx, dy, reward = 0) {
  const piece = {...game.piece, x: game.piece.x + dx, y: game.piece.y + dy};
  if (fits(game.board, piece)) {
    return {...game, piece, score: game.score + reward};
  }
  return dy > 0 ? lockPiece(game) : game;
}

export function gameReducer(game, action) {
  if (action === 'restart') {
    return createGame();
  }
  if (game.over) {
    return game;
  }
  if (action === 'pause') {
    return {...game, paused: !game.paused};
  }
  if (game.paused) {
    return game;
  }
  switch (action) {
    case 'left':
      return move(game, -1, 0);
    case 'right':
      return move(game, 1, 0);
    case 'down':
      return move(game, 0, 1, 1);
    case 'tick':
      return move({...game, ticks: game.ticks + 1}, 0, 1);
    case 'rotate': {
      const matrix = rotate(game.piece.matrix);
      for (const dx of [0, -1, 1, -2, 2]) {
        const piece = {...game.piece, matrix, x: game.piece.x + dx};
        if (fits(game.board, piece)) {
          return {...game, piece};
        }
      }
      return game;
    }
    case 'drop': {
      let piece = {...game.piece};
      let distance = 0;
      while (fits(game.board, {...piece, y: piece.y + 1})) {
        piece = {...piece, y: piece.y + 1};
        distance += 1;
      }
      return lockPiece({...game, piece, score: game.score + distance * 2});
    }
    default:
      return game;
  }
}

export function visibleBoard(game) {
  const board = game.board.map((row) => [...row]);
  if (!game.over) {
    game.piece.matrix.forEach((row, dy) =>
      row.forEach((cell, dx) => {
        if (cell) {
          board[game.piece.y + dy][game.piece.x + dx] = cell;
        }
      }),
    );
  }
  return board;
}
