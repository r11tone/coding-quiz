const qs = (s) => document.querySelector(s);
const welcomeEl = qs("#welcome");
const startQuizBtnEl = qs("#startQuiz");
const quizEl = qs("#quiz");
const questionEl = qs("#question");
const answersEl = qs("#answers");
const inputScoreEl = qs("#inputScore");
const initialsEl = qs("#initials");
const submitInitialsBtnEl = qs("#submitInitials");
const userScoreEl = qs("#score");
const highScoresEl = qs("#highScores");
const scoresEl = qs("#scores");
const goBackBtnEl = qs("#goBack");
const clearScoresBtnEl = qs("#clearScores");
const viewHScoresBtnEl = qs("#viewHScores");
const timerEl = qs("#timer");

let score = 0, currentQ = 0, highScores = [], interval, timeGiven = 75, secondsElapsed = 0;

const questions = [  {    title: "Which is the correct way to create an HTML hyperlink?",    choices: ["url", "href", "<p>", "www."],
    answer: "href"
  },
  {
    title: "Which of the following is the correct Javascript format for a comment?",
    choices: ["// comment", "'comment'", "(comment)", "\\ comment"],
    answer: "// comment"
  },
  {
    title: "What surrounds a string?",
    choices: ['""', "{}", "()", "[]"],
    answer: '""'
  },
  {
    title: "Which built-in method returns the calling string value converted to lower case?",
    choices: ["toLowerCase()", "toLower()", "changeCase(case)", "None of the Above"],
    answer: "toLowerCase()"
  },
  {
    title: "A Javascript file has an extension of which of the following?",
    choices: [".jscrpt", "css", "ligma", ".js"],
    answer: ".js"
  },
  {
    title: "Which of the following function of Array object joins all elements of an array into a string?",
    choices: ["concat()", "join()", "pop()", "map()"],
    answer: "join()"
  }
];

const startTimer = () => {
  timerEl.textContent = timeGiven;
  interval = setInterval(() => {
    secondsElapsed++;
    timerEl.textContent = timeGiven - secondsElapsed;
    if (secondsElapsed >= timeGiven) {
      currentQ = questions.length;
      nextQuestion();
    }
  }, 1000);
}

const stopTimer = () => clearInterval(interval);

const nextQuestion = () => {
  currentQ++;
  if (currentQ < questions.length) renderQuestion();
  else {
    stopTimer();
    if (timeGiven - secondsElapsed > 0) score += timeGiven - secondsElapsed;
    userScoreEl.textContent = score;
    hide(quizEl);
    show(inputScoreEl);
    timerEl.textContent = 0;
  }
}

const checkAnswer = (answer) => {
  if (questions[currentQ].answer == questions[currentQ].choices[answer.id]) {
    score += 5;
    displayMessage("Correct!");
  } else {
    secondsElapsed += 10;
    displayMessage("Wrong...");
  }
}

const displayMessage = (m) => {
  const messageHr = document.createElement("hr");
  const messageEl = document.createElement("div");
  messageEl.textContent = m;
  qs(".jumbotron").appendChild(messageHr);
  qs(".jumbotron").appendChild(messageEl);
  setTimeout(() => {
    messageHr.remove();
    messageEl.remove();
  }, 2000);
}
  
//The "hide" function hides the element passed as a parameter by setting its "display" CSS property to "none".
const hide = (element) => element.style.display = "none";

//The "show" function displays the element passed as a parameter by setting its "display" CSS property to "block".
const show = (element) => element.style.display = "block";

//The "reset" function resets local variables used in the quiz to their default values.
const reset = () => {
  score = currentQ = secondsElapsed = 0;
  timerEl.textContent = 0;
};

//The "renderQuestion" function renders the current question onto the page by updating the question and answer elements with the current question's title and choices respectively.
const renderQuestion = () => {
  const currentQuestion = questions[currentQ];
  questionEl.textContent = currentQuestion.title;
  answersEl.innerHTML = currentQuestion.choices
    .map((choice, index) => `<button>${index + 1}: ${choice}</button>`)
    .join("");
};

//The "renderHighScores" function renders the high scores stored in local storage onto the page by iterating through the scores array and creating a new element for each score to be displayed.
const renderHighScores = () => {
  const highScores = JSON.parse(localStorage.getItem("scores")) || [];
  scoresEl.innerHTML = highScores
    .map((highScore, index) => `
      <div class="row mb-3 p-2" style="background-color:PaleGreen;">
        ${index + 1}. ${highScore.username} - ${highScore.userScore}
      </div>
    `)
    .join("");
  show(highScoresEl);
};

//The "viewHScoresBtnEl" event listener listens for a click on the "View High Scores" button and performs the necessary actions to display the high scores on the page.
viewHScoresBtnEl.addEventListener("click", () => {
  hide(welcomeEl);
  hide(quizEl);
  hide(inputScoreEl);
  renderHighScores();
  stopTimer();
  reset();
});

//The "startQuizBtnEl" event listener listens for a click on the "Start Quiz" button and performs the necessary actions to start the quiz.
startQuizBtnEl.addEventListener("click", () => {
  hide(welcomeEl);
  startTimer();
  renderQuestion();
  show(quizEl);
});

//The "answersEl" event listener listens for a click on any button within the answer element and performs the necessary actions to check the answer and display the next question.
answersEl.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    checkAnswer(e.target);
    nextQuestion();
  }
});

//The "submitInitialsBtnEl" event listener listens for a click on the "Submit" button and performs the necessary actions to save the user's score and display the high scores.
submitInitialsBtnEl.addEventListener("click", () => {
  const initialsValue = initialsEl.value.trim();
  if (initialsValue) {
    const userScore = { username: initialsValue, userScore: score };
    initialsEl.value = "";
    const highScores = JSON.parse(localStorage.getItem("scores")) || [];
    highScores.push(userScore);
    localStorage.setItem("scores", JSON.stringify(highScores));
    hide(inputScoreEl);
    renderHighScores();
    reset();
  }
});

//The "goBackBtnEl" event listener listens for a click on the "Go Back" button and performs the necessary actions to return to the welcome page.
goBackBtnEl.addEventListener("click", () => {
  hide(highScoresEl);
  show(welcomeEl);
});

//The "clearScoresBtnEl" event listener listens for a click on the "Clear High Scores" button and performs the necessary actions to clear the high scores from local storage and update the display.
clearScoresBtnEl.addEventListener("click", () => {
  localStorage.setItem("scores", "[]");
  renderHighScores();
});
