'use strict';

var nodeStatic = require('node-static');
var http = require('http');
var https = require('https');
var fs = require('fs');
var socketIO = require('socket.io');

// Configuration: Use HTTPS if certificates exist, otherwise HTTP
var useHTTPS = false;
var options = {};

try {
  if (fs.existsSync('2279791_gonnavis.com.key') && fs.existsSync('2279791_gonnavis.com.pem')) {
    options = {
      key: fs.readFileSync('2279791_gonnavis.com.key'),
      cert: fs.readFileSync('2279791_gonnavis.com.pem'),
    };
    useHTTPS = true;
  }
} catch (e) {
  console.log('SSL certificates not found, using HTTP (for local development)');
}

var fileServer = new(nodeStatic.Server)();
var app;

// Get port from environment (for deployment) or use default
var PORT = process.env.PORT || 8080;

if (useHTTPS) {
  app = https.createServer(options, function(req, res) {
    // CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    fileServer.serve(req, res);
  }).listen(PORT);
  console.log('HTTPS server running on port ' + PORT);
} else {
  app = http.createServer(function(req, res) {
    // CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    fileServer.serve(req, res);
  }).listen(PORT);
  console.log('HTTP server running on port ' + PORT);
  if (process.env.PORT) {
    console.log('Deployed mode: Server accessible at public URL');
  } else {
    console.log('Local development mode: http://localhost:8080');
  }
}

var io = socketIO.listen(app, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
io.sockets.on('connection', function(socket) {

  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function(room) {
    log('Received request to create or join room ' + room);

    // Get clients in room - compatible with Socket.IO v2
    var roomObj = io.sockets.adapter.rooms[room];
    var numClients = 0;
    
    if (roomObj) {
      // Socket.IO v2: roomObj.sockets is an object with socket IDs as keys
      // If sockets property exists, use it; otherwise roomObj itself is the map
      if (roomObj.sockets) {
        numClients = Object.keys(roomObj.sockets).length;
      } else {
        numClients = Object.keys(roomObj).length;
      }
    }
    
    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);

    } else if (numClients === 1) {
      log('Client ID ' + socket.id + ' joined room ' + room);
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
    } else { // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('bye', function(){
    console.log('received bye');
  });

});
