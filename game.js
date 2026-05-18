//Prettier code extension used (sorry if the format looks weird because of it)
//Referenced JavaScript Tutorial

// ----Game Script----

// Game Objects
// player object (gets data from launcher)
let player = {
  name: sessionStorage.getItem("playerName") || "Guest",
  bestScore: 0,
};

//change: Get signal type from launcher
let signalType = sessionStorage.getItem("signalType") || "click";
//nd change

// tracks score, rounds, reaction time
let gameState = {
  round: 0,
  score: 0,
  totalRounds: parseInt(sessionStorage.getItem("rounds")) || 5,
  reactionTimes: [], // arrays for average and best time
  falseStarts: 0,
  isActive: false,
};

// DOM Elements
const displayPlayer = document.getElementById("displayPlayer");
const displayRound = document.getElementById("displayRound");
const displayScore = document.getElementById("displayScore");
const displayBestTime = document.getElementById("displayBestTime");
const displayAverageTime = document.getElementById("displayAverageTime");
const displayFalseStarts = document.getElementById("displayFalseStarts");

const signalArea = document.getElementById("signalArea");
const messageArea = document.getElementById("messageArea");
const resultsArea = document.getElementById("resultsArea");

// Buttons
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("nextRoundBtn").addEventListener("click", nextRound);
document.getElementById("resetBtn").addEventListener("click", resetGame);
document.getElementById("saveBtn").addEventListener("click", saveGame);
document.getElementById("loadBtn").addEventListener("click", loadGame);

//change: spacebar input
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); // ✅ IMPORTANT (stops scrolling)

    if (signalType === "spacebar" || signalType === "mixed") {
      handleReaction();
    }
  }
});
//end change

/*document
  .getElementById("backBtn")
  .addEventListener("click", () => window.close());*/
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

