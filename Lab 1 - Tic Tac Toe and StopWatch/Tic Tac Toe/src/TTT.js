// Create a class called TTT

class TTT{
    /*
        Add a constructor that 
        -   defines and initializes all variables
        -   binds the keyword this to the class for each function because
            this will otherwise will refer to the clicked square
            -   this.calculateWinner = this.calculateWinner.bind(this);
            -   DON'T bind this for handleClick at this point
        -   calls the init method
    */
    constructor() {
        console.log("Loading TTT");
        this.xIsNext = false;
        this.winner = null;
        this.squares = null;
        this.winningLine = null;
        this.lines = null;

        // map elements
        this.board = window.document.getElementById("board");
      
        this.status = window.document.getElementById("status");
        this.boardSquares = [
            window.document.getElementById("0"), window.document.getElementById("1"), window.document.getElementById("2"),
            window.document.getElementById("3"), window.document.getElementById("4"), window.document.getElementById("5"),
            window.document.getElementById("6"), window.document.getElementById("7"), window.document.getElementById("8")
        ];
        this.init();
    }



    /*
        Convert each function to a method
        -   move it inside the class
        -   remove the keyword function
        -   add this to all of the variables that belong to the class
        -   change var to let or const for local variables
        -   add this to all method calls
     
        Init
        -   bind both this and i to handleClick
            -   this.handleClick.bind(this, i);
        
        CalculateWinner
        -   use destructuring assingment to assign values to
            a b and c in one line

        HandleClick
        -   add a parameter i rather than getting i from this
            -   this now refers to the class not the square
        -   remove the local variable i
        -   add a local variable to refer to the clicked square
            -   remember that squares have an integer id 0 - 8
    */


     init() {
        // Add an onclick handler to all of the squares
         this.boardSquares.forEach(
             (element) => {
                 element.onclick =  this.handleClick
         });
        // The name attribute for all of the divs is square
        // Use the function handleClick to handle the event 
        this.xIsNext = true;
        this.winner = null;
        this.squares = Array(9).fill(null);
        this.winningLine = Array();
        // Paths to Win
        this.lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        this.handleClick = this.handleClick.bind(this);
    }
   
    handleClick(event) {
        console.log("event" + JSON.stringify(event));
        console.log("clicked " + this.id);
        console.log("this" + JSON.stringify(this));

        // Get the id from the square and put it in a variable
        // Remember that the id is an integer 0 - 8
        console.log(event.xIsNext);
        // Set the element in the squares array to the player's symbol
        this.innerHTML = (this.xIsNext ? "O" : "X");

        // Update the inner html for this square in the UI
        // Set the onclick handler for this square in the UI to an empty anonymous function or arrow function


         this.onclick = (() => { });
       
        // this.addEventListener("click", () => { });
        // Update the variable xIsNext
         this.xIsNext = !this.xIsNext;
        // If calculateWinner returns true
        if (this.calculateWinner() ) { alert("winner");}
        // highlight the winner and disable all of the squares
        // otherwise update the status in the UI to display the player
    }

    calculateWinner() {
        let lines = this.lines;
        let squares = this.squares;
        for (var i = 0; i < lines.length; i++) {
            var a = lines[i][0];
            var b = lines[i][1];
            var c = lines[i][2];
            if (squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]) {
                this.winner = squares[a];
                this.winningLine = lines[i];
                return true;
            }
        }
        this.winner = null;
        this.winningLine = Array();
        return false;
    }

    //
     highlightWinner() {

        // Update the status in the UI to display the winner
        // Iterate through the winningLine array.  It contains the indices of the winning squares
        //      get the next square using the current index in the winningLine array as the id
        //      add the class red to the square
        // Disable all of the squares
    }

     disableAll() {

        // Set the onclick handler for all squares to function that does nothing
        // The id of the square is a number 0 - 8
    }

}
let ttt;

window.addEventListener("load", () => {
    ttt = new TTT();
});

