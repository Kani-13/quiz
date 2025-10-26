const startBtn = document.getElementById("start");
const loginBox = document.getElementById("login-box");
const quizBox = document.getElementById("quiz-box");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const nameInput = document.getElementById("name");

let userName = "";
let currentQuestion = 0;
let score = 0;
let totalTime = 5 * 60; 
let timerInterval;


const questions = [
  { question: "Python is a ____ programming language?", options: ["Low-level","High-level","Assembly","Machine-level"], answer: "High-level" },
  { question: "Which of the following is used to define a block of code in Python?", options: ["Curly braces {}", "Indentation", "Parentheses ()", "Square brackets []"], answer: "Indentation" },
  { question: "C language was developed by?", options: ["Dennis Ritchie","James Gosling","Bjarne Stroustrup","Guido van Rossum"], answer: "Dennis Ritchie" },
  { question: "Which operator is used for modulus in C?", options: ["%", "&", "*", "$"], answer: "%" },
  { question: "Java is a ____ language?", options: ["Procedural","Object-Oriented","Functional","Markup"], answer: "Object-Oriented" },
  { question: "Which method is the entry point of a Java program?", options: ["start()","main()","run()","init()"], answer: "main()" },
  { question: "Which keyword is used to create a function in Python?", options: ["def","function","fun","define"], answer: "def" },
  { question: "C programs are compiled using?", options: ["Python Interpreter","C Compiler","Java Virtual Machine","None"], answer: "C Compiler" },
  { question: "Which of the following is used to comment a single line in Java?", options: ["/* comment */","// comment","# comment","<!-- comment -->"], answer: "// comment" },
  { question: "What does 'len()' function do in Python?", options: ["Calculates length","Converts to int","Prints output","Imports library"], answer: "Calculates length" }
];


startBtn.addEventListener("click", () => {
  if (!nameInput.value.trim()) { alert("Enter your name!"); return; }
  userName = nameInput.value.trim();
  loginBox.style.display = "none";
  quizBox.style.display = "block";
  startTimer();
  showQuestion();
});


function startTimer() {
  updateTimer();
  timerInterval = setInterval(() => {
    totalTime--;
    updateTimer();
    if (totalTime <= 0) {
      clearInterval(timerInterval);
      quizBox.style.display = "none";
      submitScore();
    }
  }, 1000);
}

function updateTimer() {
  const m = Math.floor(totalTime/60);
  const s = totalTime % 60;
  timerEl.textContent = `Time Left: ${m}:${s<10?"0":""}${s}`;
}


function showQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.addEventListener("click", () => selectAnswer(opt));
    optionsEl.appendChild(btn);
  });
}


function selectAnswer(answer) {
  if (answer === questions[currentQuestion].answer) score++;
  currentQuestion++;
  if (currentQuestion < questions.length) showQuestion();
  else { clearInterval(timerInterval); quizBox.style.display="none"; submitScore(); }
}


async function submitScore() {
  try {
    const res = await fetch("/submit", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ name:userName, score })
    });
    const data = await res.json();
    resultEl.style.display = "block";
    resultEl.textContent = `Quiz finished! ${data.message} Your score: ${score}/10`;
  } catch (err) {
    console.error(err);
    resultEl.style.display = "block";
    resultEl.textContent = "Error submitting score.";
  }
}
