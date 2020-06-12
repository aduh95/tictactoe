import { render } from "preact";
import { html } from "htm/preact";

function App() {
  return html`<p>Game grid here soon!</p>`;
}
render(html`<${App} />`, document.querySelector("main"));
