import { promises as fs } from "fs";
import Terser from "terser";

import { SOURCE_FOLDER, DIST_FOLDER, ESM_FILE, SW_FILE } from "./config.mjs";

const CACHE_VERSION = "v1";

const onInstall = (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(/* Array of files here */);
    })
  );
};

const onFetch = (event) => {
  const networkResponse = fetch(event.request).then((response) => {
    return response.ok
      ? caches.open(CACHE_VERSION).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        })
      : new Response(
          "<h1>Not Found</h1>" +
            "<p>This request failed. Maybe a typo or a dead link?</p>" +
            '<p><img src="./icon.svg" alt="Home"></p>' +
            '<p><a href="./index.html">Back to the game</a></p>',
          {
            headers: { "Content-Type": "text/html" },
            status: 404,
            statusText: "Not Found",
          }
        );
  });
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || networkResponse)
      .catch(console.error)
  );
};

async function* getPublicFiles(dir) {
  const files = await fs.readdir(dir);
  for (const fileName of files) {
    const fileURL = new URL(fileName, dir);
    const stats = await fs.stat(fileURL);
    if (stats.isDirectory()) {
      yield* getPublicFiles(fileURL);
    } else if (!fileName.endsWith(".js")) {
      yield fileURL;
    }
  }
}

export default Promise.resolve().then(async () => {
  const files = [`./${ESM_FILE}`];
  for await (const url of getPublicFiles(SOURCE_FOLDER)) {
    const { pathname } = url;
    const relativeURL = "." + pathname.substring(pathname.lastIndexOf("/"));

    if (!pathname.endsWith("index.html")) {
      await fs.copyFile(url, new URL(relativeURL, DIST_FOLDER));
    }
    files.push(relativeURL);
  }

  const { error, code } = Terser.minify(
    `
        "use strict";
        const CACHE_VERSION = "${CACHE_VERSION}";
        self.addEventListener("install", ${onInstall
          .toString()
          .replace("/* Array of files here */", JSON.stringify(files))});
        self.addEventListener("fetch", ${onFetch.toString()});
        `,
    { toplevel: true }
  );
  return error
    ? Promise.reject(error)
    : fs.writeFile(new URL(SW_FILE, DIST_FOLDER), code);
});
