var path = require('path');
var shelljs = require('shelljs');
var directory = process.argv[2];

if (directory) {
  shelljs.mkdir(directory);
  init(directory);
} else {
  init('./');
}

function init(inDirectory) {
  shelljs.cp(path.join(__dirname, '../lib/*'), inDirectory);
}
