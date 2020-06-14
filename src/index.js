import getTicTacToeWinner from "./tictactoeWinning.js";

const cellInstances = new WeakMap();
const gridInstances = new WeakMap();

class Game {
  #grids = Array.from({ length: 9 }, (_, i) => new Grid(i));
  #currentGrid;
  #players = [new Player("❌"), new Player("⭕")];
  #currentPlayer = this.#players[0];

  makeMove(cell) {
    if (!this.#currentGrid) {
      this.#currentGrid = this.#grids.find((grid) => grid.has(cell));
    }
    this.#currentGrid.makeMove(this.#currentPlayer, cell);
    this.checkForWinner();
    this.#currentPlayer = this.#players[
      (this.#players.indexOf(this.#currentPlayer) + 1) % this.#players.length
    ];
    this.#currentGrid = this.#grids[cell.id];
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

  _onclick(cell, event) {
    this.makeMove(cell);
  }

  render() {
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
  #winningState = false;
  #owner;
  htmlElement;

  constructor(id) {
    this.#id = id;
    this.initHTMLElement();
  }

  initHTMLElement() {
    const button = document.createElement("button");
    button.addEventListener("click", onclick);
    button.className = "cell";
    cellInstances.set(button, this);
    this.htmlElement = button;
  }

  isOwnedBy(player) {
    return this.#owner === player;
  }

  setFoot(player) {
    this.#owner = player;
    this.htmlElement.dataset.player = player.symbol;
  }

  setWinningFlag() {
    this.#winningState = true;
    this.htmlElement.classList.add("win");
  }

  isEmpty() {
    return !this.#owner;
  }

  get id() {
    return this.#id;
  }

  _onclick(event) {
    return this.props.onclick(this, event);
  }
}
class Grid extends Cell {
  #cells = Array.from({ length: 9 }, (_, i) => new Cell(i));

  constructor() {
    super(...arguments);
    this.htmlElement.append(...this.#cells.map((cell) => cell.htmlElement));
  }

  initHTMLElement(id) {
    const div = document.createElement("div");
    div.className = "tic-tac-toe";
    gridInstances.set(div, this);
    this.htmlElement = div;
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
    cell.setFoot(player);
    this.checkForWinner(player, cell);
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
}

const game = new Game();

function onclick(event) {
  game.makeMove(cellInstances.get(event.target));
}

document.querySelector("main").append(game.render());
