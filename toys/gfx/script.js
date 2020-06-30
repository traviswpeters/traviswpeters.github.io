// Shows all user input and cancels form data sending
// Show some info about the first form element
const formElement = document.querySelector("form");

formElement.addEventListener("submit", e => {
  const lines = e.target.elements.pastedlines.value;
  console.log(`Pasted Lines (lines): ${lines}`);

  var newLines = document.getElementById("newlines");
  newLines.textContent = "";

  var result = lines.match( /[^\.!\?]+[\.!\?]+/g );
  result.forEach(function (item, index) {
    console.log(item, index);

    var newParagraph = document.createElement('p');
    newParagraph.textContent = item;
    newLines.appendChild(newParagraph);
  });

  e.preventDefault(); // Cancel form data sending
});
