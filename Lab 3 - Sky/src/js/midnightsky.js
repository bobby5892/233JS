import './general.js';

/* Create a class called MidnightSky
- Part 1 - Create and draw stationary stars
    - Initialize instance variables for all of the ui elements in the constructor
        -   this.$canvas = 
        -   this.$context = 
        -   this.$animationFrame; 

    - Initilize some other instance variables that are data related in the constructor
        this.defaults = {
            star: {
                color: 'rgba(255, 255, 255, .5)',
                width: 3,
                randomWidth: true
            },
            line: {
                color: 'rgba(255, 255, 255, .5)',
                width: 0.2
            },
            position: {
                x: 0,
                y: 0
            },
            width: window.innerWidth,
            height: window.innerHeight,
            velocity: 0.1,
            length: 100,
            distance: 120,
            radius: 150,
            stars: []
        };
        this.config = JSON.parse(JSON.stringify(this.defaults));
    - Write the method setCanvas
        -   set the width and the height of the canvas to the 
            width and the height in the config object
        -   bind the class to the method in the constructor
        -   call the method in the constructor
    - Write the method setContext
        -   set the strokeStyle, fileStyle and lineWidth properties of the context
            based on corresponding values in the config object
        -   bind the class to the method in the constructor
        -   call the method in the constructor
    - Write the method setInitialPosition
        -   set the x and y position in the config object to 
            half of the canvas width and height respectively
        -   bind the class to the method in the constructor
        -   call the method in the constructor
    - Write the method createStar
        -   make a copy of the default star characteristics
        -   add x to the star - random number relative to the canvas width
        -   add y to the star - random number relative to the canvas height
        -   add vx to the star - random velocity in the x direction
        -   add vy to the star - random velocity in the y direction
        -   add radius to the star - random size
        -   return the star
        -   bind the class to the method in the constructor
    - Write the method createStars
        -   repeatedly call the method createStar and add the new star to the
            array of stars in the config object.  The number of stars is in the
            length property of the config object.
        -   bind the class to the method in the constructor
        -   call the method in the constructor
    -   Write the method drawStar.  Pass in a star as a parameter
        -   it should draw one star
        -   bind the class to the method
    -   Write the method drawStars.  It should
        -   clear the canvas
        -   repeatedly call the method drawStar
        -   bind the class to the method
        -   call the method in the constructor
  END OF PART 1 - TEST AND DEBUG YOUR CODE - YOU SHOULD SEE STARS ON THE PAGE
- PART 2 - Animate the stars - you can do this with setInterval or an animation frame
    -   Write the method moveStar.  It should take a star as it's parameter and
        move the star based on it's x and y position as well as it's x and y velocities.
        When the star bumps into the edge of the canvas, it should reappear on the canvas
        in a reasonable place but don't worry too much about the physics!
    -   Write the method moveStars.  It should repeatedly call moveStar
    -   Write the method animateStars.  It should 
        -   clear the canvas
        -   move the stars
        -   draw the stars
    -   Setup the animation in the constructor.  It should call animateStart every 1/60th 
        of a second.
    -   NOTICE THAT I CREATE A NEW OBJECT WHEN YOU RESIZE THE PAGE.  YOU'LL WANT TO CANCEL
        THE ANIMATION WHERE I'VE WRITTEN THAT COMMENT.
  END OF PART 2 - TEST AND DEBUG YOUR CODE - YOU SHOULD SEE STARS MOVE ON THE PAGE 
  - PART 3 - Add lines between stars that are "close" to eachother and are near the mouse
    -   I've given you 2 methods highlight and drawLines that you can use.  Or you can write your own
    -   Write the method drawLines
    -   Call it in an appropriate place
    -   Write the method highlight
    -   Add a mousemove event handler to the canvas that references highlight.  drawLines
        takes the position of the mouse into account.
  END OF PART 3 - TEST AND DEBUG YOUR CODE - YOU SHOULD SEE CONSTELLATIONS ON YOUR PAGE       
*/

