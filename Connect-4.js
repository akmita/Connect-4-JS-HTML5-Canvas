

//TO DO
//reuse setsearch index for all directions 9/23/19

var gameboard = [ [], [], [], [], [], [], []];         //gameboard has reversed coords
var C = [5,5,5,5,5,5,5];     //index of row where piece is gonna land
var rowNum = 0;
var consecutivePieces = 0;
var currColor = "";  //FOR DEV PURPOSES
var currPlayerColor = "red";
var clickArea = document.querySelectorAll(".h-row");
var animationRunning = false;                           // Is drop animation running
var lastPieceAdded;

function addPiece(x, player) {  
  switch (x) {  
    case 0: y = C[0]; C[0]--; break;
    case 1: y = C[1]; C[1]--; break;
    case 2: y = C[2]; C[2]--; break;
    case 3: y = C[3]; C[3]--; break;
    case 4: y = C[4]; C[4]--; break;
    case 5: y = C[5]; C[5]--; break;
    case 6: y = C[6]; C[6]--; break;
    default: console.log('error, no row index found');
  }
  if (y < 0) { console.log('error, column full'); }
  else {
    console.log(`adding ${player} to column: ${x} and row: ${y}`);
    lastPieceAdded = ("R" + (y * 7 + (x + 1))).toString();
    // console.log("temporarily blanking out new added piece: " + lastPieceAdded);
    gameboard[y][x] = player;
    testForWin( x, y, player);
  }  
}

function colorGen() {
  var color1, color2, color3;
  color1 = (Math.random()*255).toString();
  color2 = (Math.random()*255).toString();
  color3 = (Math.random()*255).toString();
  return ( "rgb(" + color1 + "," + color2 + "," + color3 + ")" );
}


function updateGameboard() {      // Updates the CSS data of the gameboard to display pieces in proper positions
	var divIndex=1;
	var color;
	for (var x = 0; x < 6; x++) {
		for (var y = 0; y < 7; y++) {
			color = gameboard[x][y];
			if (color == "red" || color == "yellow") { 
				document.getElementById('R' + divIndex.toString()).style.background = color;
			}
			divIndex++;
		}
	}
}


function testForWin( x, y, player) {    
  var searchCoords;
  console.log("Checking for win at Col: " + x + "  and Row: " + y);
  searchCoords = setSearchIndex( x, y, "top-left");          
  checkSlot( searchCoords[0], searchCoords[1], player, "bottom-right");
  searchCoords = setSearchIndex( x, y, "top-right");
  checkSlot( searchCoords[0], searchCoords[1], player, "bottom-left");
  searchCoords = setSearchIndex( x, y, "up");          
  checkSlot( searchCoords[0], searchCoords[1], player, "down");
  searchCoords = setSearchIndex( x, y, "left");          
  checkSlot( searchCoords[0], searchCoords[1], player, "right"); 
}
  

function setSearchIndex( x, y, direction) {      // Sets the index where to start searching for matches   
  currColor = colorGen() // FOR DEVELOPMENT
  var stillSearching = true;
  while (stillSearching) { 
    console.log("  looking for search index || current: " + x + " , " + y);
    // Color change for development
    // document.getElementById('R' + ( (x + 1) + (7 * y) ).toString() ).style.background = currColor;
    
    //increments x and y depending on search direction
    switch (direction) {          
      case 'top-left':
        if ( x > 0 && y > 0) {
          console.log("     Looking for coords: top-left");
          x--;
          y--;         
        }
        else { stillSearching = false; } 
        break;
      case 'top-right':
        if ( y < 0 && x < 6) {
          console.log("     Looking for coords: top-right");
          x++;
          y--;
        }
        else { stillSearching = false; }        
        break;
      case 'left':
        if ( x > 0) {
          console.log("     Looking for coords: left");
          x--;
        }
        else { stillSearching = false; } 
        break;
      case 'up':
        if ( y > 0) {
          console.log("     Looking for coords: up");
          y--;
          break;
        }
        else { stillSearching = false; }       
        break;
      default:
        console.log('     error, direction unkown');
        break;
    }    
  }
  console.log("     returning search coords");
  return [x,y]; 
}

