import './general.js';


/*
    Written by Robert Moore
    7/23/2018

*/

class MidnightSky {

    constructor(options) {
        this.devMode  = false;
        let settings = {
            seedRate: 10, // How many stars to spawn at once
            seedIntervalMS: 16, // How fast to spawn stars
            seedMaxStars:5000, // Max Number of Stars on Screen
            backgroundColor:'#000000',  // Background Color
            threshold:40, // How far from edge to hide stars / slowdown
            closenessThreshold:50, // how far to be to draw lines
            highlightMode: true // enable highlight mode
        };
          this.defaults = {
            star: {
                color: '#FFFFFF', // base star color
                randomWidth: true, // random width of star
                randomColor: true // Random star color
            },
            line: {
                color: '#FFFFFF', // The color of lines
                randomColor: true, // Random color -  true / false
                width: 3 // The width of star lines
            },
            position: {
                x: 0, // do not adjust
                y: 0 // do not adjust
            },
            destination:{
                x:0,  // Do not Adjust
                y:0   // do not adjust
            },
            width: window.innerWidth,
            height: window.innerHeight,
            velocity: 0.05, // Max Speed of Star
            length: 100, // Not Implemented
            distance: 120, // Not Implemented
            radius: 10, // Max dimensions of star
            gamma:0.9  // Brightness of Colors 0-1
        };
        this.menuSize = 20;
        this.menuOpen = false;
        this.banner = {
            open: false,
            text: "banner",
            timeLeft: 0,
            opacity: 1
        };
        // Create Stars container
        this.stars = [];
        // list of keys to press
        this.keyList = [];
        // Stars timer
        this.timer = null;
        this.tickTime = 100;
        /* Set Defaults */
        this.loadSettings(settings);
        this.loadSettings(this.defaults);
       /* Deal with optional options*/
       if(typeof options == 'object'){
            this.devLog("Loading additional Options via Constructor: ");
            this.loadSettings(options);
       }
       /* setup shorthands */
        this.config = this.defaults;
        this.canvas =  document.getElementsByTagName("canvas")[0];
        this.ctx    = this.canvas.getContext('2d');
        this.mouseX = -1; // Mouse Position X
        this.mouseY = -1; // Mouse Position Y
        /*binds */
        this.setCanvas.bind(this);
        this.setContext.bind(this);
        this.createStars.bind(this);
        this.drawStar.bind(this);
        this.drawStars.bind(this);
        this.stopStars.bind(this);
        this.highlight.bind(this);

        /* additional configuration*/
        this.setCanvas();
        this.setContext();
        this.setInitialPosition();
        this.createStars();
        this.drawStars();
        this.animateStars();
        /* watch mouse movements */
        window.document.addEventListener("mousemove",(e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                if(this.menuOpen){
                     if((e.clientX < this.width-this.menuSize) || (e.clientY < this.height-this.menuSize)){
                        this.closeMenu();
                     }
                }
            });
        /* watch clicks */
         window.document.addEventListener("click",(e) => {
               if((e.clientX > this.width-this.menuSize) && (e.clientY > this.height-this.menuSize)){
                    this.openMenu();
               }
            });
        /* load keys*/
        this.bindKeys();
    }
    devLog(log){
        if(this.devMode){
            console.log("DEV:"  + log);
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
    setCanvas(e){
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.devLog("Setting Canvas Dimensions: " + this.canvas.width + "x" + this.canvas.height);
    }
    setContext(e){
        this.ctx.strokeStyle = this.star.color;
        this.devLog("Setting context strokeStyle:" + this.ctx.strokeStyle);
        this.ctx.fillStyle = this.line.color;
        this.devLog("Setting fileStyle: " + this.ctx.fileStyle);
        this.ctx.lineWidth = this.star.width;
        this.devLog("Setting Star Width: " + this.ctx.lineWidth);
    }
   /* Set Initial Position of Stars */
    setInitialPosition(){
        this.position.x = Math.floor(this.width/2);
        this.position.y = Math.floor(this.height/2);
        this.devLog("Setting Initial Position:" + this.position.x + " x " + this.position.y );
    }    
    
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
            velocity:  ((this.velocity*this.randomFloat(this.velocity))+(this.velocity*0.1)),
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
            star.star.width = this.randomNumber(6);
        }
    
       [star.destination.x,star.destination.y]  = this.randomDestination();
        return star;
    }
    /*Create all Stars */
    createStars(e){
        let createStarCount = this.randomNumber(this.seedRate)+1;
        this.devLog("Creating " + createStarCount + "stars");
        for (let i=0; i< createStarCount; i++) {
           // this.devLog(this.stars.length + " < " + this.seedMaxStars);
            if(this.stars.length < this.seedMaxStars){
              let newStar = this.createStar();
              //this.devLog("STAR" + JSON.stringify(newStar));
               this.stars.push(newStar);
            }
        }
    }        
     /* Draw a single star*/ 
    drawStar(star){
        this.ctx.lineWidth = star.line.width;
        this.ctx.fillStyle = star.star.color;
        this.ctx.strokeStyle = star.line.color;
        this.ctx.beginPath();
        this.ctx.arc(star.position.x,star.position.y,star.radius,0,2*Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
    }
    /* Draw all the stars */
    drawStars(){
            this.clearStars();
            for(let star in this.stars){
                this.drawStar(this.stars[star]);
            }
    }
    /* Delete a star */
    deleteStar(starToDelete){
        for(let star in this.stars){
            if((starToDelete.position.x == this.stars[star].position.x) &&
              (starToDelete.position.y == this.stars[star].position.y) &&
              (starToDelete.destination.x == this.stars[star].destination.x) &&
              (starToDelete.position.y == this.stars[star].position.y)){
                this.stars.splice(star,1);
            }
        }
    }
    /* Move a single Star*/
    moveStar(star){
            // Clear up dead stars
            if((Math.abs(star.position.x) >= this.width-this.threshold) || (Math.abs(star.position.y) >= this.height-this.threshold)){
                this.devLog("despawn star @ destination");
                this.deleteStar(star);
            }
            // Move star in aspect ratio (rise over run)
          let y1 = star.position.y;
          let y2 = star.destination.y;
         
          let x1 = star.position.x;
          let x2 = star.destination.x;

          let rise = y2-y1;
          let run = x2-x1;

          let m = rise/run;
            // going down
             if(star.position.y > star.destination.y ){
                star.position.y-=star.velocity * Math.abs(rise);

            }
            // going up
            if(star.position.y < star.destination.y){
                star.position.y+= star.velocity * Math.abs(rise);
            }
            // going right
            if(star.position.x < star.destination.x){
                star.position.x+= star.velocity * Math.abs(run);
            }
            // going left
            if(star.position.x > star.destination.x){
                star.position.x-=star.velocity * Math.abs(run);
            }
        return star;
    } 
    /* Move all the Stars*/
    moveStars(){
        for(let star in this.stars){
            this.stars[star] = this.moveStar(this.stars[star]);
        }
    }
    /* General Control for Animation */
    animateStars(){
        this.timer = setInterval(() => {
            // Clear the Canvas
            this.clearStars();
            // Draw all the stars
            this.drawStars();
            // Generate any New Stars
            this.createStars();
            // Process the movement for the stars - for the next draw
            this.moveStars();
            // Highlight Stars
            if(this.highlightMode){
                this.highlight();
            }
            // show menu button
            this.drawMenuButton();

            // show menu
            if(this.menuOpen){
                this.openMenu();
            }
            if(this.banner.open){
                console.log("drawing banner");
                this.drawBanner();
            }
        }), this.tickTime;
    }
    /* Stop the stars from moving */
    stopStars(){
        this.devLog("STOPPING STARS" + this.timer);
        clearInterval(this.timer);
    }
    
    highlight() {
       
       let x1 = this.mouseX;
       let y1 = this.mouseY;
 
        for(let star in this.stars){
            let x2 = this.stars[star].position.x;
            let y2 = this.stars[star].position.y;

            // Calculate difference)
            let distance = Math.sqrt(Math.pow((x2-x1), 2)+Math.pow((y2-y1),2))

            if(distance < this.closenessThreshold){
                this.drawLine(this.stars[star]);
            }
        }

    }
    drawLine(star){

        this.ctx.beginPath();
        this.ctx.moveTo(this.mouseX,this.mouseY);
        this.ctx.lineTo(star.position.x,star.position.y);
        this.ctx.lineWidth = star.line.width;
        this.ctx.strokeStyle = star.line.color;
        this.ctx.stroke();
    }
    /* Helper functions*/

    // Generate a random Color
    randomColor(){
        /* lighter colors */
        return "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," +      Math.floor(Math.random() * 255)  + "," + this.gamma+  ")"; 
        
    }

    randomNumber(max){
        return Math.floor(Math.random() * max );
    }
    /* Return a random floating number */
    randomFloat(max){
        return Math.random() * max ;
    }

    /* Pick a destination for the star to go */    
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
    /* Clear the canvas */    
    clearStars(){
         this.ctx.fillStyle = this.backgroundColor;
         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    }

    // Menu Button
    drawMenuButton(){
        let buttonSize = this.menuSize;
        let x = this.canvas.width-buttonSize;
        let y = this.canvas.height-buttonSize;

        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(x,y , this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "black";
        this.ctx.font = "12px Arial";
        this.ctx.fillText('X', x+7, y+15);
    }
    // Show Menu
    openMenu(){
        this.menuOpen = true;
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = "white";
        let x =this.canvas.width-(this.canvas.width*0.3);
        let y =this.canvas.height-(this.canvas.height*0.5); 
        this.ctx.fillRect(x,y, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "black";
        this.ctx.font = "18px Arial";
        x+= 35;
        y+=30;
        this.ctx.fillText('Midnight Sky', x, y);
        y+=20;
        this.ctx.font = "14px Arial";
        this.ctx.fillText('by Robert Moore', x, y);
        y+=15;
        this.ctx.fillText('7/23/2018', x, y);
        y+=20;
        this.ctx.font = "16px Arial";
        this.ctx.fillText('Keyboard Commands:', x, y);
        this.ctx.font = "14px Arial";
        y+=20;
        for(let key in this.keyList){
            y+=15;
            this.ctx.fillText(this.keyList[key], x, y);
        }
        x+=250;
        y-=250;
        this.ctx.font = "11px Arial";
        this.ctx.fillText("Settings:", x, y); 
        this.ctx.font = "10px Arial";
        y+=25;
        this.ctx.fillText("Current Stars:" + this.stars.length, x, y);  
        y+=15;
        this.ctx.fillText("Max Stars:" + this.seedMaxStars, x, y);  
        y+=15;
        this.ctx.fillText("Star Spawn Rate:" + this.seedRate, x, y); 
        y+=15;
        this.ctx.fillText("Star Color:" + this.star.color, x, y); 
        y+=15;
        this.ctx.fillText("Star Color Random:" + this.star.randomColor, x, y); 
        y+=15;
        this.ctx.fillText("Gamma:" + this.gamma, x, y); 
        y+=15;
        this.ctx.fillText("Destruction Zone:" + this.threshold, x, y); 
                

    }
    closeMenu(){
        this.menuOpen = false;
    }
    /* Bind keys */
    bindKeys(){

        this.keyList.push('[a]+ [z]- stars');
        this.keyList.push('[s]+ [x]- spawn rate');
        this.keyList.push('[d]+ [c]- destruction zone');
        this.keyList.push('[q] highlight mode');
        this.keyList.push('[f]+ [v]- gamma');
        this.keyList.push('[1] star color - red');
        this.keyList.push('[2] star color - yellow');
        this.keyList.push('[3] star color - blue');
        this.keyList.push('[h] toggle random star color');
        this.keyList.push('[n] toggle random line color');
        this.keyList.push('[4] line color - red');
        this.keyList.push('[5] line color - yellow');
        this.keyList.push('[6] line color - blue');
        this.keyList.push('[j] increase speed');
        this.keyList.push('[m] decrease speed');
        this.keyList.push('[space] clear stars');

        window.addEventListener('keyup',(e) => {
            if(e.keyCode == 65){ this.increaseStarCount();  } // a
            if(e.keyCode == 90){ this.decreaseStarCount();  } // z
            if(e.keyCode == 83){ this.increaseSpawnRate();  } // s
            if(e.keyCode == 88){ this.decreaseSpawnRate();  } // x
            if(e.keyCode == 68){ this.increaseDestructionZone();  } // d
            if(e.keyCode == 67){ this.decreaseDestructionZone();  } // c
            if(e.keyCode == 81){ this.toggleHighlight();  } // q
            if(e.keyCode == 70){ this.increaseHighlightDistance();  } // f
            if(e.keyCode == 86){ this.decreaseHighlightDistance();  } // v
            if(e.keyCode == 71){ this.increaseGamma();  } // g
            if(e.keyCode == 66){ this.decreaseGamma();  } // b
            if(e.keyCode == 49){ this.setStarColor("red");  } // 1
            if(e.keyCode == 50){ this.setStarColor("yellow");  } // 2
            if(e.keyCode == 51){ this.setStarColor("blue");  } // 3
            if(e.keyCode == 72){ this.toggleStarColor();  } // h
            if(e.keyCode == 78){ this.toggleLineColor();  } // n
            if(e.keyCode == 52){ this.setLineColor("red");  } // 4
            if(e.keyCode == 53){ this.setLineColor("yellow");  } // 5
            if(e.keyCode == 54){ this.setLineColor("blue");  } // 6
            if(e.keyCode == 32){ this.clearAllStars();  } // space
            if(e.keyCode == 74){ this.increaseVelocity();  } // j
            if(e.keyCode == 77){ this.decreaseVelocity();  } // m
        });
    }
    increaseStarCount(){
        this.seedMaxStars = Math.floor(this.seedMaxStars*1.1);
        this.newBanner("Increasing Star Count");
    }
    decreaseStarCount(){
        this.seedMaxStars = Math.floor(this.seedMaxStars*0.9);
         this.newBanner("Decreasing Star Count");
    }
    increaseSpawnRate(){
        this.seedRate =  Math.floor(this.seedRate*1.1);
         this.newBanner("Increase Spawn Rate");
    }
    decreaseSpawnRate(){
        this.seedRate =  Math.floor(this.seedRate*0.9);
        this.newBanner("Decrease Spawn Rate");   
    }
    increaseDestructionZone(){
        this.threshold  = Math.floor(this.threshold *1.1);
        this.newBanner("Increase Destruction Zone");
    }
    decreaseDestructionZone(){
        this.threshold  = Math.floor(this.threshold *0.9);
        this.newBanner("Decrease Destruction Zone");
    }    
    toggleHighlight(){
        this.highlightMode = !this.highlightMode;
        this.newBanner("Setting");
    }
    increaseHighlightDistance(){
        this.closenessThreshold = Math.floor(this.closenessThreshold*1.1);
        this.newBanner("Increasing Highlight Distance");
    }
    decreaseHighlightDistance(){
        this.closenessThreshold = Math.floor(this.closenessThreshold*0.9);
        this.newBanner("Decreasing Highlight distance");
    }
    increaseGamma(){
        if(this.gamma < 1 ) {
            this.gamma += 0.1;
        }
        this.newBanner("Increasing Star Gamma");
        
    }
    decreaseGamma(){
        if(this.gamma > 0.1){
            this.gamma -= 0.1;
        }
        this.newBanner("Decreasing Star Gamma");
    }
    setStarColor(color){
        this.star.color = color;
        this.star.randomColor = false;
        this.newBanner("Setting Star Color to " + this.star.color);
    }
    toggleStarColor(){
        this.star.randomColor = !this.star.randomColor;
        this.newBanner("Random Star Color set to " + this.star.randomColor);
    }
    toggleLineColor(){
        this.line.randomColor = !this.line.randomColor;
        this.newBanner("Random Line Color set to " + this.line.randomColor);
    }
    setLineColor(color){
        this.line.color = color;
        this.newBanner("Line Color set to " + color);
    }
    clearAllStars(){
        this.stars = [];
        this.newBanner("Clear Stars");
    }
    increaseVelocity(){
        this.velocity = this.velocity*1.1;
        this.newBanner("Increasing Speed");
    }
    decreaseVelocity(){
        this.velocity = this.velocity*0.9;
        this.newBanner("Decreasing Speed");
    }
    /* Create a New Banner */
    newBanner(text){
        console.log(text);
        this.banner.text = text;
        this.banner.timeLeft = 500;
        this.banner.opacity = 1;
        this.banner.open = true;
    }
    drawBanner(){
        let textAlign = this.ctx.textAlign;
        this.ctx.textAlign = "center";
        if(this.banner.timeLeft < 0){
            this.banner.open = false;
        }
        this.banner.timeLeft-=this.tickTime;
        this.banner.opacity-= 0.1;

        this.ctx.strokeStyle = 'rgba(255,255,255,' + this.banner.opacity + ')';
        this.ctx.fillStyle = 'rgba(255,255,255,' + this.banner.opacity + ')';
        let x = this.width/2;
        let y = this.height/5;
        this.ctx.font = "44px Arial";
        this.ctx.fillText(this.banner.text, x, y);
        

        // set it back
        this.ctx.textAlign = textAlign;
    }
}

let midnightsky;
window.addEventListener('load', () => midnightsky = new MidnightSky({ devMode: false}));
window.addEventListener('resize', () => {
    midnightsky.stopStars();
    //midnightsky = new MidnightSky();
});
