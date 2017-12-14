////////////////////////////////////////////////////////////////////////////////

//
// BOOM Counter
//

// Count down the counter until 0
const decreaseCounter = () => {
  // Convert counter text to a number
  const counter = Number(counterElement.textContent);
  if (counter > 1) {
    // Decrease counter by one
    counterElement.textContent = counter - 1;
  }
  else {
    // Cancel the repeated execution
    clearInterval(intervalId);
    // Modify the page title
    const titleElement = document.getElementById("title");
    titleElement.textContent = "BOOM!!";
    // Modify the title after 2 seconds
    setTimeout(() => {
      titleElement.textContent = "Everything's broken now :(";
    }, 2000);
  }
};

const counterElement = document.getElementById("counter");

// Call the decreaseCounter function every second (1000 milliseconds)
const intervalId = setInterval(decreaseCounter, 1000);

////////////////////////////////////////////////////////////////////////////////

//
// Chrono-Counter
//

const chronStartCounterElement = document.getElementById("chronoStartButton");
const chronStopCounterElement = document.getElementById("chronoStopButton");
const chronCounterElement = document.getElementById("chronCounter");
let chronoIntervalId = -1;

const chronoCounter = () => {
  // Convert counter text to a number
  const counter = Number(chronCounterElement.textContent);
  chronCounterElement.textContent = counter + 1;
};

// click "start" handler
chronStartCounterElement.addEventListener('click', function(event) {
    chronStartCounterElement.disabled = true;
    chronStopCounterElement.disabled = false;
    chronoIntervalId = setInterval(chronoCounter, 1000);
});

// click "stop" handler
chronStopCounterElement.addEventListener('click', function(event) {
    chronStartCounterElement.disabled = false;
    chronStopCounterElement.disabled = true;
    clearInterval(chronoIntervalId);
});

////////////////////////////////////////////////////////////////////////////////

//
// Bouncing Basketball
//
