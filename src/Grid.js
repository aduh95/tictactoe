import Cell from "./Cell.js";
import getTicTacToeWinner from "./tictactoeWinning.js";
import launchFireworks from "./fireworks.js";

export default class Grid extends Cell {
  #cells;

  constructor(id, game) {
    super(id);
    this.#cells = Array.from({ length: 9 }, (_, i) => new Cell(i, game));
    this.htmlElement.append(...this.#cells.map((cell) => cell.htmlElement));
  }

  createHTMLElement() {
    const div = document.createElement("div");
    div.className = "tic-tac-toe";
    return div;
  }

  has(cell) {
    return this.#cells.includes(cell);
  }

  isLegal(cell) {
    return (
      this.has(cell) &&
      (cell.isEmpty() || this.#cells.every((cell) => !cell.isEmpty()))
    );
  }

  makeMove(player, cell) {
    if (!this.isLegal(cell)) {
      throw new Error("Illegal move");
    }
    if (cell.isEmpty()) {
      cell.setFoot(player);
      this.checkForWinner(player, cell);
    }
  }

  checkForWinner(player, cell) {
    if (!this.isEmpty()) return;
    const winningCells = getTicTacToeWinner(this.#cells, cell.id, player);
    if (winningCells) {
      const boundingRect = this.htmlElement.getBoundingClientRect();
      const canvas = launchFireworks(9, 200, boundingRect.height / 1000);
      for (const cellId of winningCells) {
        this.#cells[cellId].setWinningFlag();
      }
      this.setFoot(player);
      canvas.style.top = boundingRect.top - boundingRect.height / 6 + "px";
      canvas.style.left = boundingRect.left + "px";
      document.body.append(canvas);
    }
  }

  /**
   * Enables empty cells
   * When there are no empty cells, all cells are enabled.
   */
  enable() {
    const lonelyCells = this.#cells.filter((cell) => cell.isEmpty());
    (lonelyCells.length ? lonelyCells : this.#cells).forEach((cell) =>
      cell.enable()
    );
  }
  disable() {
    this.#cells.forEach((cell) => cell.disable());
  }
}
