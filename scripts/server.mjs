import { promises as fs, constants, createReadStream } from "fs";

import { SOURCE_FOLDER } from "./config.mjs";

const requestListener = async (req, res) => {
  const fileURL = new URL(
    req.url === "/"
      ? "index.html"
      : req.url.startsWith("/scripts/")
      ? ".." + req.url
      : req.url.substring(1),
    SOURCE_FOLDER
  );

  if (req.url.endsWith(".js")) {
    res.setHeader("Content-Type", "application/javascript");
  } else if (req.url.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  } else if (req.url.endsWith(".svg")) {
    res.setHeader("Content-Type", "image/svg+xml");
  }

  fs.access(fileURL, constants.R_OK)
    .then(() => {
      createReadStream(fileURL).pipe(res);
    })
    .catch((e) => {
      console.error(e, fileURL);
      res.statusCode = 404;
      res.end(`Cannot find '${req.url}' on this server.`);
    });
};

const connections = new Set();
const PORT_NUMBER = 8080;
export const startServer = () =>
  Promise.all([import("http"), import("ws")])
    .then((_) => _.map((module) => module.default))
    .then(([{ createServer }, { Server }]) => {
      const server = createServer(requestListener).listen(
        PORT_NUMBER,
        "localhost",
        () => {
          console.log(`Server started on http://localhost:${PORT_NUMBER}`);
        }
      );

      new Server({ server }).on("connection", (connection) => {
        connections.add(connection);

        connection.ping(1);
      });

      return () =>
        new Promise((done) => {
          for (const connection of connections) {
            connection.terminate();
          }
          server.unref().close(done);
        });
    });

export const refreshBrowser = () => {
  const OPEN = 1;
  for (const wsConnection of connections) {
    if (wsConnection.readyState === OPEN) {
      console.log("Sending socket to refresh browser");
      wsConnection.send("refresh");
    }
  }
  return true;
};