class MidnightSky {

    constructor(options) {
        this.devMode  = false;
          this.defaults = {
            star: {
                color: '#FFFFFF',
                width: 3,
                randomWidth: true,
                randomColor: true
            },
            line: {
                color: '#FFFFFF',
                randomColor: false,
                width: 0.2
            },
            position: {
                x: 0,
                y: 0
            },
            destination:{
                x:0,
                y:0
            },
            width: window.innerWidth,
            height: window.innerHeight,
            velocity: 0.1,
            length: 100,
            distance: 120,
            radius: 3,
            seedRate: 1,
            seedIntervalMS: 16,
            seedMaxStars:100,
            backgroundColor:'000000',
            threshold:10
        };
        // Create Stars container
        this.stars = [];
        // Stars timer
        this.timer = null;
        /* Set Defaults */
        this.loadSettings(this.defaults);
       /* Deal with optional options*/
       if(typeof options == 'object'){
            this.devLog("Loading additional Options via Constructor: ");
            this.loadSettings(options);
       }
       /* setup shorthands */
        this.config = JSON.parse(JSON.stringify(this.defaults));
        this.canvas =  document.getElementsByTagName("canvas")[0];
        this.ctx    = this.canvas.getContext('2d');

        /*binds */
        this.setCanvas.bind(this);
        this.setContext.bind(this);
        this.createStars.bind(this);
        this.drawStar.bind(this);
        this.drawStars.bind(this);
        this.stopStars.bind(this);

        /* additional configuration*/
        this.setCanvas();
        this.setContext();
        this.setInitialPosition();
        this.createStars();
        this.drawStars();
        this.animateStars();

    }
    devLog(log){
        if(this.devMode){
            console.log("DEV:" + log);
        }
    }
    loadSettings(settings){
       this.devLog("Loading Settings: " + JSON.stringify(settings)); 
        for(let key in settings){
            if(typeof settings[key] == 'object'){
                this[key] = {};
                for(let subKey in settings[key]){
                    this.devLog("subkey set " + key + " with data " + settings[key][subKey]);
                    this[key][subKey] = settings[key][subKey];
                }
            }
            else{
                    this[key] = settings[key];
                    this.devLog("Setting " + key + " to " + settings[key]);
            }
        }
        this.devLog("Full List of Settings:" + JSON.stringify(this));
    }
    /*
     - Write the method setCanvas
        -   set the width and the height of the canvas to the 
            width and the height in the config object
        -   bind the class to the method in the constructor
        -   call the method in the constructor
        */
    setCanvas(e){
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.devLog("Setting Canvas Dimensions: " + this.canvas.width + "x" + this.canvas.height);
    }


    /*- Write the method setContext
        -   set the strokeStyle, fileStyle and lineWidth properties of the context
            based on corresponding values in the config object
        -   bind the class to the method in the constructor
        -   call the method in the constructor
    */
    setContext(e){
        this.ctx.strokeStyle = this.star.color;
        this.devLog("Setting context strokeStyle:" + this.ctx.strokeStyle);
        this.ctx.fillStyle = this.line.color;
        this.devLog("Setting fileStyle: " + this.ctx.fileStyle);
        this.ctx.lineWidth = this.star.width;
        this.devLog("Setting Star Width: " + this.ctx.lineWidth);
    }

