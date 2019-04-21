#!/usr/bin/env node
var Inliner = require('inliner');
var http = require('http');
var ecstatic = require('ecstatic');
var getPort = require('get-port');
var fs = require('fs');

getPort().then(function(port) {
  var server = http
    .createServer(ecstatic({ root: process.cwd() }))
    .listen(port, function() {
      new Inliner('http://localhost:' + port, function(error, html) {
        // compressed and inlined HTML page
        fs.writeFileSync('./index.offline.html', html);
        console.log('Done! Wrote index.offline.html with inlined resources');
        server.close();
      });
    });
});
