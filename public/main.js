var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];



var pictionary = function() {
    var canvas, context;
    var socket = io();
    var drawing = false;
    var userGuess = $('#userGuesses');
    var getWord = function(){
        var randomWord = Math.floor(Math.random() * WORDS.length);
        // console.log(WORDS[randomWord]);
        return(WORDS[randomWord]);
    };
    
    
    
    
    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };
    
    //  var displayGuess = function(guess){
    //     userGuess.text(guess);
    // };
    
    var guessBox;

    var onKeyDown = function(event) {
    if (event.keyCode != 13) { // Enter
        return;
    }

    console.log(guessBox.val());
    // var userGuess = guessBox.val();
    socket.emit('guess', guessBox.val());
    guessBox.val('');
    
};

    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
    
    socket.on('tellGuess', function(guess){
        userGuess.append('<div>' + guess + '</div>');
        // userGuess.text(guess);
    });
    
   
    

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    
    
    
    // canvas.on('mousemove', function(event) {
    //     if (drawing == true) {
    //     var offset = canvas.offset();
    //     var position = {x: event.pageX - offset.left,
    //                     y: event.pageY - offset.top};
    //     draw(position);
    //     socket.emit('picture', position);
    //     }
    // });
    
    // canvas.on('mousedown', function(){
    //     drawing =  true;
    // });
    
    // canvas.on('mouseup', function(){
    //     drawing = false;
    // });
    
    socket.on('drawing', function(drawPic){
    draw(drawPic);
    });
    
    socket.on('setRole', function(role){
        if (role == 'drawer'){
            setUpDrawer();
        }
        else setUpGuesser();
        
    });
    
    var setUpDrawer = function(){
            function mouseMove(){
                if (drawing == true) {
                var offset = canvas.offset();
                var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
                draw(position);
                socket.emit('picture', position);
                
                
                }
            }
            canvas.on('mousemove', mouseMove);
            alert('You are the drawer');
            var newWord = getWord();
            alert(newWord);
            canvas.on('mousedown', function(){
            drawing =  true;
    });
    
            canvas.on('mouseup', function(){
            drawing = false;
    });
    
    }
    
    var setUpGuesser = function(){
        canvas.off('mousemove');
        canvas.off('mousedown');
        canvas.off('mouseup');
        alert('You are a guesser');
        
    }
    
};




$(document).ready(function() {
    pictionary();
});