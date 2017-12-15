////////////////////////////////////////////////////////////////////////////////
// LINK OBJECT /////////////////////////////////////////////////////////////////

class Link {

    constructor(title, url, author) {
        this.title = title;
        this.url = this.standardizeURL(url);
        this.author = author; // "submitter"
    }

    // Return the URL with http:// or https:// (default: http://)
    standardizeURL(url) {
        const defaultPrefix = 'http://';
        const isHTTP = url.startsWith("http://");
        const isHTTPS = url.startsWith("https://");
        if (isHTTP || isHTTPS) {
            return url;
        } else {
            return defaultPrefix+url;
        }
    }

    // This HTML is only that which resides *within* its containing `div` element.
    getHTML() {
        var html = '';
        html += `<h4 class="linkHeadline"><a class="linkTitle" href="${this.url}">${this.title}</a> <span class="linkUrl">${this.url}</span></h4>`;
        html += `<span class="linkAuthor">Submitted by ${this.author}</span>`;
        return html;
    }

}

////////////////////////////////////////////////////////////////////////////////
// LINK LIST OBJECT (STORAGE) //////////////////////////////////////////////////

var linkList = {

    // the actual list holding todos
    links: [],

    addLink: function(linkObj) {
        this.links.unshift(linkObj);
        view.displayLinks();
    },

    // for batched adds
    addLinkNoDisplay: function(linkObj) {
        this.links.unshift(linkObj);
    }

};

////////////////////////////////////////////////////////////////////////////////
// UPDATE //////////////////////////////////////////////////////////////////////

// Renders a form to enter a new Link for the webpage.
let isLinkFormShown = false;
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", e => {

    // If the Link Form is already shown, no further work should be done.
    if (isLinkFormShown) {
        return;
    } else { // No Link Form is currently being displayed; render one!
        isLinkFormShown = true;
        submitButton.disabled = true;
    }

    /*
     * Render the form.
     * -> Here we create the new Link form text (HTML) +
     *  insert the form as the first "thing" within the content `div` before any links.
     */

    var addLinkFormHTML =
        '<form class="linkForm"> \
         <input type="text" id="author" required placeholder="Your Name"> \
         <input type="text" id="title" required placeholder="Page Title"> \
         <input type="text" id="url" required placeholder="URL"> \
         <input id="addLinkButton" type="submit" value="Add Link"> \
         </form>';
    document.getElementById('content').insertAdjacentHTML("afterBegin", addLinkFormHTML);

    /*
     * Form-handling.
     */

    // Shows all user input and cancels form data sending
    const formElement = document.querySelector("form");
    formElement.addEventListener("submit", e => {
        // extract data from the form & add to list of Link objects
        const author = e.target.elements.author.value;
        const title = e.target.elements.title.value;
        const url = e.target.elements.url.value;

        // NOTE: Adding the new Link:
        //   (1) causes the list to be re-rendered
        //   (2) and as a result, automatically "deletes" the `form` element
        linkList.addLink(new Link(title, url, author));

        // remove the form itself & update page controls (i.e., re-enable submit button)
        isLinkFormShown = false;
        submitButton.disabled = false;

        // user feedback: display "success" text & setup timer to clear it in 2 seconds.
        const resultElement = document.createElement("div");
        resultElement.id = 'resultElement';
        resultElement.className = 'link';
        resultElement.innerHTML = `Success! The link '${title}' has been successfully added!`;
        document.getElementById('content').insertAdjacentHTML("afterBegin", resultElement.outerHTML);
        setTimeout(() => {
            document.getElementById('content').removeChild(document.getElementById("resultElement"));
        }, 2000);

        // prevent sending off to a server; add link to the page
        e.preventDefault(); // Cancel form data sending
    });
}, this);

////////////////////////////////////////////////////////////////////////////////
// DISPLAY /////////////////////////////////////////////////////////////////////

// An object for UI-related methods
var view = {
    displayLinks: function() {
        const content = document.getElementById("content");
        content.innerHTML = '';

        linkList.links.forEach((current, index, inputArray) => {
            const linkdiv = document.createElement("div"); // Create an "li" element
            linkdiv.id = index;
            linkdiv.className = 'link';
            linkdiv.innerHTML = current.getHTML();
            content.appendChild(linkdiv);
        });
    }
};

////////////////////////////////////////////////////////////////////////////////
// MAIN ////////////////////////////////////////////////////////////////////////

/*
 * Add a few default Links (works even if our webserver is not "up")
 */

// linkList.addLink(new Link("Wikipedia", "http://wikipedia.org", "Sophie"));
// linkList.addLink(new Link("Hacker News", "https://news.ycombinator.com", "Baptiste"));
// linkList.addLink(new Link("Reddit", "https://reddit.com", "Thomas"));
// linkList.addLink(new Link("Boing Boing", "https://boingboing.net", "Daniel"));

/*
 * Add a few default Links - Fetch from our webserver API (works only if our webserver is "up")
 */

fetch("http://localhost:3000/api/news")
    .then(response => response.json()) // Translate JSON into JavaScript
    .then(links => {
        // console.log(links);
        links.forEach(link => {
            linkList.addLink(new Link(link.title, link.url, link.author));
            // addLinkNoDisplay(new Link(link.title, link.url, link.author));
        });
        // view.displayLinks();
    })
    .catch(err => {
        console.error(`ERROR: ${err.message}`);
    });
