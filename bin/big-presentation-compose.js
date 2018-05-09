#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var marked = require("marked");
var mustache = require("mustache");

function compose() {
  try {
    var markdownText = fs.readFileSync(
      path.join(process.cwd(), "./index.md"),
      "utf8"
    );
  } catch (e) {
    throw new Error(
      "This directory does not contain the required index.md file"
    );
  }

  var divs = markdownText
    .split("---")
    .filter(function(v) {
      return v.replace(/\s/g, "");
    })
    .map(function(v) {
      return "<div>" + marked(v) + "</div>";
    })
    .join("\n");

  // copy dependencies to the directory first, making sure not to overwrite
  var libDir = path.join(__dirname, "../lib/");

  fs.readdirSync(libDir).forEach(function(file) {
    fs.writeFileSync(
      path.join(process.cwd(), file),
      fs.readFileSync(path.join(libDir, file)),
      { flag: "wx" }
    );
  });

  var renderedTemplate = mustache.render(
    fs.readFileSync(path.join(__dirname, "./template.hbs"), "utf8"),
    {
      //TODO parameterize title?
      title: "big",
      slides: divs
    }
  );

  fs.writeFileSync(path.join(process.cwd(), "index.html"), renderedTemplate);
}

module.exports = compose;
if (require.main === module) compose();
