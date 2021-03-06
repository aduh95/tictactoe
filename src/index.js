import Game from "./Game.js";

Game.startNewGame();

if (typeof PRODUCTION_ENV !== "undefined") {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js", { scope: "./" })
      .then(() => {
        const div = document.createElement("div");
        const remove = () => div.remove();
        div.style.position = "fixed";
        div.style.bottom = "1rem";
        div.style.right = "50vw";
        div.style.transform = "translateX(50%)";
        div.style.backgroundColor = "#888A";
        div.style.color = "#fff";
        div.style.padding = "1rem";
        div.style.borderRadius = "3px";
        div.style.cursor = "pointer";
        div.textContent = "Ready to work offline";
        div.addEventListener("click", remove);
        setTimeout(remove, 2999);
        document.body.append(div);
      })
      .catch((error) => {
        // registration failed
        console.warn(error);
      });
  }
} else {
  import("../scripts/autoRefresh.js").catch(console.warn);
}
