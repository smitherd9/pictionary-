var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var user = [];

io.on('connection', function(socket){
    user.push(socket);
    if (user.length == 1) {
        socket.emit('setRole', 'drawer');
    }
    else {
        socket.emit('setRole', 'guesser');             
    }
    socket.on('picture', function(position){
    socket.broadcast.emit('drawing', position);    // need handler on client side
    });
    
    socket.on('guess', function(userGuess){
        console.log(userGuess);
        // if guess is correct, switch roles 
        // try to use splice to manipulate the array
        socket.broadcast.emit('tellGuess', userGuess);
    });
    
    socket.on('disconnect', function() {
        console.log('A user has disconnected');
    });

});



server.listen(process.env.PORT || 8080);