function checkSlot(x, y, player, direction) {  
  while (x <= 6 && y <= 5 && y >= 0 && x >= 0) { // makes sure value to be tested is bound inside gameboard
    console.log('        searching: ' + "(" + x + " , " + y + ")" + " for:  " + player);
    console.log("        slot occupied by: " + gameboard[y][x]); 
    
    
    if (gameboard[y][x] == player) {    //tests if there's a matching piece 
      consecutivePieces++;            //increments counter for consecutive pieces
      console.log("        match found at " + "(" + x + " , " + y + ")" + "  consecutive pieces: " + consecutivePieces); 
    }
    else {                            //resets counter if there's a break in consecutive pieces
      console.log('        no match, resetting consecutive pieces to 0'); 
      consecutivePieces=0;
    }  
    // Color change for development
    // document.getElementById('R' + ( (x + 1) + (y * 7) ).toString() ).style.border = "thick solid " + currColor;
    
    if (consecutivePieces >= 4) {       //tests if game is won
      console.log('                PLAYER: ' + player + " WON!!! ");
      // playerWon();
      return true;
    }
    else { console.log('        game not won yet, continuing tests'); }
    
    switch (direction) { //increments x and y depending on search direction
      case 'bottom-right':
        console.log("        checking slots from: top-left  to: bottom-right");
        x++;
        y++;
        continue;
      case 'bottom-left':
        console.log("        checking slots from: top-right  to: bottom-left");
        x--;
        y++;
        continue;
      case 'right':
        console.log("        checking slots from: left  to: right");
      	x++;
        continue;
      case 'down':
        console.log("        checking slots from: up  to: down");
      	y++;
        continue;
      default:
        console.log('        error, direction unkown');
    }
  }
  console.log("search loop broken");
  consecutivePieces=0;
}

//***********EVENT LISTENERS**********  */

// Makes top piece appear when hovered over, if animation isn't running
clickArea.forEach(function(element) {
  element.addEventListener("mouseover", function() {
    if (!animationRunning) {     
      document.getElementById(element.id).style.background = currPlayerColor;
    }
  });
}); 

// Makes top piece dissapear when hovered away from, if animation isn't running
clickArea.forEach(function(element) {
  element.addEventListener("mouseout", function() {
    if (!animationRunning) {           document.getElementById(element.id).style.background = "white";    
    }
  });
}); 

// no idea what this does
var c = [1,2,5,6,8,4,6];


// ----------- Main Event listener -------------- //
// When area above gameboard is clicked, piece is dropped into to the appropriate slot
clickArea.forEach(function(element) {  
    element.addEventListener("click", function() {
      if ( !animationRunning) {
        console.log("clicked element : " + element.id);
        var currentClickedElement = element.id.charAt(1);

        document.getElementById(element.id).style.background = currPlayerColor;
        addPiece( parseInt( currentClickedElement - 1), currPlayerColor); // Places piece in the gameboard
        pieceDrop( element.id, currentClickedElement);   // Runs animation

        // Flips the player color between red and yellow
        if ( currPlayerColor == "red") {
          currPlayerColor = "yellow";  
        }     
        else { currPlayerColor = "red"; }
        
        
        
      }
      else {
        console.log("***Animation failed");
      }
      // create animation down the elements row 
    });
  
  
}); 



// Animation JS only
function pieceDrop( pieceToAnimate, clickedElement) {
  var element = document.getElementById(pieceToAnimate);
  var pos = 0;
  var animationDepth = ( C[parseInt(clickedElement) - 1 ] + 2) * 100;   // Sets how far each piece drops, based on how full a column is
  
  console.log("C[parseInt(clickedElement) - 1 ]: " + C[parseInt(clickedElement) - 1 ]);
  // figure out which column, check that column, assign appropriate number
  console.log("*****Starting animation for" + element.id);
  animationRunning = true;
var dropAnimation = setInterval( frame, 10);                            // Sets interval for pieceDrop()
  function frame() {
    if (pos >= animationDepth) {   // Resets interval once a number is reached
      clearInterval(dropAnimation);
      pos = 0;
      element.style.top = pos;
      animationRunning = false;
      console.log("********animation can run again");
      updateGameboard(); 
      element.style.background = "white"; 
    }
    else {
      pos +=  10;
      element.style.top = pos + 'px';
    }
  }
}



/*
addPiece(2,'red');
addPiece(5,'red');
addPiece(4,'red');
addPiece(3,'red');
addPiece(3,'red');
addPiece(3,'red');
addPiece(3,'red');
addPiece(3,'yellow');
addPiece(3,'red');
addPiece(3,'yellow');
addPiece(3,'red');
addPiece(6,'red');
addPiece(6,'yellow');
testForWin(2,4,'red');
*/


