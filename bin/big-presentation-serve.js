#!/usr/bin/env node
var http = require('http');
var ip = require('ip');
var getPort = require('get-port');
var ecstatic = require('ecstatic');
var WebSocket = require('ws');

getPort({port: process.env.PORT}).then(function(port) {
  var wsPort = port + 1;

  try {
    var socketServer = new WebSocket.Server({ port: wsPort })
  } catch(e) {
    console.error('Error starting socket server')
    console.error(e)
  }

  socketServer.on('connection', function connection(socket) {
    socket.on('message', function incoming(data) {
      // Broadcast to everyone else.
      socketServer.clients.forEach(function each(client) {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });
  });

  http.createServer(ecstatic({ root: process.cwd() })).listen(port);
  var message = 'Serving!\n\n';

  message += '- http://localhost:' + port;
  message += '\n- sockets at ws://localhost:' + wsPort

  try {
    var ipAddress = ip.address();
    var networkURL = 'http://' + ipAddress + ':' + port;

    message += '\n- On your network: ' + networkURL;
  } catch (err) {}

  console.log(message);
});
