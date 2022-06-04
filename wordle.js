import worldList from "./word.js";

//var wordList = require('./word');
//maximum number of guesses
var guessCount = 6;

//length of each word
var width = 5;

//current row and column
var row = 0;
var column = 0;

//for gameOver
var gameOver = false;

//list to select the word randomly 
// var worldList = ['apple','train','roast','about','title','hello','video','whole','union','visit','theme','sugar','style',
// 'study','state','sport','smoke','right','pride','press','night','march','model','japan','group','front'];

//used to provide guesses
var guessList = ['apple','grape','combo','style','index','award','basis','beach','eager','about','blood','birth','chair',
'chain','dollar','dream','earth','eager','fight','grass','frank','money','music','novel','Knife','octet','radio','ratio',
'route','scope','shape','sheep','trend','trial','truth','uncle','unity','value','watch','water','woman','world','youth'];


guessList = guessList.concat(worldList);

//generating a random word from the list of words
var word = worldList[Math.floor(Math.random()*worldList.length)].toUpperCase();
//console.log(word);

//
window.onload = function(){
    initialize();
}

//function to create the tiles for holding the characters
function initialize(){
    //creating the board
    for(let r = 0;r < guessCount;r++){//rows
        for(let c = 0;c < width;c++){//columns

            //creating a span element
            let tile = document.createElement("span");

            //assigning the IDs to the tiles
            tile.id = r.toString()+"-"+c.toString();

            //adding css to the tile element
            tile.classList.add("tile");

            tile.innerText = "";

            //adding individual tiles to the tile board
            document.getElementById("board").appendChild(tile);

        }
    }

    //creating the keyboard
    let keyboard = [['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Enter','Z','X','C','V','B','N','M','⌫']];

    for(let i = 0; i<keyboard.length; i++){
        let  currentRow = keyboard[i];
        let keyboardRow = document.createElement("div");

        //keyboard-row class will be created later
        keyboardRow.classList.add("keyboard-row");

        for(let j = 0;j<currentRow.length;j++){

            //creates a div for every character
            let keyTile = document.createElement("div");

            //holds jth character of the current row 
            let key = currentRow[j];

            //entering the current character as a text in the above created div
            keyTile.innerText = key;

            //adding IDs to every div
            if(key == "Enter"){
                keyTile.id = "Enter";
            }
            else if(key == "⌫"){
                keyTile.id = "Backspace";
            }
            else if("A"<=key && key <="Z"){
                keyTile.id = "key"+key;
            }

            //adding eventListener to the virtual keybaord
           keyTile.addEventListener("click",processKey);

            if(key == "Enter"){

                keyTile.classList.add("enter-key-tile")
            }
            else{
                keyTile.classList.add("key-tile")
            }

            keyboardRow.appendChild(keyTile);   
        }
        document.body.appendChild(keyboardRow);
    }


    document.addEventListener("keyup",(e) => {
    
        processInput(e);
    })
}

function processKey(){
    let e = {"code" : this.id};
    processInput(e);
}


function processInput(e){
    if(gameOver){
        return;
    }
    if("keyA" <= e.code && e.code <= "keyZ"){
        if(column < width){
            let currTile = document.getElementById(row.toString()+"-"+column.toString());
            if(currTile.innerHTML == ""){
                currTile.innerText = e.code[3];

                //console.log(e.code)
                //console.log(e.code[3])
                column += 1;
               // console.log(currTile.innerText);
            }
        }
    }
    else if(e.code == "Backspace"){
        if(0 < column && column <= width){
            column -= 1;
        }
        let currTile = document.getElementById(row.toString()+'-'+column.toString());
        currTile.innerText = "";
    }
    else if(e.code == "Enter"){

        //applies necessary styles to the alphabets upon successful macthing of the alphabets
        update();
    }

    //in case all the guesses are incorrect 
    if(!gameOver && row == guessCount ){
        gameOver = true;
        document.getElementById("answer").innerText = `Oops! the right answer is ${word} `;
    }
}

function update(){
    let guess = "";
    document.getElementById("answer").innerText  = "";
   
    for(let c = 0; c < width; c++){
        let currTile = document.getElementById(row.toString()+"-"+c.toString());
        let letter = currTile.innerText;
        console.log(currTile);
        guess += letter;
    }

    guess = guess.toLowerCase();
    //console.log(guess);

    
    //if the word is not present in guess list print the message accordingly and proceed
    if(!guessList.includes(guess)){
        document.getElementById("answer").innerText = "Word not in the wordList";
        document.getElementById("answer").style.background = "rgba(250,216,89,0.5)";
        //return;
    }
    
    //if the word is present then proceed 
    let correct  = 0;
    let letterCount = {};
    
    for(let i = 0; i < word.length; i++){
        let letter = word[i];
        if(letterCount[letter]){
            letterCount[letter] += 1;
        }
        else{
            letterCount[letter] = 1;
            
        }
    }
  //  console.log(letterCount);
    
    for(let c = 0;c < width ; c++){
        let currTile = document.getElementById(row.toString()+"-"+c.toString());
        let letter = currTile.innerText;
        //console.log(letter);
        
        if(word[c] == letter){
            currTile.classList.add("correct");
            let keyTile = document.getElementById("key"+letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");
            letterCount[letter] -= 1;
        }
        if(correct == width){
            gameOver = true;
        }
    }
    //console.log(letterCount);
    
    for(let c = 0;c < width;c++){
        let currTile = document.getElementById(row.toString()+"-"+c.toString());
        let letter = currTile.innerText;
        
        if(!currTile.classList.contains("correct")){
            if(word.includes(letter) && letterCount[letter] > 0){
                currTile.classList.add("present");
                
                let keyTile = document.getElementById("key"+letter);
                if(!keyTile.classList.contains("correct")){
                    keyTile.classList.add("present");
                }
                
                letterCount[letter] -= 1;
            }
            else{
                currTile.classList.add("absent");
                let keyTile = document.getElementById("key"+letter);
                keyTile.classList.add("absent");
            }
        }
    }

    //console.log(word.toLowerCase().localeCompare(guess.toLowerCase()));
    let result = word.toLowerCase().localeCompare(guess.toLowerCase());
    if(result == 0){
        console.log("you won");
        document.getElementById("answer").innerText = "Congratulations! You guessed it right";
        document.getElementById("answer").classList.add("correct")
        return;
    }
    //updation of row and column
    row += 1;
    column = 0;
}