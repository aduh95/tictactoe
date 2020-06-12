import { watch, promises as fs } from "fs";
import { fork } from "child_process";
import { fileURLToPath } from "url";

import { startServer, refreshBrowser } from "./server.mjs";
import { JS_DEV_FILE } from "./config.mjs";

const watcher = (event, fileName) => {
  console.log(event, fileName);
  refreshBrowser();
};

const watchFile = (path) => watch(path, watcher);
const watchDir = (dir) =>
  fs.readdir(dir).then((files) =>
    Promise.all(
      files
        .filter(
          (fileName) =>
            !fileName.endsWith(".toml.d.ts") && !fileName.endsWith(".toml.js")
        )
        .map((file) => new URL(file, dir))
        .map((fileURL) =>
          fs
            .stat(fileURL)
            .then((stats) =>
              stats.isDirectory() ? watchDir(fileURL) : watchFile(fileURL)
            )
        )
    )
  );

import.meta
  .resolve("microbundle/package.json")
  .then(async (url) => {
    const { bin } = JSON.parse(await fs.readFile(new URL(url)));
    fork(fileURLToPath(new URL(bin, url)), [
      "watch",
      "--format",
      "modern",
      "--entry",
      "scripts/dev-entry.js",
    ]);
  })
  .then(startServer)
  .then(() => watchFile(JS_DEV_FILE))
  .catch(console.error);
