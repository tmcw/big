/* eslint-env jest */
var fs = require("fs");
var os = require("os");
var path = require("path");
var init = require("./big-presentation-init.js");
var offline = require("./big-presentation-offline.js");

var workingDirectory;

beforeEach(function() {
  var tmp = path.join(os.tmpdir(), "./tmp-" + Date.now());
  fs.mkdirSync(tmp);
  workingDirectory = tmp;
});

test("offline", async () => {
  process.chdir(workingDirectory);
  init(Object.assign({}, process, { argv: [] }));
  expect(fs.readdirSync(workingDirectory)).toMatchSnapshot();
  await offline();
  expect(fs.readdirSync(workingDirectory)).toMatchSnapshot();
  expect(
    fs.readFileSync(path.join(workingDirectory, "index.offline.html"), "utf8")
  ).toMatchSnapshot();
});
