// inside memes.js file
console.log('Memes JS file');
import './general';

class MeMe {
	constructor(){
		this.memeWidth='400';
		this.memeHeight='300';
		//use $ prefix for DOM elements
		this.canvas = window.document.getElementById("canvas");
		this.ctx    = this.canvas.getContext('2d');
		this.form = {
				'file' : window.document.getElementById("fileSelector"),
				'topText' : window.document.getElementById("topText"),
				'bottomText' : window.document.getElementById("bottomText"),
				'generate' : window.document.getElementById("generate"),
				'downloadLink' : window.document.getElementById("downloadLink")
		}
		/* Create Canvas Element */
		this.createCanvas();
		this.setListeners();
	}
	createCanvas(){
			// set initial height and width of canvas
			this.canvas.style.width  = '400';
			this.canvas.style.height = '300';
			 
	}
	createMeme(){
		console.log("Creating Meme");
		/*
		• What method do we use to draw an image on the context?
			https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images

			ar img1 = new Image(); // HTML5 Constructor
			img1.src = 'image1.png';
			img1.alt = 'alt';
			document.body.appendChild(img1);

		• What method do we need to draw text on the context?
				https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text

				fillText(text, x, y [, maxWidth])
				Fills a given text at the given (x,y) position. Optionally with a maximum width to draw.
		• What method do we need to outline text on the context?
		function draw() {
			  var ctx = document.getElementById('canvas').getContext('2d');
			  ctx.font = '48px serif';
			  ctx.strokeText('Hello world', 10, 50);
			}
		• What property do we use to change the font?
				above
		• What property do we use to change the font color?
				ctx.fillStyle = 'orange';
		• What property to we use to change the outline color for the font?
				ctx.strokeStyle = color
		• Let’s see if we can write the code …
		*/

		/* Put the Image on the Canvas */		
		let reader = new FileReader();
		reader.onload = (event) => {
			let img = new Image();
			img.onload = () => {
			  let imgWidth = img.naturalWidth;
			  let screenWidth  = this.memeWdith;
			  let scaleX = 1;
			  if (imgWidth > screenWidth)
			      scaleX = screenWidth/imgWidth;
			  let imgHeight = img.naturalHeight;
			  let screenHeight = this.memeHeight;
			  let scaleY = 1;
			  if (imgHeight > screenHeight)
			      scaleY = screenHeight/imgHeight;
			  let scale = scaleY;
			  if(scaleX < scaleY)
			      scale = scaleX;
			  if(scale < 1){
			      imgHeight = imgHeight*scale;
			      imgWidth = imgWidth*scale;          
			  }

				this.canvas.height = imgHeight;
				this.canvas.width = imgWidth;

				
			  this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0,0, imgWidth, imgHeight);

			  this.addText();
			  this.addDownloadLink();
			}

			img.src = event.target.result;
		}
		reader.readAsDataURL(this.form.file.files[0]);
	}
	addText(){
		/* Put Text On Canvas */
		 this.ctx.textAlign ="center";
		 this.ctx.strokeStyle = "black";
		 this.ctx.fillStyle  = "white";
		 this.ctx.font = '48px serif';
		 this.ctx.fillText(this.form.topText.value, this.memeWidth/2, 50 , this.memeWidth);

		 this.ctx.font = '48px serif';
		 this.ctx.fillText(this.form.bottomText.value,  this.memeWidth/2 , 250 , this.memeWidth);
	}
	addDownloadLink(){
		
		let link = this.form.file.files[0].name;
		this.form.downloadLink.innerHTML = `<a id="downloadAnchor">Download</a>`;
	}
	hasImage(){
		if(this.form.file.files.length > 0 ) { return true; }
		return false;
	}
	setListeners(){
		this.form.generate.addEventListener('click', () => {
				if(this.hasImage()){ this.createMeme();
				}
				else{ 
					alert("You must first select an Image"); 
				}
		 }
        );
		this.form.topText.addEventListener('change', () => {
				if(this.hasImage()){ this.createMeme(); }
		 });
		this.form.bottomText.addEventListener('change', () => {
				if(this.hasImage()){ this.createMeme(); }
		 }
        );        
        window.document.addEventListener("keyup", () => { 
        	if(this.hasImage()){ this.createMeme(); }
        });
        window.document.addEventListener("click",(event) => {
        	if(event.srcElement.id == "downloadAnchor"){
        		this.downloadMeme();
        	}
        });

        // bind
        this.downloadMeme.bind(this);
	}
	downloadMeme(e){
		let link = window.document.getElementById("downloadAnchor");
		link.setAttribute('download', 'Meme.jpg');
		link.setAttribute('href', this.canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream"));
		link.click();
		console.log("should be downloading");

	}
}
let meMe;
window.addEventListener("load",  () => {
    meMe = new MeMe();
    
});
