#!/usr/bin/env node
var http = require('http');
var ip = require('ip');
var getPort = require('get-port');
var ecstatic = require('ecstatic');

getPort().then(function(port) {
  http.createServer(ecstatic({ root: process.cwd() })).listen(port);

  var message = 'Serving!\n\n';

  message += '- http://localhost:' + port;

  try {
    var ipAddress = ip.address();
    var networkURL = 'http://' + ipAddress + ':' + port;

    message += '\n- On your network: ' + networkURL;
  } catch (err) {}

  console.log(message);
});
