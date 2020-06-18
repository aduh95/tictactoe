import getTicTacToeWinner from "./tictactoeWinning.js";
import launchFireworks from "./fireworks.js";

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
    if (!this.checkForWinner()) {
      this.#currentPlayer = this.#players[
        (this.#players.indexOf(this.#currentPlayer) + 1) % this.#players.length
      ];
      this.#currentGrid = this.#grids[cell.id];
      this.#currentGrid.enable();
    }
  }

  checkForWinner() {
    const winningGrids = getTicTacToeWinner(
      this.#grids,
      this.#currentGrid.id,
      this.#currentPlayer
    );
    if (winningGrids) {
      for (const gridId of winningGrids) {
        const grid = this.#grids[gridId];
        const boundingRect = grid.htmlElement.getBoundingClientRect();
        const canvas = launchFireworks(9, 200, boundingRect.height / 1000);
        canvas.style.top = boundingRect.top - boundingRect.height / 6 + "px";
        canvas.style.left = boundingRect.left + "px";
        document.body.append(canvas);
        grid.setWinningFlag();
      }

      Game.showDialog(this.#currentPlayer).append(launchFireworks(20, 150));

      return false;
    }
  }

  get htmlElement() {
    const frag = document.createDocumentFragment();
    frag.append(...this.#grids.map((grid) => grid.htmlElement));
    return frag;
  }

  static showDialog(player) {
    if (!this.dialogElement) {
      const celebrateWinnerBanner = document.createElement("dialog");
      const h2 = document.createElement("h2");
      celebrateWinnerBanner.winnerSymbol = document.createTextNode(
        player.symbol
      );
      h2.append(celebrateWinnerBanner.winnerSymbol, " wins!");
      const form = document.createElement("form");
      form.method = "dialog";
      const button = document.createElement("input");
      button.type = "submit";
      button.value = "New Game";
      form.append(button);

      form.addEventListener("submit", startNewGame);
      celebrateWinnerBanner.append(h2, form);
      document.body.append(celebrateWinnerBanner);
      this.dialogElement = celebrateWinnerBanner;
    } else {
      this.dialogElement.winnerSymbol = player.symbol;
    }
    this.dialogElement.showModal();
    return this.dialogElement;
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
    button.setAttribute("aria-label", "Empty cell");
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
    this.htmlElement.removeAttribute("aria-label");
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

let game = new Game();

function startNewGame() {
  const newGame = new Game();
  const main = document.querySelector("main");
  while (main.firstChild) main.removeChild(main.firstChild);
  main.append(newGame.htmlElement);
  game = newGame;
}

function onclick(event) {
  game.makeMove(cellInstances.get(event.target));
}

document.querySelector("main").append(game.htmlElement);
