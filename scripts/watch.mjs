import { watch, promises as fs } from "fs";

import { startServer, refreshBrowser } from "./server.mjs";
import { SOURCE_FOLDER } from "./config.mjs";

let antiRebound;
const watcher = (event, fileName) => {
  console.log(event, fileName);
  if (!antiRebound) {
    antiRebound = setTimeout(() => {
      antiRebound = null;
    }, 5000);
    refreshBrowser();
  }
};

const watchFile = (path) => watch(path, watcher);
const watchDir = (dir) =>
  fs
    .readdir(dir)
    .then((files) =>
      Promise.all(
        files
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

watchDir(SOURCE_FOLDER).then(startServer).catch(console.error);
