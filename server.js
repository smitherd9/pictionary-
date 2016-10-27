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
            var i = user.indexOf(socket.id);
            user.splice(i, 1);
            user.splice(0, 1, socket.id);
            console.log(user[0]);
            socket.emit('setRole', 'drawer');
            socket.broadcast.emit('setRole', 'guesser');
           
        }
        else {
            
        socket.broadcast.emit('tellGuess', userGuess);
            }
        });
    
    
    socket.on('disconnect', function() {
        console.log('A user has disconnected');
        console.log(user[0]);
        console.log(socket.id);
        if (socket.id != user[0]){
            return;
            
        }
        // user.splice(0,1,user[1]);     user.splice(0,1,Math.floor(Math.random * user.length);  var b = Math.floor ...  ; var temp = user[0] user[0] = user[b];  user[b] = temp;  //swap random person into front of array
        else {
            user.shift();    
            console.log(user[0]);              
            socket.broadcast.emit('setRole', 'guesser');
            io.sockets.connected[user[0]].emit('setRole', 'drawer');
            answer = [];
            
        }
       
    });

});



server.listen(process.env.PORT || 8080);