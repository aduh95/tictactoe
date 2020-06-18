import getTicTacToeWinner from "./tictactoeWinning.js";
import launchFireworks from "./fireworks.js";
import Grid from "./Grid.js";
import Player from "./Player.js";

export default class Game {
  #grids = Array.from({ length: 9 }, (_, i) => new Grid(i, this));
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

  static startNewGame() {
    const newGame = new Game();
    const main = document.querySelector("main");
    while (main.firstChild) main.removeChild(main.firstChild);
    main.append(newGame.htmlElement);
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

      form.addEventListener("submit", Game.startNewGame);
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
