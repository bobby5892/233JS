// Create a class called StopWatch.


class StopWatch {


    /*
        Add a isRunning, timer and timerTime..  In the body of the constructor
        -   Create instance variables for these 3 variables as well
            as all of the elements on the page that you're going to
            refer to in code
        -   All of the functionality of init will happen in the constructor.
        -   Add the event handlers for the start, stop and reset buttons.
            You'll have to bind(this) to each function because the keyword
            this will refer to the button (not the class) when the 
            event fires
            -- this.startButton.onclick = this.startTimer.bind(this);
    */
    constructor() {
        
         /*
        Create 3 global variables, isRunning, timer and timerTime.
        Initialize them to false, null and 0 respectively.
        */
        this.isRunning = false;
        this.timer = null;
        this.timerTime = 0;
        // Map elements to vars
        this.buttonStart = document.getElementById("start");
        this.buttonStop = document.getElementById("stop");
        this.buttonReset = document.getElementById("reset");

        this.timerMinutes = document.getElementById("minutes");
        this.timerSeconds = document.getElementById("seconds");

        this.init();
        
    }

    init() {
        // Put the element on the page with an id of start in a variable
        // Do the same for the stop button and the reset button
       

        // Add an onclick handler to each of the buttons
        // Use the functions startTimer, stopTimer and resetTimer 
        this.buttonStart.addEventListener("click", () => { this.startTimer(); });
        this.buttonStop.addEventListener("click", () => { this.stopTimer(); });
        this.buttonReset.addEventListener("click", () => { this.resetTimer(); });
    }


    startTimer() {
        console.log("Starting Timer");
        // if the timer is NOT running, start it
        if (!this.isRunning) {
            this.isRunning = true;
            this.timer = setInterval( () => { this.incrementTimer() }, 1000);
        }
        // call the function incrementTimer every second
        // save the timer in a the timer variable

    }

    incrementTimer() {
        if (this.isRunning) {
            console.log("Increment Timer");
            // increment the timerTime
            this.timerTime++;
            // calculate the number of minutes and seconds
            let seconds = this.timerTime % 60;
            let minutes = Math.floor(this.timerTime / 60);
            // write the minutes and seconds to the elements on the page
            this.timerMinutes.innerHTML = this.pad(minutes);
            this.timerSeconds.innerHTML = this.pad(seconds);
            
            // use the function pad to make sure there's a leading 0 if necessary
        }
    }

    pad(number) {
        // add a leading 0 if the number is < 10
        if (number < 10) {
            number = "0" + number;
        }
        return number;
    }

    stopTimer() {
        console.log("Stopping Timer");
        // if the timer is running, stop it
        if (this.isRunning) {
            this.isRunning = false;
            this.timer = null;
        }

    }

    resetTimer() {
        console.log("Resetting Timer");
        // stop the timer
        this.isRunning = false;
        clearInterval(this.timer);
        
        // set the timerTime back to 0
        this.timerTime = 0;
        // write 00 to the elements on the page for minutes and seconds
        this.timerMinutes.innerHTML = "00";
        this.timerSeconds.innerHTML = "00";

    }

    // When the page has finished loading, call the function init

}

// Create a variable called stopWatch
let stopWatch;
// Add an event handler to the load event of the window. 
window.addEventListener("load", () => {
    stopWatch = new StopWatch();
});


// Use an anonymous function or an arrow function to
// set the stopWatch variable to an instance of StopWatch