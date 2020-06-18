export default class Player {
  #symbol;

  constructor(symbol) {
    this.#symbol = symbol;
  }

  get symbol() {
    return this.#symbol;
  }
}
