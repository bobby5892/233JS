/*
 * Bookmarker V 1.0
 * Robert Moore 7/11/2018
 * github.com/bobby5892
 */
/*
Setup your development environment
X    -   clone the repository with the starting files from github
X    -   run npm init from the command line to create your package.json file
X   -   run npm install ... and include the tools that you want to use in your application
X    -   edit the scripts block in package.json to include npm commands you want to use
 
Create the look and feel of your page
X    Use html 5 input attributes to make sure that the url and description are provided.
X        The url should be a valid url too.
    -   At this point the user enters the url and the description.  After we talk about
        making an ajax call in chapter 3, we'll get the image and the title from an api.
  X  Add one or more sample bookmarks to the html page.
    -   Each bookmark is a link that contains: an image, 
        and the text that the user sees.  It also has a description and an icon for deleting.
    -   Don't forget the event handler on the control that deletes the bookmark
 X   Style the list of bookmarks and the page as a whole so it is reasonably attractive
    -   I have provided a screen shot of my page as well as 
        a screen shot of what my page looks like when I'm adding a new bookmark.

Create a class called Bookmarker
    PART 1 - Show the bookmarks
 X   -   Add a constructor
 X       -   Create an instance variable called bookmarks.
 X       -   Try to load the bookmarks from local storage.  If there's nothing in local storage 
            set it equal to an object literal that contains at least 2 bookmarks
            [
                {
                    description: "Really cool site for open source photos", 
                    image: "",
                    link: "https://www.pexels.com/", 
                    title: "https://www.pexels.com/"
                },
            ]
   X     -   call the method fillBookmarksList and pass in the bookmarks

  X  -   Add the generateBookmarkHtml method
 X       -   This method returns a template literal containing the html for ONE bookmark in the array.
  X          It gets called in fillBookMarksList.  It has 2 parameters a bookmark and an index.
   X     -   CUT the html for ONE bookmark from your html page into the body of your method.
   X     -   Enclose the html in ``.
   X     -   Replace the hardcoded description, image, link and title (of the sample bookmark) 
            with template strings that use the properties of the bookmark object
   X     -   Return the template literal

    X-   Add the fillBookmarksList method.  It has bookmarks as its parameter.
     X   -   Save the bookmarks to local storage
  X      -   Create a variable bookmarkHtml and set it equal to the
            the return value for each of the individual tasks combined
            You can do this by calling the reduce method on the array
            It manipulates each element of an array to produce ONE result.  From the ToDoList:
                let tasksHtml = this.tasks.reduce(
                    (html, task, index) => html += this.generateTaskHtml(task, index), 
                    '');
  X      -   Set contents of the bookmarks-list element on the page to the bookmarkHtml variable
        );
    END OF PART 1 - TEST AND DEBUG YOUR CODE - YOU SHOULD SEE HARDCODED BOOKMARKS YOUR ON PAGE

   X PART 2 - Delete a bookmark
   X -   Add the deleteBookmark method.  It has 2 parameters, event and index
   X     -   prevent the default action of the anchor tag using the event parameter
   X     -   delete the bookmark from the list based on the index
   X     -   call fillBookmarksList
   X -   Add an onclick handler to the delete icon
   X     The handler should call the deleteBookmark method with event 
   X     and index (template string) as its parameters
   X END OF PART 2 - TEST AND DEBUG YOUR CODE

    PART 3 - Add a bookmark
    -   Add the function addBookmark.  It has event as its parameter.
      X  -   Because the textboxes for entering bookmark info are in a form, you will
            need to prevent the form from being submitted (which is the default behavior)
            like you prevented the delete link in ToDoList from going to a new page.  
       X -   get the url and the description from the form and create a bookmark object. 
       X     Use the url for both the link and the title.  Leave the image blank.
       X -   add the new bookmark to the list
      XX  -   call fillBookmarksList
        -   clear the form on the UI
    X -   Add a onsubmit handler to the form in the constructor.  
    X    It should call addBookmark.  You must bind this to the class because this will be the form
        when the submit handler is called if you don't.
    END OF PART 3 - TEST AND DEBUG YOUR CODE

    EXTRA CREDIT: 
   X -   Do something on the page to draw attention to the form when you enter and leave 
        the form.  See my screen shot and the styles in the css file to an idea.

*/

/*  THIS IS NECESSARY FOR TESTING ANY OF YOUR CODE
  X  declare a variable bookmarker
  X  Add a window on load event handler that instantiates a Bookmarker object.  
  X  Use and arrow or anonymous function
*/

