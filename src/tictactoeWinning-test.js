import assert from "assert";
import move from "./tictactoeWinning.js";

const dataset = [
  { grid: Array.from({ length: 9 }), winner: false, cell: 0 },
  { grid: Array.from({ length: 9 }), winner: false, cell: 4 },
  { grid: [0, 0, 0, 0, 1, 0, 0, 0, 1], winner: true, cell: 0 },
  { grid: [0, 1, 1, 0, 0, 0, 0, 0, 0], winner: true, cell: 0 },
  { grid: [0, 1, 0, 0, 0, 0, 0, 0, 0], winner: false, cell: 0 },
  { grid: [0, 1, 0, 1, 0, 0, 0, 0, 0], winner: false, cell: 0 },
  { grid: [0, 1, 0, 1, 0, 0, 1, 0, 0], winner: true, cell: 0 },
  { grid: [0, 1, 0, 1, 1, 0, 0, 0, 1], winner: true, cell: 0 },
  { grid: [0, 1, 0, 1, 1, 0, 0, 0, 0], winner: false, cell: 0 },
  { grid: [0, 1, 0, 1, 1, 0, 0, 0, 0], winner: false, cell: 8 },
  { grid: [0, 1, 0, 1, 1, 0, 0, 0, 0], winner: true, cell: 7 },
  { grid: [0, 1, 0, 1, 1, 0, 0, 0, 0], winner: false, cell: 6 },
  { grid: [0, 1, 1, 1, 1, 0, 0, 0, 0], winner: true, cell: 6 },
  { grid: [0, 1, 0, 1, 0, 1, 0, 1, 0], winner: true, cell: 4 },
  { grid: [1, 0, 1, 0, 0, 0, 1, 0, 1], winner: true, cell: 4 },
  { grid: [0, 0, 1, 0, 0, 0, 0, 0, 1], winner: true, cell: 5 },
  { grid: [0, 0, 0, 0, 0, 1, 0, 0, 1], winner: true, cell: 2 },
  { grid: [0, 0, 0, 0, 0, 1, 1, 0, 1], winner: true, cell: 7 },
];

for (const data of dataset) {
  assert.strictEqual(
    move(
      data.grid.map((p) => ({ isOwnedBy: (pl) => p === pl })),
      data.cell,
      1
    ),
    data.winner,
    `[
      ${data.grid.slice(0, 3)},
      ${data.grid.slice(3, 6)},
      ${data.grid.slice(6)},
  ] should ${data.winner ? "" : "not"} be winning.`
  );
}
