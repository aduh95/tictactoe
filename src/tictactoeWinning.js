function isHorizontalWin(cells, cellId, player) {
  const startId = ((cellId / 3) | 0) * 3;
  const ids = [];
  for (let i = 0; i < 3; i++) {
    if (!cells[startId + i].isOwnedBy(player)) return false;
    ids.push(startId + i);
  }
  return ids;
}

function isVerticalWin(cells, cellId, player) {
  const startId = cellId % 3;
  const ids = [];
  for (let i = 0; i < 3; i++) {
    if (!cells[startId + i * 3].isOwnedBy(player)) return false;
    ids.push(startId + i * 3);
  }
  return ids;
}

function isDiagonalWin(cells, cellId, player) {
  if (cellId % 1) return false; // if cellId not on diagonal
  return isDiagonalWin1(...arguments) || isDiagonalWin2(...arguments);
}
function isDiagonalWin1(cells, cellId, player) {
  if (cellId % 4 === 2) return false;
  const ids = [];
  for (let i = 0; i < 3; i++) {
    if (!cells[i * 4].isOwnedBy(player)) return false;
    ids.push(i * 4);
  }
  return ids;
}
function isDiagonalWin2(cells, cellId, player) {
  if (cellId % 8 === 0) return false;
  const ids = [];
  for (let i = 1; i < 4; i++) {
    if (!cells[i * 2].isOwnedBy(player)) return false;
    ids.push(i * 2);
  }
  return ids;
}

export default function makeAMove(cells, cellId, player) {
  return (
    isVerticalWin(...arguments) ||
    isHorizontalWin(...arguments) ||
    isDiagonalWin(...arguments)
  );
}
