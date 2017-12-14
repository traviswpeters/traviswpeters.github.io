// List of questions (statement + answer)
const questions = [
  {
    statement: "2+2?",
    answer: "2+2 = 4"
  },
  {
    statement: "In which year did Christopher Columbus discover America?",
    answer: "1492"
  },
  {
    statement: "What is the answer to life, the universe, and everything?",
    answer: "42"
  },
  {
    statement:
      "What occurs twice in a lifetime, but once in every year, twice in a week but never in a day?",
    answer: "The E letter"
  }
];

// Web page loading event
window.addEventListener("load", e => {
    const content = document.getElementById("content");
    questions.forEach(function(question, index) {
        console.log(`DEBUG: question ${index}: ${question.statement}`);
        console.log(`DEBUG: answer: ${question.answer}`);

        // create a block to contain the question/answer
        const questionAnswerBlock = document.createElement("p"); // Create an "li" element
        questionAnswerBlock.id = `block${index}`;

        // question
        const q = document.createElement("div");
        q.innerHTML = `<b>Question ${index+1}:</b> <i>${question.statement}</i>`;
        questionAnswerBlock.appendChild(q);

        const a = document.createElement("div");

        // create a button to conceal the answer until clicked...
        var showButton = document.createElement('button');
        showButton.id = index;
        showButton.textContent = 'Show Answer';
        showButton.className = 'showButton';
        showButton.addEventListener("click", e => {
            // reveal the answer when the user clicks on the button
            console.log(`DEBUG:: Event type: ${e.type}, target: ${e.target.id}, targetParentNode: ${e.target.parentNode}`);

            // show answer
            a.innerHTML = `${question.answer}`;
            questionAnswerBlock.appendChild(a);

            // delete button
            e.target.parentNode.removeChild(e.target);
        }, this);
        questionAnswerBlock.appendChild(showButton);

        // finally, append the container questionAnswerBlock to the page content
        content.appendChild(questionAnswerBlock);
    });
});
