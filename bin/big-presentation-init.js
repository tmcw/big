#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
var cpy = require('cpy');
var directory = process.argv[2];

if (directory) {
  fs.mkdirSync(directory);
  init(directory);
} else {
  init('./');
}

function init(inDirectory) {
  cpy(path.join(__dirname, '../lib/*'), inDirectory);
}