    /*- Write the method setInitialPosition
        -   set the x and y position in the config object to 
            half of the canvas width and height respectively
        -   bind the class to the method in the constructor
        -   call the method in the constructor*/
    setInitialPosition(){
        this.position.x = Math.floor(this.width/2);
        this.position.y = Math.floor(this.height/2);
        this.devLog("Setting Initial Position:" + this.position.x + " x " + this.position.y );
    }    
    /*
    - Write the method createStar
       // -   make a copy of the default star characteristics
        -   add x to the star - random number relative to the canvas width
        -   add y to the star - random number relative to the canvas height
       / -   add vx to the star - random velocity in the x direction
       /-   add vy to the star - random velocity in the y direction
       / -   add radius to the star - random size
        -   return the star
        -   bind the class to the method in the constructor
    */
    createStar(){
        let star = {
            star: {
                color: this.star.color,
                width: this.star.width
                
            },
            line: {
                color: this.line.color,
                width: this.line.width
            },
            position: {
                x: this.position.x,
                y: this.position.y
            },
            destination:{
                x:0,
                y:0
            },
            width: window.innerWidth,
            height: window.innerHeight,
            velocity:  this.velocity,
            length: 0,
            distance: 0,
            radius: this.randomNumber(this.radius)
        };

        if(this.star.randomColor){
            star.star.color = this.randomColor();
        }

        if(this.line.randomColor){
            star.line.color = this.randomColor();
        }
        if(this.star.randomWidth){
            star.star.width = this.randomNumber(5);
        }
        // Figure out where its going
         //star.destination.x,star.destination.y
    
       [star.destination.x,star.destination.y]  = this.randomDestination();
    
      

        
        return star;
    }
    
    /*- Write the method createStars
        -   repeatedly call the method createStar and add the new star to the
            array of stars in the config object.  
            The number of stars is in the
            length property of the config object.
        -   bind the class to the method in the constructor
        -   call the method in the constructor
        */