class BookMarker {
    // Register Listeners
    addEventListeners() {
       // Add Bookmark Click
        window.addEventListener("submit", (event) => {
            event.preventDefault();
            this.addBookmark(event);
        });

        window.addEventListener("click",
            (event) => {
                if (event.srcElement.classList.contains('delete-item')) {
                    this.deleteBookmark(event,this);
                }
                if (event.srcElement.classList.contains('form-control')) {
                    console.log("Clicked Form control");
                    this.highlightField(event);
                }
            });
        window.addEventListener("focusout", (event) => {
            if (event.srcElement.classList.contains('form-control')) {
                this.unHighlightField(event, this);
            }
        });
        
    }
    highlightField(event) {
        /* Highlight Field*/
        event.srcElement.classList.add("highlight");
        /* Highlight table*/
        window.document.getElementsByClassName("bookmark-form")[0].classList.add("highlight-form");
        /* Add Mask */
        window.document.getElementsByClassName("mask")[0].classList.add("wrap-mask");
    }
    unHighlightField(event) {
        event.srcElement.classList.remove("highlight");
        window.document.getElementsByClassName("bookmark-form")[0].classList.remove("highlight-form");
      
        window.document.getElementsByClassName("mask")[0].classList.remove("wrap-mask");
    }
    // Delete Bookmark from array
    deleteBookmark(event, bookMarker) {
        if (window.confirm("Are you sure you want to delete this bookmark?")) {
            let id = event.srcElement.parentElement.parentElement.dataset.index;
        
            this.bookmarks.splice(id, 1);
            this.fillBookmarksList();
        }
    }
    // Add a bookmark to the array from form
    addBookmark(event) {
        event.preventDefault();
        let error = "";
        // check if blank
        if (this.addUrl.value.length == 0) { error += "You must enter a URL\n"; }
        else {
            if (!this.validateUrl(this.addUrl.value)) { error += "You must enter a valid url (ex http://google.com )\n" } 
        }
        if (this.addDescription.value.length == 0) { error += "You must enter a description\n"; }
        

        if (error.length != 0) {
            alert(error);
            return false;
        }

        //unshift onto array (put first)
        this.bookmarks.unshift({
            description: this.addDescription.value,
            image: "",
            link: this.addUrl.value,
            title: this.addUrl.value
        });

        this.addUrl.value = "";
        this.addDescription.value = "";
        this.fillBookmarksList();
    }
    // load the bookmarks and store local
    fillBookmarksList() {
        console.log("Filling Bookmarks");
        let bookMarksHTML = this.bookmarks.reduce((html, bookmark, index) => html +=
            this.generateBookHtml(bookmark, index), '');
        this.bookmarksList[0].innerHTML = bookMarksHTML;
       
        localStorage.setItem('BOOKMARKS', JSON.stringify(this.bookmarks));

    }
    // build image html or blank image
    showImage(index) {
        console.log()
        if (this.bookmarks[index].image.length > 10) {
            return `<img src="${this.bookmarks[index].image}" alt="${this.bookmarks[index].title}">`;
        }
        return `<div class="blank-image-item"></div>`;
    }
    // create the list of bookmarks
    generateBookHtml(bookmark, index) {
        let output = null;
        output = `

            <div class="item" data-index="${index}">
               <div class="item-image">${this.showImage(index)}</div>
               <div class="item-title">
                     <div class="delete-item">Delete</div>
                    <a href="${bookmark.link}">${bookmark.title}</a>
                   
                </div>
               <div class="item-description"><p>${bookmark.description}</p></div>
            </div>
        `;
        return output;
    }
    /* Helper Functions */

    // Validate Url - From https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url

    validateUrl(value) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
    }
    /* Constructor */
    constructor() {
        // Map some things
        this.bookmarksList = document.getElementsByClassName("bookmarks-list");
        this.addButton = document.getElementsByClassName("addButton");
        this.addUrl = document.getElementById("url");
        this.addDescription = document.getElementById("description");
        // grab bookmarks from local storage
        this.bookmarks = JSON.parse(localStorage.getItem('BOOKMARKS'));
        if (!this.bookmarks) {
            this.bookmarks =
                [
                    {
                        description: "Really cool site for open source photos",
                        image: "",
                        link: "https://www.pexels.com/",
                        title: "Pexels"
                    },
                    {
                        description: "LCC Classes",
                        image: "",
                        link: "https://classes.lanecc.edu",
                        title: "LCC Class"
                    }
                ];

        }
        //call fill bookarmks and bind event handlers
        this.fillBookmarksList();
        this.addEventListeners();

        //  bind the event to this class
        this.deleteBookmark.bind(this);
        this.highlightField.bind(this);
        this.unHighlightField.bind(this);
        
    }
}
let bookMarker;
window.addEventListener("load", () => {
    bookMarker = new BookMarker();
});
