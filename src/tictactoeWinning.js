function isHorizontalWin(cells, cell, player) {
  const startId = ((cell / 3) | 0) * 3;
  for (let i = 0; i < 3; i++) {
    if (cells[startId + i] !== player) return false;
  }
  return true;
}

function isVerticalWin(cells, cell, player) {
  const startId = cell % 3;
  for (let i = 0; i < 3; i++) {
    if (cells[startId + i * 3] !== player) return false;
  }
  return true;
}

function isDiagonalWin(cells, cell, player) {
  if (cell % 1) return false; // if cell not on diagonal
  return isDiagonalWin1(...arguments) || isDiagonalWin2(...arguments);
}
function isDiagonalWin1(cells, cell, player) {
  if (cell % 4 === 2) return false;
  for (let i = 0; i < 3; i++) {
    if (cells[i * 4] !== player) return false;
  }
  return true;
}
function isDiagonalWin2(cells, cell, player) {
  if (cell % 8 === 0) return false;
  for (let i = 1; i < 4; i++) {
    if (cells[i * 2] !== player) return false;
  }
  return true;
}

export default function makeAMove(cells, cell, player) {
  cells[cell] = player;
  return (
    isVerticalWin(...arguments) ||
    isHorizontalWin(...arguments) ||
    isDiagonalWin(...arguments)
  );
}
