const COLS = 5;
const ROWS = 6;
const QUESTION_SECONDS = 30;
const FINAL_SECONDS = 120;
const FINAL_ROW = 5;
const FINAL_COL = 2;
const revealSound = new Audio("reveal.mp3");
revealSound.preload = "auto";

const finalSound = new Audio("final.mp3");
finalSound.preload = "auto";
finalSound.loop = true;

const clue = (text, question, answer, extra = {}) => ({
  text,
  color: "#11f",
  textColor: "white",
  textSize: "20px", 
  question,
  answer,
  ...extra,
});
const categories = [
  { text: "Renewable Energy", color: "#55a", textColor: "#fb2", textSize: "24px" },
  { text: "Solar, Wind, and Hydroelectricity", color: "#55a", textColor: "#fb2", textSize: "22px" },
  { text: "The rest of 'em", color: "#55a", textColor: "#fb2", textSize: "24px" },
  { text: "Math", color: "#55a", textColor: "#fb2", textSize: "24px" },
  { text: "Totally normal questions that will shake you to the core with the sheer amount of normailty they exude", color: "#55a", textColor: "#fb2", textSize: "18px" },
];





//THE REALLY IMPORTANT PART
//PUT THE QUESTIONS HERE IF I FELL THE FUCK ASLEEP




const clueRows = [
  [
    clue("$100", "\“Renewables are always clean and non-renewables always release greenhouse gases.\”Two examples (one for each) that disprove this statement.", "Nuclear fission energy and biomass."), //column 1
    clue("$100", "What are the two type of solar energies?", "What is passive and active solar (will accept Concentrated Solar and Heat Pump)"), //column 2
    clue("$100", "The source of energy that less developed countries typically use abundantly.", "What is biomass?"), //column 3
    clue("$100", "If each house consumes 10kwh of electricity per day and the nearby solar farm produces 200kwh per day how many houses can the solar farm power?", "What is 20 houses?"), //column 4
    clue("$100", "A Sustainable Development Goal pertaining to clean energy.", "(any one) What is 7: Affordable and clean energy, 9: industry, innovation, and infrastructure, 11: Sustainable cities and communities, 12: Responsible consumption and production?."), //column 5
  ],
  [
    clue("$200", "Name 5 renewable energy sources.", "(in any order) What are biomass, geothermal, wind, solar, and hydroelectric?"), //column 1
    clue("$200", "A category that wind and solar energy fall in, but biomass doesn’t.", "What is nondepletable energy?"), //column 2
    clue("$200", "A clean energy source that can act like a battery and about 80% efficient in generation of electricity", "What is a hydrogen fuel cell?"), //column 3
    clue("$200", "A family of four used a 500 watt microwave for 4 hours a day for 30 days out of a month. They switched to a 300 watt microwave. How many kilowatt hours of energy did they save?", "What is 24 kWh?"), //column 4
    clue("$200", "A reason why the renewable energy sucks for each energy.", "(one from each)Wind: What is taking up space, what is killing birds, what is being loud?Hydroelectric: What is harming fish migration?Solar: What is hazardous waste produced as a by product during manufacturing?"), //column 5
  ],
  [
    clue("$300", "The percent of total energy that comes from renewables.", "What is ~20%?"), //column 1
    clue("$300", "The renewable energy that is the most used around the world overall.", "What is Hydroelectric Power?"), //column 2
    clue("$300", "The root source of geothermal energy.", "What is radioactive decay in Earth’s core?"), //column 3
    clue("$300", "How much energy will the family of four save by switching from a 60-watt incandescent bulb for their kitchen vent light to a 9-watt LED if they run the light for 10 hours a day for 30 days?", "What is 15.3 kWh?"), //column 4
    clue("$300", "Our FAVORITE method of converting ANYTHING into electricity.", "WHAT IS A STEAM TURBINE!?"), //column 5
  ],
  [
    clue("$400", "The country that consumes the most percent of their energy as renewable energy in 2024.\n \n(x2) Within one percent, the percentage of their energy consumed was from renewable sources.", "What is Iceland? \n \n What is 80.5%?"), //column 1
    clue("$400", "A problem that wind, solar, and hydroelectric all share around energy input.(x2) A solution to this problem", "What are fluctuating input levels?What is a smart grid?"), //column 2
    clue("$400", "Two ways to use biomass.(x2) Two MORE ways to use biomass", "What is direct combustion (fire), pyrolysis (charcoal), anaerobic digestion (methane), and aerobic fermentation (ethanol)?+ Point per correct- Point per incorrect2 pts = 4004pts = 800No half points!"), //column 3
    clue("$400", "A city burns coal for most of their energy. They spend $5000 per month on coal for said energy. The city wants to instead install solar panels, which will cost $400,000 to install and $500 per year to maintain. It will take _______ years to break even (make back the costs).", "What is 7? (>6.722)"), //column 4
    clue("$400", "What materials are typically used for biomass?", "What is Wood, Animal waste, Algae, and Agricultural leftovers"), //column 5
  ],
  [
    clue("$500", "The three pillars of sustainable development.", "What are economy, society, and environment?"), //column 1
    clue("$500", "The renewable energy that comes from the MOON!", "What is Tidal Energy?"), //column 2
    clue("$500", "Percentage of corn used to make ethanol.", "What is 40%?"), //column 3
    clue("$500", "Every house in a neighborhood consumes 800 watt-hours of energy each time they use the washing machine. A new Energy Star washing machine only consumes 450 watt-hours each use. If 80% of the neighborhood of 50 houses switched to Energy Star washing machines, they would save about _________ of energy in a year, given they use the machine every 5 days.", "What is 1022 kWh?"), //column 4
    clue("$500", "List 7 clean energies", "What is solar, wind, geothermal, nuclear fusion, nuclear fission, hydrogen, hydro, osmotic power, oceanic thermal, Piezoelectricity, Triboelectric Nanogenerators, Microbial Fuel cells, and small Modular reactors?"), //column 5
  ],
];





//appears after you finish all other questions (click question and then click esc to skip it)
const finalJeopardy = {
  question: "I am the of the classification that shan't prioritize the finite but instead the abundant. I am able to emit or not to emit I may include that of dams or possibly that of the burning of waste, but I shan’t burn that made of oil or coal. What am I?",
  answer: "What is Renewable energy?",
};

const grid = document.getElementById("grid");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayQuestion = document.getElementById("overlay-question");
const overlayAnswer = document.getElementById("overlay-answer");
const overlayHelp = document.getElementById("overlay-help");
const timerEl = document.getElementById("timer");

grid.style.setProperty("--cols", COLS);
grid.style.setProperty("--rows", ROWS);

let answerVisible = false;
let countdown = null;
let seconds = 0;
let mode = null;
let used = 0;
let finalUnlocked = false;
let finalTileEl = null;
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
if (finalTileEl) {
  finalTileEl.addEventListener("click", () => {
    if (finalUnlocked) openFinal();
  });
}
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
