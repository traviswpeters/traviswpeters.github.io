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

    // DEBUG: simple log format for Link object.
    log() {
        console.log(`${this.title} - ${this.url} - ${this.author}`);
    }
}
// PULL FIELDS FROM INPUT FORM AND CREATE NEW LINK OBJECT
// const newLink = new Link(inputTitle, inputURL, inputAuthor);

// STORE & UPDATE //////////////////////////////////////////////////////////////

const links = [];
links.push(new Link("Wikipedia", "http://wikipedia.org", "Sophie"));
links.push(new Link("Hacker News", "https://news.ycombinator.com", "Baptiste"));
links.push(new Link("Reddit", "https://reddit.com", "Thomas"));
links.push(new Link("Boing Boing", "https://boingboing.net", "Daniel"));
display();

// Renders a form to enter a new Link for the webpage.
let isLinkFormShown = false;
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", e => {
    if (isLinkFormShown) {
        return;
    }
    // No Link Form is currently being displayed; render one!
    isLinkFormShown = true;
    submitButton.disabled = true;

    // create form
    const addLinkForm = document.createElement("form");
    addLinkForm.id = 'linkForm';
    addLinkForm.className = 'linkForm';
    addLinkFormHTML =
        '<input type="text" id="author" required placeholder="Your Name"> \
         <input type="text" id="title" required placeholder="Page Title"> \
         <input type="text" id="url" required placeholder="URL"> \
         <input id="addLinkButton" type="submit" value="Add Link">';
    addLinkForm.innerHTML = addLinkFormHTML;

    // add form *before* "content" in the "body" of the page
    document.getElementById('mainContainer').insertBefore(addLinkForm, document.getElementById('content'));

    // Shows all user input and cancels form data sending
    const formElement = document.querySelector("form");
    formElement.addEventListener("submit", e => {
        // extract data from the form
        const author = e.target.elements.author.value;
        const title = e.target.elements.title.value;
        const url = e.target.elements.url.value;
        console.log(`author: ${author}, title: ${title}, url: ${url}`);

        // add to list of Link objects and render the list
        links.unshift(new Link(title, url, author));
        display();

        // remove the form itself & update page controls (i.e., re-enable submit button)
        const mainContainer = document.getElementById('mainContainer');
        mainContainer.removeChild(document.getElementById("linkForm"));
        isLinkFormShown = false;
        submitButton.disabled = false;

        // display "success" text; clear it in 2 seconds.
        const resultElement = document.createElement("div");
        resultElement.id = 'resultElement';
        resultElement.className = 'link';
        resultElement.innerHTML = `Success! The link '${title}' has been successfully added!`;
        document.getElementById('mainContainer').insertBefore(resultElement, document.getElementById('content'));

        setTimeout(() => {
            const mainContainer = document.getElementById('mainContainer');
            mainContainer.removeChild(document.getElementById("resultElement"));
        }, 2000);

        // prevent sending off to a server; add link to the page
        e.preventDefault(); // Cancel form data sending
    });

}, this);

// DISPLAY /////////////////////////////////////////////////////////////////////
function display() {
    const content = document.getElementById("content");
    content.innerHTML = '';

    links.forEach((current, index, inputArray) => {
        const linkdiv = document.createElement("div"); // Create an "li" element
        linkdiv.id = index;
        linkdiv.className = 'link';
        linkdiv.innerHTML = current.getHTML();
        content.appendChild(linkdiv);
    });
}
