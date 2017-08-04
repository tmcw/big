#!/usr/bin/env node

// Pulled from https://github.com/tmcw/biggie/blob/gh-pages/cli.js
var concat = require('concat-stream');
var fs = require('fs');
var marked = require('marked');
var mustache = require('mustache');

fs.createReadStream('index.md').pipe(concat(convert));

function convert(data) {
    var divs = data.toString().split('---').filter(function(v) {
        return v.replace(/\s/g, '');
    }).map(function(v) {
        return '<div>' + marked(v) + '</div>';
    }).join('\n');

    fs.writeFileSync('index.html', mustache.render(
        fs.readFileSync('template.hbs', 'utf8'), {
        //TODO parameterize title?
        title: 'big',
        slides: divs
    }), null, 2)
}
