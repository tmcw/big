#!/usr/bin/env node
const program = require("commander");

program.command("offline").action(() => {
  const Inliner = require("inliner");
  const http = require("http");
  const ecstatic = require("ecstatic");
  const getPort = require("get-port");
  const fs = require("fs");
  getPort().then(function(port) {
    const server = http
      .createServer(ecstatic({ root: process.cwd() }))
      .listen(port, function() {
        new Inliner("http://localhost:" + port, function(error, html) {
          // compressed and inlined HTML page
          fs.writeFileSync("./index.offline.html", html);
          console.log("Done! Wrote index.offline.html with inlined resources");
          server.close();
        });
      });
  });
});

program.command("init <dir>").action(directory => {
  const path = require("path");
  const fs = require("fs");
  const cpy = require("cpy");

  if (directory) {
    fs.mkdirSync(directory);
    init(directory);
  } else {
    init("./");
  }

  function init(inDirectory) {
    cpy(path.join(__dirname, "../lib/*"), inDirectory);
  }
});

program.command("serve").action(() => {
  const http = require("http");
  const ip = require("ip");
  const getPort = require("get-port");
  const ecstatic = require("ecstatic");

  getPort({ port: process.env.PORT }).then(function(port) {
    http.createServer(ecstatic({ root: process.cwd() })).listen(port);

    let message = "Serving!\n\n";

    message += `- http://localhost:${port}`;

    try {
      const ipAddress = ip.address();
      const networkURL = `http://${ipAddress}:${port}`;

      message += `\n- On your network: ${networkURL}`;
    } catch (err) {}

    console.log(message);
  });
});

program.parse(process.argv);
