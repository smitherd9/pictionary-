var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var user = [];
var answer = [];

io.on('connection', function(socket){
    console.log(socket.id);
    user.push(socket.id);
    if (user.indexOf(socket.id) == 0) {
        socket.emit('setRole', 'drawer');
    }
    else {
        socket.emit('setRole', 'guesser');             
    }
    socket.on('picture', function(position){
    socket.broadcast.emit('drawing', position);    
    });
    
    socket.on('chooseWord', function(newWord){
        answer.push(newWord);
        console.log(answer);
    });
    
    socket.on('guess', function(userGuess){
        console.log(userGuess);
        console.log(user[0]);
        if (userGuess == answer[0]) {
            answer = [];
            user.splice(0, 1, socket.id);
            console.log(user[0]);
            socket.emit('setRole', 'drawer');
            socket.broadcast.emit('setRole', 'guesser');
            
        }
        else {
        // if guess is correct, switch roles 
        // try to use splice to manipulate the array
        socket.broadcast.emit('tellGuess', userGuess);
            }
        });
    
    
    socket.on('disconnect', function() {
        console.log('A user has disconnected');
        console.log(user[0]);
        console.log(socket.id);
        if (socket.id != user[0]){
            return;
            // socket.emit('setRole', 'drawer');
        }
        // console.log(user[0]);
        else {
            user.shift();    // What if user[1] disconnects leaving user[0] and user[2] still in play and then user[0] disconnects?  
            console.log(user[0]);              // If user[0] then disconnects, splice won't work properly
            socket.emit('setRole', 'drawer');
            
        }
        socket.broadcast.emit('setRole', 'guesser');
        
        
        // if (user.indexOf(socket.id) == 0){
        // socket.emit('setRole', 'drawer');
        //     }
        
        // else {
        //     socket.broadcast.emit('setRole', 'guesser');
        // }
    });

});



server.listen(process.env.PORT || 8080);