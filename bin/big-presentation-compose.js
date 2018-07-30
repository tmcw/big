#!/usr/bin/env node

var fs = require('fs');
var cpy = require('cpy');
var path = require('path');
var marked = require('marked');
var mustache = require('mustache');
var minimist = require('minimist');

var options = minimist(process.argv.slice(2), {
  string: ['theme'],
  alias: {
    theme: 't'
  },
  default: {
    theme: 'light'
  }
})

try {
  var markdownText = fs.readFileSync('index.md', 'utf8');
} catch (e) {
  throw new Error('This directory does not contain the required index.md file');
}

var divs = markdownText.split('---').filter(function(v) {
  return v.replace(/\s/g, '');
}).map(function(v) {
  return '<div>' + marked(v) + '</div>';
}).join('\n');

// copy dependencies to the directory first, making sure not to overwrite
cpy(path.join(__dirname, '../lib/*'), './', { overwrite: false })
  .then(function() {
    var renderedTemplate = mustache.render(
      fs.readFileSync(path.join(__dirname, './template.hbs'), 'utf8'), {
        //TODO parameterize title?
        title: 'big',
        slides: divs,
        theme: options.theme
      });
    fs.writeFileSync('index.html', renderedTemplate);
  })
  .catch(function(error) {
    console.error(error);
  });
