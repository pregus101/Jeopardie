const COLS = 5;
const ROWS = 6;
const QUESTION_SECONDS = 30;
const FINAL_SECONDS = 120;
const FINAL_ROW = 5;
const FINAL_COL = 2;

// Sounds
const revealSound = new Audio("reveal.mp3");
revealSound.preload = "auto";

const finalSound = new Audio("final.mp3");
finalSound.preload = "auto";
finalSound.loop = true;

// Helpers
const clue = (text, question, answer, extra = {}) => ({
  text,
  color: "#11f",
  textColor: "white",
  textSize: "20px",
  question,
  answer,
  ...extra,
});

// Categories (row 0)
const categories = [
  { text: "Renewable Energy", color: "#55a", textColor: "#fb2", textSize: "24px" },
  { text: "Solar, Wind, and Hydroelectricity", color: "#55a", textColor: "#fb2", textSize: "22px" },
  { text: "The rest of 'em", color: "#55a", textColor: "#fb2", textSize: "24px" },
  { text: "Math", color: "#55a", textColor: "#fb2", textSize: "24px" },
  { text: "Totally normal questions that will shake you to the core with the sheer amount of normailty they exude", color: "#55a", textColor: "#fb2", textSize: "18px" },
];

// Clues (rows 1–5)
// Bottom-middle is a normal clue first, then turns into Final Jeopardy later.
const clueRows = [
  [
    clue("$100", "What is solar energy?", "Energy from sunlight."),
    clue("$100", "What is wind power?", "Energy from moving air."),
    clue("$100", "2 + 2?", "4"),
    clue("$100", "What color is the sky?", "Usually blue."),
    clue("$100", "What planet do we live on?", "Earth."),
  ],
  [
    clue("$200", "Edit question 1", "Edit answer 1"),
    clue("$200", "Edit question 2", "Edit answer 2"),
    clue("$200", "Edit question 3", "Edit answer 3"),
    clue("$200", "Edit question 4", "Edit answer 4"),
    clue("$200", "Edit question 5", "Edit answer 5"),
  ],
  [
    clue("$300", "Edit question 6", "Edit answer 6"),
    clue("$300", "Edit question 7", "Edit answer 7"),
    clue("$300", "Edit question 8", "Edit answer 8"),
    clue("$300", "Edit question 9", "Edit answer 9"),
    clue("$300", "Edit question 10", "Edit answer 10"),
  ],
  [
    clue("$400", "Edit question 11", "Edit answer 11"),
    clue("$400", "Edit question 12", "Edit answer 12"),
    clue("$400", "Edit question 13", "Edit answer 13"),
    clue("$400", "Edit question 14", "Edit answer 14"),
    clue("$400", "Edit question 15", "Edit answer 15"),
  ],
  [
    clue("$500", "Edit question 16", "Edit answer 16"),
    clue("$500", "Edit question 17", "Edit answer 17"),
    clue("$500", "Edit question 18", "Edit answer 18"),
    clue("$500", "Edit question 19", "Edit answer 19"),
    clue("$500", "Edit question 20", "Edit answer 20"),
  ],
];

// Final Jeopardy
const finalJeopardy = {
  question: "Write your Final Jeopardy question here.",
  answer: "Write your Final Jeopardy answer here.",
};

// DOM
const grid = document.getElementById("grid");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayQuestion = document.getElementById("overlay-question");
const overlayAnswer = document.getElementById("overlay-answer");
const overlayHelp = document.getElementById("overlay-help");
const timerEl = document.getElementById("timer");

grid.style.setProperty("--cols", COLS);
grid.style.setProperty("--rows", ROWS);

// State
let answerVisible = false;
let countdown = null;
let seconds = 0;
let mode = null; // "regular" | "final"
let used = 0;
let finalUnlocked = false;
let finalTileEl = null;

// All 25 are real clues now
const totalClues = clueRows.flat().length;

function stopTimer() {
  clearInterval(countdown);
  countdown = null;
  timerEl.classList.add("hidden");
}

