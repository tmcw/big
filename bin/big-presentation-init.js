#!/usr/bin/env node
var path = require("path");
var fs = require("fs");

function init(process) {
  var directory = process.argv[2];
  if (directory) {
    fs.mkdirSync(directory);
    init(directory);
  } else {
    init(process.cwd());
  }

  function init(inDirectory) {
    var libDir = path.join(__dirname, "../lib/");
    fs.readdirSync(libDir).forEach(function(file) {
      fs.writeFileSync(
        path.join(inDirectory, file),
        fs.readFileSync(path.join(libDir, file)),
        { flag: "wx" }
      );
    });
  }
}

module.exports = init;
if (require.main === module) init(process);