// Game Log time stamp
//REF: Logging: https://engineering.deptagency.com/in-praise-of-logging-a-node-js-javascript-logging-guide
//REF:date and time: https://www.w3schools.com/jsref/jsref_sethours.asp
function getCurrentTime() {
  let now = new Date();

  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, "0");
  let seconds = String(now.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`; // like [10:10:10]
}

const logArea = document.getElementById("logArea");

function addLog(message) {
  let time = getCurrentTime();
  logArea.textContent += `[${time}] ${message}\n`;
}

// Game Variables
let startTime = 0;
let signalReady = false;

// ----Initialize----
displayPlayer.textContent = player.name;
//add: display signal type in message area
const signalDisplay = document.getElementById("signalTypeDisplay");

let displayText = "";

if (signalType === "click") {
  displayText = "Mode: Click Signal";
} else if (signalType === "spacebar") {
  displayText = "Mode: Spacebar Signal";
} else if (signalType === "mixed") {
  displayText = "Mode: Mixed";
}

signalDisplay.textContent = displayText;

// ----Game Functions----
function startGame() {
  //resets score, rounds, array
  alert("Game started!");
  addLog("Game started");
  gameState.isActive = true;
  gameState.round = 0;
  gameState.score = 0;
  gameState.reactionTimes = [];
  nextRound();
}

function nextRound() {
  if (!gameState.isActive) return;

  if (gameState.round >= gameState.totalRounds) {
    endGame();
    return;
  }

  gameState.round++;
  addLog("Round " + gameState.round + " activated");
  updateUI();

  signalArea.textContent = "WAIT...";
  signalArea.style.backgroundColor = "red";
  signalArea.style.color = "white";
  signalReady = false;

  let delay = Math.random() * 3000 + 1000;
  //random delay using Math.random()

  setTimeout(() => {
    signalArea.textContent = "CLICK!";
    //shows WAIT then CLICK! after a delay
    signalArea.style.backgroundColor = "green";
    signalArea.style.color = "white";

    signalReady = true;
    startTime = Date.now();
  }, delay);
}

// Click reaction
//signalArea.addEventListener("click", handleReaction);

//replaced with
signalArea.addEventListener("click", () => {
  if (signalType === "click" || signalType === "mixed") {
    handleReaction();
  }
});
//end change

signalArea.style.backgroundColor = "red";
signalArea.textContent = "WAIT...";

/*broken handleReaction
function handleReaction() {
  if (!gameState.isActive) return;

  if (!signalReady) {
    gameState.falseStarts++;
    alert("False start!");
    updateUI();
    return;
    addLog(
      "Round " + gameState.round + " completed in " + reactionTime + " ms",
    ); 
  }*/

//change: Refactored handleReaction to fix false start logging and add logs for each round completion
function handleReaction() {
  if (!gameState.isActive) return;

  if (!signalReady) {
    gameState.falseStarts++;
    alert("False start!");
    addLog("False start in round " + gameState.round);
    updateUI();
    return;
  }

  let reactionTime = Date.now() - startTime;
  gameState.reactionTimes.push(reactionTime);
  gameState.score += Math.max(0, 1000 - reactionTime);

  resultsArea.textContent +=
    "Round " + gameState.round + ": " + reactionTime + " ms\n";

  //addLog("Round " + gameState.round + " completed in " + reactionTime + " ms"); (removed later>)
  updateStats();
  //updateUI(); (removed later)

  signalReady = false;
}
//end change

let reactionTime = Date.now() - startTime;
// measure player reaction time
gameState.reactionTimes.push(reactionTime);
gameState.score += Math.max(0, 1000 - reactionTime);
// faster reaction == higer score

resultsArea.textContent +=
  "Round " + gameState.round + ": " + reactionTime + " ms\n";

updateStats();
signalReady = false;

function updateStats() {
  let best = Math.min(...gameState.reactionTimes); //find best time
  let avg = // cal avg
    gameState.reactionTimes.reduce((a, b) => a + b, 0) /
    gameState.reactionTimes.length;

  displayBestTime.textContent = best + " ms";
  displayAverageTime.textContent = avg.toFixed(0) + " ms";
}

function updateUI() {
  displayRound.textContent = gameState.round;
  displayScore.textContent = gameState.score;
  displayFalseStarts.textContent = gameState.falseStarts;
}
/*old endGame
function endGame() {
  alert("Game Over!");
  addLog("Game ended with score " + gameState.score);

  // Save best score in cookie
  document.cookie = "bestScore=" + gameState.score;

  gameState.isActive = false;
}*/

//replaced with
function endGame() {
  gameState.isActive = false;

  //Calculate best and average times
  let bestTime = Math.min(...gameState.reactionTimes);

  let avgTime =
    gameState.reactionTimes.reduce((a, b) => a + b, 0) /
    gameState.reactionTimes.length;

  // Show popup message
  alert(
    "Game Over!\n\n" +
      "Best Time: " +
      bestTime +
      " ms\n" +
      "Average Time: " +
      avgTime.toFixed(0) +
      " ms\n" +
      "Score: " +
      gameState.score,
  );

  // Log result
  addLog("Game ended. Score: " + gameState.score);

  // Save best score
  document.cookie = "bestScore=" + gameState.score;

  //If no rounds completed
  if (gameState.reactionTimes.length === 0) {
    alert("Game Over! No valid reactions recorded.");
    return;
  }
}
//end change

// ----Storage----
/* old saveGame
function saveGame() {
  sessionStorage.setItem("score", gameState.score);
  sessionStorage.setItem("round", gameState.round);
  alert("Game saved!");
}*/

//replaced with
function saveGame() {
  sessionStorage.setItem("savedGameState", JSON.stringify(gameState));

  alert("Game session saved!");
}
//end change

/* old loadGame
function loadGame() {
  const saved = sessionStorage.getItem("savedGameState");

  if (!saved) {
    alert("No saved game found.");
    return;
  }

  gameState = JSON.parse(saved);
  updateUI();
  alert("Game loaded!");
}*/

//replaced with
function loadGame() {
  const saved = sessionStorage.getItem("savedGameState");

  if (!saved) {
    alert("No saved game found.");
    return;
  }

  gameState = JSON.parse(saved);

  updateUI();

  if (gameState.reactionTimes.length > 0) {
    updateStats();
  }

  addLog("Game session loaded");

  alert("Game session loaded!");
}
//end change

// ----Reset----
function resetGame() {
  if (!confirm("Reset game?")) return; // prevent accidental reset (confirmation )

  gameState = {
    round: 0,
    score: 0,
    totalRounds: gameState.totalRounds,
    reactionTimes: [],
    falseStarts: 0,
    isActive: false,
  };

  resultsArea.textContent = "No results yet.";
  logArea.textContent = "";
  updateUI();
}
