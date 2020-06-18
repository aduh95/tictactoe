import { promises as fs } from "fs";

import csso from "csso";
import marked from "marked";

import {
  SOURCE_FOLDER,
  DIST_FOLDER,
  ESM_FILE,
  ES5_FILE,
} from "./build-config.mjs";

export default Promise.all(
  ["index.html", "main.css", "../RULES.md"].map((fileName) =>
    fs.readFile(new URL(fileName, SOURCE_FOLDER), "utf8")
  )
)
  .then(([html, css, rules]) => {
    return html
      .replace(
        '<script src="index.js" type="module"></script>',
        `<script src="${ESM_FILE}" type="module"></script>` +
          `<script src="${ES5_FILE}" nomodule></script>`
      )
      .replace(
        '<link rel="stylesheet" type="text/css" href="main.css" />',
        `<style>${csso.minify(css).css}</style>`
      )
      .replace(
        "<!-- Rules of the game here -->",
        marked(rules.substring(rules.indexOf("\n")))
      );
  })
  .then((html) => fs.writeFile(new URL("index.html", DIST_FOLDER), html));
