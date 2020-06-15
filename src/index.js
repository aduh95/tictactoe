import getTicTacToeWinner from "./tictactoeWinning.js";

const cellInstances = new WeakMap();

class Game {
  #grids = Array.from({ length: 9 }, (_, i) => new Grid(i));
  #currentGrid;
  #players = [new Player("❌"), new Player("⭕")];
  #currentPlayer = this.#players[0];

  makeMove(cell) {
    if (!this.#currentGrid) {
      this.#currentGrid = this.#grids.find((grid) => grid.has(cell));
      this.#grids.forEach((grid) => grid.disable());
    } else {
      this.#currentGrid.disable();
    }
    this.#currentGrid.makeMove(this.#currentPlayer, cell);
    this.checkForWinner();
    this.#currentPlayer = this.#players[
      (this.#players.indexOf(this.#currentPlayer) + 1) % this.#players.length
    ];
    this.#currentGrid = this.#grids[cell.id];
    this.#currentGrid.enable();
  }

  checkForWinner() {
    const winningGrids = getTicTacToeWinner(
      this.#grids,
      this.#currentGrid.id,
      this.#currentPlayer
    );
    if (winningGrids) {
      for (const gridId of winningGrids) {
        this.#grids[gridId].setWinningFlag();
      }
      throw "TODO: player wins";
    }
  }

  get htmlElement() {
    const frag = document.createDocumentFragment();
    frag.append(...this.#grids.map((grid) => grid.htmlElement));
    return frag;
  }
}

class Player {
  #symbol;

  constructor(symbol) {
    this.#symbol = symbol;
  }

  get symbol() {
    return this.#symbol;
  }
}

class Cell {
  #id;
  #owner;
  #htmlElement = this.createHTMLElement();

  constructor(id) {
    this.#id = id;
  }

  createHTMLElement() {
    const button = document.createElement("button");
    button.addEventListener("click", onclick);
    button.className = "cell";
    cellInstances.set(button, this);
    return button;
  }

  get htmlElement() {
    return this.#htmlElement;
  }

  isOwnedBy(player) {
    return this.#owner === player;
  }

  setFoot(player) {
    this.#owner = player;
    this.htmlElement.dataset.player = player.symbol;
  }

  setWinningFlag() {
    this.htmlElement.classList.add("win");
  }

  isEmpty() {
    return !this.#owner;
  }

  get id() {
    return this.#id;
  }

  enable() {
    this.htmlElement.disabled = false;
  }
  disable() {
    this.htmlElement.disabled = true;
  }
}
class Grid extends Cell {
  #cells = Array.from({ length: 9 }, (_, i) => new Cell(i));

  constructor() {
    super(...arguments);
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
      for (const cellId of winningCells) {
        this.#cells[cellId].setWinningFlag();
      }
      this.setFoot(player);
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

const game = new Game();

function onclick(event) {
  game.makeMove(cellInstances.get(event.target));
}

document.querySelector("main").append(game.htmlElement);