    createStars(e){

        let createStarCount = this.randomNumber(this.seedRate)+1;
        this.devLog("Creating " + createStarCount + "stars");
        for (let i=0; i< createStarCount; i++) {
            this.devLog(this.stars.length + " < " + this.seedMaxStars);
            if(this.stars.length < this.seedMaxStars){
              let newStar = this.createStar();
              this.devLog("STAR" + JSON.stringify(newStar));
               this.stars.push(newStar);
            }
        }
        this.devLog("ALL STARS:" + JSON.stringify(this.stars));
    }        
    /*
    -   Write the method drawStar.  Pass in a star as a parameter
        -   it should draw one star
        -   bind the class to the method
    */
    drawStar(star){
        //context.arc(x,y,r,sAngle,eAngle,counterclockwise);
        this.devLog("Drawing Star:" + star);
      

        this.ctx.beginPath();
        this.ctx.lineWidth = star.line.width;
        this.ctx.fileStyle = star.star.color;
        this.ctx.strokeStyle = star.line.color;
        this.ctx.shadowBlur = 4;
        this.ctx.arc(star.position.x,star.position.y,star.radius,0,2*Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
        this.devLog("Drawing Star: " + JSON.stringify(star));
    }
    /*-   Write the method drawStars.  It should
        -   clear the canvas
        -   repeatedly call the method drawStar
        -   bind the class to the method
        -   call the method in the constructor
    */
    drawStars(){
            this.clearStars();
            for(let star in this.stars){
                this.drawStar(this.stars[star]);
            }
    }
    deleteStar(starToDelete){
        for(let star in this.stars){
            if((starToDelete.position.x == this.stars[star].position.x) &&
              (starToDelete.position.y == this.stars[star].position.y) &&
              (starToDelete.destination.x == this.stars[star].destination.x) &&
              (starToDelete.position.y == this.stars[star].position.y)){
                this.stars.splice(star,1);
                this.devLog("StarRouteCompleted");
            }
        }
    }
    moveStar(star){
            // Lets See if we made it
            // Rise / run

            //if((Math.abs(star.position.x - star.destination.x) < this.threshold) && (Math.abs(star.position.y - star.destination.y) < this.threshold)) {
            if((star.position.x == star.destination.x) && (star.position.y == star.destination.y)){
                this.devLog("despawn star @ destination");
                this.deleteStar(star);
            }
            /*
            // Going up
            if(star.position.y > star.destination.y ){
                star.position.y-=star.velocity*();

            }
            if(star.position.y < star.destination.y){
                star.position.y+= star.velocity;
            }

            if(star.position.x < star.destination.x){
                star.position.x+= star.velocity;
            }
            // going left
            if(star.position.x > star.destination.x){
                star.position.x-=star.velocity;
            }
            // going right
          */

         let y1 = star.position.y;
          let y2 = star.destination.y;
          let x1 = star.position.x;
          let x2 = star.destination.x;

          let rise = y2-y1;
          let run = x2-x1;

          let m = rise/run;
          this.devLog("Rise:" + rise + " run: " + run);
            // going down
             if(star.position.y > star.destination.y ){
                star.position.y-=Math.floor(star.velocity / Math.Abs(rise));

            }
            // going up
            if(star.position.y < star.destination.y){
                star.position.y+= Math.floor(star.velocity / Math.Abs(rise));
            }
            // going right
            if(star.position.x < star.destination.x){
                star.position.x+= Math.floor(star.velocity / Math.Abs(run));
            }
            // going left
            if(star.position.x > star.destination.x){
                star.position.x-=Math.floor(star.velocity / Math.Abs(run));
            }
        return star;
    } 
    moveStars(){
        for(let star in this.stars){
            this.stars[star] = this.moveStar(this.stars[star]);
        }

    }
    animateStars(){
        this.timer = setInterval(() => {
            this.clearStars();
            this.createStars();
            this.drawStars();
            this.moveStars();
        }), 5000;
    }
    stopStars(){
        this.devLog("STOPPING STARS" + this.timer);
        clearInterval(this.timer);
    }
    /*
    highlight(e) {
        this.config.position.x = e.pageX - this.$canvas.offsetLeft;
        this.config.position.y = e.pageY - this.$canvas.offsetTop;
    }
    drawLines () {
        for (let i = 0; i < this.config.length; i++) {
            for (let j = 0; j < this.config.length; j++) {
                let iStar = this.config.stars[i];
                let jStar = this.config.stars[j];
                if ((iStar.x - jStar.x) < this.config.distance &&
                    (iStar.y - jStar.y) < this.config.distance &&
                    (iStar.x - jStar.x) > - this.config.distance &&
                    (iStar.y - jStar.y) > - this.config.distance) {
                    if ((iStar.x - this.config.position.x) < this.config.radius &&
                        (iStar.y - this.config.position.y) < this.config.radius &&
                        (iStar.x - this.config.position.x) > - this.config.radius &&
                        (iStar.y - this.config.position.y) > - this.config.radius) {
                        this.$context.beginPath();
                        this.$context.moveTo(iStar.x, iStar.y);
                        this.$context.lineTo(jStar.x, jStar.y);
                        this.$context.stroke();
                        this.$context.closePath();
                    }
                }
            }
        }
    }
    */
    /* Helper functions*/

    // Generate a random Color
    randomColor(){
        /* lighter colors */
        return "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," +      Math.floor(Math.random() * 255)  + ",0.9" + ")"; 
        // let o = Math.round, r = Math.random, s = 255;
        //return 'yellow';
    }
    randomNumber(max){
        return Math.floor(Math.random() * max );
    }
    randomDestination(){
        let y = 0;
        let x = 0;
        let choice = this.randomNumber(4);
        if(choice == 0){ // Point is Top
            y=0;
            x=this.randomNumber(this.width);
                
        }
        else if(choice == 1){ // Point is Left
            y=this.randomNumber(this.height);
            x=0;
        }
        else if(choice == 2){ // Point is Right
            y=this.randomNumber(this.height);
            x=this.width;   
        }
        else if(choice == 3){ // Point is bottom
            y=this.height;
            x=this.randomNumber(this.width);
        }
        else{
            this.devLog("Choice outside bounaries" + choice);
        }
        this.devLog("set random location:" + x + " " + y);
        return [x,y];
        
    }
    clearStars(){
         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

let midnightsky;
window.addEventListener('load', () => midnightsky = new MidnightSky({ devMode: "true"}));
window.addEventListener('resize', () => {
    midnightsky.stopStars();
    //midnightsky = new MidnightSky();
});
