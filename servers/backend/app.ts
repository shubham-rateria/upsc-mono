import config from "./config";

import express from "express";
import https from "https";
import fs from "fs";

async function startServer() {
  const app = express();

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/
  await require("./loaders").default(app);

  // serve the API with signed certificate on 443 (SSL/HTTPS) port
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync("./privkey.pem"),
      cert: fs.readFileSync("./fullchain.pem"),
    },
    app
  );

  httpsServer.listen(443, () => {
    console.log("HTTPS Server running on port 443");
  });

  app
    .listen(config.port, () => {
      console.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    })
    .on("error", (err) => {
      console.error(err);
      process.exit(1);
    });
}

startServer();
