//Prettier code extension used (sorry if the format looks weird because of it)
//Referenced JavaScript Tutorial

// ----Launcher Script----

// Object for player/settings
//stores all user's choices in a single place
let playerSettings = {
  name: "",
  difficulty: "medium",
  rounds: 8,
  signalType: "click",
  sound: true,
  penalty: true,
  showAverage: true,
};

// DOM Elements
const form = document.getElementById("setupForm");
const previewText = document.getElementById("previewText");

// Buttons
const openGameBtn = document.getElementById("openGameBtn");
const saveBtn = document.getElementById("saveSettingsBtn");
const loadBtn = document.getElementById("loadSettingsBtn");
const resetBtn = document.getElementById("resetSettingsBtn");
const instructionsBtn = document.getElementById("instructionsBtn");

// ----Event Listeners----

form.addEventListener("input", updatePreview); // when user types/selects anything
// click elements
openGameBtn.addEventListener("click", openGame);
saveBtn.addEventListener("click", saveSettings);
loadBtn.addEventListener("click", loadSettings);
resetBtn.addEventListener("click", resetSettings);
instructionsBtn.addEventListener("click", goToInstructions);

// ----Functions----

// Update preview text
function updatePreview() {
  // reads input values and updates playersettings
  let name = document.getElementById("playerName").value.trim();
  let difficulty = document.getElementById("difficulty").value;
  let rounds = document.getElementById("roundCount").value;

  let signalType = document.querySelector(
    "input[name='signalType']:checked",
  ).value;

  playerSettings.name = name;
  playerSettings.difficulty = difficulty;
  playerSettings.rounds = rounds;
  playerSettings.signalType = signalType;

  //Change: add checkbox values
  playerSettings.sound = document.getElementById("soundEnabled").checked;
  playerSettings.penalty = document.getElementById("falseStartPenalty").checked;
  playerSettings.showAverage = document.getElementById("showAverage").checked;
  //End Change

  previewText.textContent =
    "Player: " +
    (name || "Unknown") +
    " | Difficulty: " +
    difficulty +
    " | Rounds: " +
    rounds +
    " | Mode: " +
    signalType.toUpperCase();
}

// Open game window
function openGame() {
  let name = document.getElementById("playerName").value.trim();

  // Prompt if empty
  if (!name) {
    name = prompt("Enter your name:");
    if (!name) return;
  }

  // Save to cookies
  //Ref: JavaScript Tutorial and  lecture videos
  document.cookie = "playerName=" + name;

  // Store settings in session storage (temp storage until session saved)
  sessionStorage.setItem("playerName", name);
  sessionStorage.setItem("difficulty", playerSettings.difficulty);
  sessionStorage.setItem("rounds", playerSettings.rounds);
  sessionStorage.setItem("signalType", playerSettings.signalType);

  // Open game window
  //window.open("game.html", "_blank", "width=900,height=700"); --old code

  //makes so it opens on the same window as index (not new window)
  window.location.href = "game.html";
}

// Save settings (cookies)
/*old save settings
function saveSettings() {
  document.cookie = "playerName=" + playerSettings.name;
  alert("Settings saved!");
}
*/
//replaced with
function saveSettings() {
  // save EVERYTHING in playerSettings

  //ALWAYS update settings first
  updatePreview();

  sessionStorage.setItem("launcherSettings", JSON.stringify(playerSettings));

  alert("Settings saved!");
}

// Load settings
/*old load settings 
function loadSettings() {
  let cookies = document.cookie.split(";");

  cookies.forEach((c) => {
    let [key, value] = c.trim().split("=");

    if (key === "playerName") {
      document.getElementById("playerName").value = value;
    }
  });

  updatePreview();
  alert("Settings loaded!");
}*/

//replaced with
function loadSettings() {
  const saved = sessionStorage.getItem("launcherSettings");

  if (!saved) {
    alert("No saved settings found.");
    return;
  }

  const settings = JSON.parse(saved);

  document.getElementById("playerName").value = settings.name;
  document.getElementById("difficulty").value = settings.difficulty;
  document.getElementById("roundCount").value = settings.rounds;
  //change: restore checkboxes
  document.getElementById("soundEnabled").checked = settings.sound;
  document.getElementById("falseStartPenalty").checked = settings.penalty;
  document.getElementById("showAverage").checked = settings.showAverage;
  //end change

  document.querySelector(
    `input[name="signalType"][value="${settings.signalType}"]`,
  ).checked = true;

  Object.assign(playerSettings, settings);
  updatePreview();

  alert("Settings loaded!");
}
//end change

//reset settings
function resetSettings() {
  if (confirm("Reset all settings?")) {
    form.reset();
    previewText.textContent = "No settings selected yet.";
  }
}

//go to instructions page
function goToInstructions() {
  window.location.href = "instructions.html";
}
