/* eslint-env jest */
var fs = require("fs");
var os = require("os");
var path = require("path");
var compose = require("./big-presentation-compose.js");

var workingDirectory;

beforeEach(function() {
  var tmp = path.join(os.tmpdir(), "./tmp-" + Date.now());
  fs.mkdirSync(tmp);
  workingDirectory = tmp;
});

test("compose", function() {
  fs.writeFileSync(path.join(workingDirectory, "./index.md"), "# hi");
  process.chdir(workingDirectory);
  compose();
  expect(fs.readdirSync(workingDirectory)).toMatchSnapshot();
  expect(
    fs.readFileSync(path.join(workingDirectory, "index.html"), "utf8")
  ).toMatchSnapshot();
});
