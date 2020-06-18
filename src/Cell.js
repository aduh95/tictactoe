const cellInstances = new WeakMap();

function onclick(event) {
  cellInstances.get(event.target).makeMove();
}

export default class Cell {
  #id;
  #owner;
  #game;
  #htmlElement = this.createHTMLElement();

  constructor(id, game) {
    this.#id = id;
    this.#game = game;
  }

  createHTMLElement() {
    const button = document.createElement("button");
    button.addEventListener("click", onclick);
    button.className = "cell";
    button.setAttribute("aria-label", "Empty cell");
    cellInstances.set(button, this);
    return button;
  }

  makeMove() {
    this.#game.makeMove(this);
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
