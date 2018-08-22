// edit styles here
// give them styles from App.css

class TTT {

    constructor() {
        this.squares = Array(9).fill(null);
        this.xIsNext = true;
        this.winner = null;
        this.winningLine = Array();
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
        this.calculateWinner = this.calculateWinner.bind(this);
        this.render();
    }

    calculateWinner() {
        for (let i = 0; i < this.lines.length; i++) {
            const [a, b, c] = this.lines[i];       
            if (this.squares[a] && 
            this.squares[a] === this.squares[b] && 
            this.squares[a] === this.squares[c]) {
                this.winner = this.squares[a];
                this.winningLine = this.lines[i];
                return true;
            }
        }
        this.winner = null;
        this.winningLine = Array();
        return false;
    }
  
    handleClick(i) {
        this.squares[i] = this.xIsNext ? 'X' : 'O';
        this.calculateWinner();
        this.xIsNext = !(this.xIsNext); 
        this.render();
    }
  
    renderSquare(i) {
        const className = (this.state.squares[i] == null) ? "square" :
            (this.state.winner != null && this.state.winner === this.state.squares[i]) ? 
            "square-winner" : "square-full";
        const enabled = (this.winner == null && this.squares[i] == null) ? true : false;
        const eventHandler = (enabled)? "ttt.handleClick(" + i + ")": "";
        const output = 
            `<div class='${className}' id='{i}'
                onclick='${eventHandler}'>
                ${(this.squares[i] != null) ? this.squares[i] : ""}
            </div>`;   
        return output;
    }
  
    render() {
        let status;
        if (this.winner) {
          status = 'Winner: ' + this.winner;
        } else {
          status = 'Next player: ' + (this.xIsNext ? 'X' : 'O');
        }
  
        const output =  
            `
            <div class="status">${status}</div>
            <div class="row">
                ${this.renderSquare(0)}${this.renderSquare(1)}${this.renderSquare(2)}
            </div>
            <div class="row">
                ${this.renderSquare(3)}${this.renderSquare(4)}${this.renderSquare(5)}
            </div>
            <div class="row">
                ${this.renderSquare(6)}${this.renderSquare(7)}${this.renderSquare(8)}
            </div>
        `;
        document.getElementById('board').innerHTML = output;
    }
}

let ttt;
window.addEventListener("load", () => {  
    ttt = new TTT();
});