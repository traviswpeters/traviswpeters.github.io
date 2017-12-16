////////////////////////////////////////////////////////////////////////////////
// SETUP ///////////////////////////////////////////////////////////////////////

// Load the Express package as a module
const express = require("express");
const app = express();

// Load the multer package as a module
const multer = require("multer");
const upload = multer();

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Start listening to incoming requests
// If process.env.PORT is not defined, port number 3000 is used
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log(`Social News webserver is listening on port ${listener.address().port}`);
});

////////////////////////////////////////////////////////////////////////////////
// DATA STRUCTURES & DEFAULTS //////////////////////////////////////////////////

var Link = require('./link.js');
// Example: const newlink = new Link(title, url, author);

const linkList = require("./linklist.js");
// Example: linkList.links;
// Example: linkList.add(newLink);

linkList.addLink(new Link("Wikipedia", "http://wikipedia.org", "Sophie"));
linkList.addLink(new Link("Hacker News", "https://news.ycombinator.com", "Baptiste"));
linkList.addLink(new Link("Reddit", "https://reddit.com", "Thomas"));
linkList.addLink(new Link("Boing Boing", "https://boingboing.net", "Daniel"));

////////////////////////////////////////////////////////////////////////////////
// ROUTES //////////////////////////////////////////////////////////////////////

// Serve content of the "public" subfolder directly
app.use(express.static("public"));

// Return a string for requests to the root URL ("/")
app.get("/", (request, response) => {
    response.sendFile(`${__dirname}/views/index.html`);
});

// Return a list of Link objects in JSON format
app.get("/api/news", (request, response) => {
    response.json(linkList.links);
});

// Handle form data submission to the "/link" route
app.post("/api/link", upload.array(), (request, response) => {
    const author = request.body.author;
    const title = request.body.title;
    const url = request.body.url;

    // VALIDATE + LOG the data
    linkList.addLinkToTop(new Link(title, url, author)); // add to front!
    console.log(request.body);
    linkList.dump();

    // Send back response (success/failure)
    response.send(request.body);
});