function startTimer(sec) {
  stopTimer();
  seconds = sec;
  timerEl.textContent = seconds;
  timerEl.classList.remove("hidden");
  overlayHelp.classList.add("hidden");

  let soundPlayed = false;

  countdown = setInterval(() => {
    seconds--;
    timerEl.textContent = Math.max(seconds, 0);

    if (mode === "regular" && seconds === 12 && !soundPlayed) {
      soundPlayed = true;
      revealSound.currentTime = 0;
      revealSound.play().catch(() => {});
    }

    if (seconds <= 0) {
      stopTimer();
      overlayHelp.classList.remove("hidden");

      if (mode === "final") {
        finalSound.pause();
        finalSound.currentTime = 0;
      }
    }
  }, 1000);
}

function openClue(data, cell) {
  mode = "regular";
  answerVisible = false;

  overlay.classList.remove("hidden");
  overlayTitle.classList.add("hidden");
  overlayQuestion.textContent = data.question;
  overlayAnswer.textContent = data.answer;
  overlayAnswer.classList.add("hidden");
  overlayHelp.classList.add("hidden");

  startTimer(QUESTION_SECONDS);

  cell.textContent = "";
  cell.classList.add("used");
  cell.dataset.used = "true";

  used++;
  if (used >= totalClues && !finalUnlocked) {
    unlockFinalTile();
  }
}

function unlockFinalTile() {
  finalUnlocked = true;

  if (!finalTileEl) return;

  finalTileEl.textContent = "FINAL JEOPARDY";
  finalTileEl.classList.remove("used");
  finalTileEl.classList.add("unlocked");
  finalTileEl.style.fontWeight = "bold";
  finalTileEl.style.cursor = "pointer";
  finalTileEl.style.background = "#b00";
  finalTileEl.style.color = "white";
}

function openFinal() {
  if (!finalUnlocked) return;

  mode = "final";
  answerVisible = false;

  overlay.classList.remove("hidden");
  overlayTitle.textContent = "FINAL JEOPARDY";
  overlayTitle.classList.remove("hidden");
  overlayQuestion.textContent = finalJeopardy.question;
  overlayAnswer.textContent = finalJeopardy.answer;
  overlayAnswer.classList.add("hidden");
  overlayHelp.classList.add("hidden");

  finalSound.currentTime = 0;
  finalSound.play().catch(() => {});

  startTimer(FINAL_SECONDS);
}

function closeOverlay() {
  overlay.classList.add("hidden");
  stopTimer();

  if (mode === "final") {
    finalSound.pause();
    finalSound.currentTime = 0;
  }

  mode = null;
  answerVisible = false;
}

// Build board
const allRows = [categories, ...clueRows];

for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const data = allRows[r]?.[c] || {};
    const cell = document.createElement("div");

    cell.classList.add("tile");
    cell.dataset.row = r;
    cell.dataset.col = c;

    cell.style.background = data.color || "#11f";
    cell.style.color = data.textColor || "white";
    cell.style.fontSize = data.textSize || "14px";
    cell.style.fontFamily = data.fontFamily || "system-ui";
    cell.style.textAlign = "center";

    if (data.text) cell.textContent = data.text;

    if (r === 0) {
      cell.classList.add("category-tile");
    }

    if (r === FINAL_ROW && c === FINAL_COL) {
      finalTileEl = cell;
    }

    if (data.question) {
      cell.classList.add("clue-tile");
      cell.style.cursor = "pointer";
      cell.addEventListener("click", () => {
        if (cell.dataset.used === "true") return;
        openClue(data, cell);
      });
    }

    grid.appendChild(cell);
  }
}

// Add Final Jeopardy click behavior to the same bottom-middle square
if (finalTileEl) {
  finalTileEl.addEventListener("click", () => {
    if (finalUnlocked) openFinal();
  });
}

// Controls
window.addEventListener("keydown", (e) => {
  if (overlay.classList.contains("hidden")) return;

  if (e.code === "Space") {
    e.preventDefault();
    if (!answerVisible) {
      overlayAnswer.classList.remove("hidden");
      answerVisible = true;
    }
  }

  if (e.code === "Escape") {
    closeOverlay();
  }
});