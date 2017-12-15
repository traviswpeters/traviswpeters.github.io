////////////////////////////////////////////////////////////////////////////////
// VERSION 1 ///////////////////////////////////////////////////////////////////

// Load the Express package as a module
const express = require("express");

// Access the exported service
const app = express();

// Serve content of the "public" subfolder directly
app.use(express.static("public"));
// app.use(express.static(__dirname + '/public'));

// // Return a string for requests to the root URL ("/")
// app.get("/", (request, response) => {
//   response.send("Hello from Express!");
// });

// Start listening to incoming requests
// If process.env.PORT is not defined, port number 3000 is used
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

////////////////////////////////////////////////////////////////////////////////
// VERSION 2 ///////////////////////////////////////////////////////////////////

// // Define an article list
// const articles = [
//   { id: 1, title: "First article", content: "Hello World!" },
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

// // Return the articles list in JSON format
// app.get("/api/articles", (request, response) => {
//   response.json(articles);
// });
// // => http://localhost:3000/api/articles
//
// // Enable CORS (see https://enable-cors.org/server_expressjs.html)
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

////////////////////////////////////////////////////////////////////////////////
// VERSION 3 ///////////////////////////////////////////////////////////////////

// // Load the multer package as a module
// const multer = require("multer");
//
// // Access the exported service
// const upload = multer();
//
// // Handle form data submission to the "/animals" route
// app.post("/animals", upload.array(), (request, response) => {
//   const name = request.body.name;
//   const vote = request.body.strongest;
//   response.send(`Hello ${name}, you voted: ${vote}`);
// });

////////////////////////////////////////////////////////////////////////////////
// VERSION 4 ///////////////////////////////////////////////////////////////////

// // Load the body-parser package as a module
// const bodyParser = require("body-parser");
//
// // Access the JSON parsing service
// const jsonParser = bodyParser.json();
//
// // Handle submission of a JSON car array
// app.post("/api/cars", jsonParser, (request, response) => {
//   const cars = request.body;
//   response.send(`You sent me a list of cars: ${JSON.stringify(cars)}`);
// });

////////////////////////////////////////////////////////////////////////////////
// VERSION 5 ///////////////////////////////////////////////////////////////////

// Return a web page for requests to "/hello"
app.get("/hello", (request, response) => {
  response.sendFile(`${__dirname}/views/hello.html`);
});
