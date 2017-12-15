// Load the Express package as a module
const express = require("express");

// Access the exported service
const app = express();

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Return a string for requests to the root URL ("/")
app.get("/", (request, response) => {
  response.send("Hello from Express!");
});

// Start listening to incoming requests
// If process.env.PORT is not defined, port number 3000 is used
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

const links = [
    {
        "author": "Sophie",
        "title": "Wikipedia",
        "url": "http://wikipedia.org"
    },
    {
        "author": "Baptiste",
        "title": "Hacker News",
        "url": "https://news.ycombinator.com"
    },
    {
        "author": "Thomas",
        "title": "Reddit",
        "url": "https://reddit.com"
    },
    {
        "author": "Daniel",
        "title": "Boing Boing",
        "url": "https://boingboing.net"
    }
];
// Return the links list in JSON format
app.get("/api/news", (request, response) => {
  response.json(links);
});



// // Define an article list
// const articles = [
//   { id: 1, title: "A DUH article", content: "Hello World!" },
//   {
//     id: 2,
//     title: "Lorem ipsum",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut hendrerit mauris ac porttitor accumsan. Nunc vitae pulvinar odio, auctor interdum dolor. Aenean sodales dui quis metus iaculis, hendrerit vulputate lorem vestibulum."
//   },
//   {
//     id: 3,
//     title: "Lorem ipsum in French",
//     content:
//       "J’en dis autant de ceux qui, par mollesse d’esprit, c’est-à-dire par la crainte de la peine et de la douleur, manquent aux devoirs de la vie. Et il est très facile de rendre raison de ce que j’avance."
//   }
// ];
//
// // Return the articles list in JSON format
// app.get("/api/articles", (request, response) => {
//   response.json(articles);
// });
