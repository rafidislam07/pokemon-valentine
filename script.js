// ====== Customize names here ======
const HER_NAME = "Nushy";
const YOUR_NAME = "Rafid";

// ====== Customize assets here ======
const ASSETS = {
  oakBg: "assets/oak-bg.png",
  ringBg: "assets/ring-bg.png",
  loveGifs: ["assets/love1.gif", "assets/love2.gif", "assets/love3.gif"],
};

// ====== Grab elements from HTML ======
const bg = document.getElementById("bg");
const textEl = document.getElementById("text");
const continueBtn = document.getElementById("continueBtn");
const choicesEl = document.getElementById("choices");
const celebrateEl = document.getElementById("celebrate");
const finalTextEl = document.getElementById("finalText");
const gifRowEl = document.getElementById("gifRow");


// ====== AUDIO ======
const bgm = new Audio("assets/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.35;

const caught = new Audio("assets/caught.mp3");
caught.loop = false;
caught.volume = 0.7;

const soundToggle = document.getElementById("soundToggle");
let soundOn = false;

function setSoundLabel() {
  soundToggle.textContent = soundOn ? "🔊 Sound: On" : "🔇 Sound: Off";
}

async function enableSound() {
  soundOn = true;
  setSoundLabel();
  // start bgm safely (must be user-initiated)
  try { await bgm.play(); } catch (e) {}
}

function disableSound() {
  soundOn = false;
  setSoundLabel();
  bgm.pause();
  bgm.currentTime = 0;
}

soundToggle.addEventListener("click", async () => {
  if (!soundOn) await enableSound();
  else disableSound();
});
setSoundLabel();


// ====== "Script" of your story (like a cutscene) ======
const LINES = [
  { bg: ASSETS.oakBg, text: `Welcome to the world of Pokémon, ${HER_NAME}!` },
  { bg: ASSETS.oakBg, text: `Are you ready for your next journey with ${YOUR_NAME}?` },
  { bg: ASSETS.oakBg, text: `Before you answer, I have one very important question...` },
  { bg: ASSETS.ringBg, text: `Will you be ${YOUR_NAME}'s Valentine? 💍❤️`, showChoices: true },
];

// Index = which line we are on
let index = 0;

// Used to cancel typing if user skips quickly
let typingToken = 0;

// ====== Typewriter effect ======
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function typeLine(text, speed = 22) {
  const myToken = ++typingToken;
  textEl.textContent = "";

  for (let i = 0; i < text.length; i++) {
    if (myToken !== typingToken) return; // typing cancelled
    textEl.textContent += text[i];
    await sleep(speed);
  }
}

// ====== Render current "scene" ======
async function renderScene() {
  const scene = LINES[index];

  // set background
  bg.style.backgroundImage = `url("${scene.bg}")`;

  // hide choices/celebration unless needed
  choicesEl.classList.add("hidden");
  celebrateEl.classList.add("hidden");

  // disable button while typing (feels game-like)
  continueBtn.disabled = true;

  await typeLine(scene.text, 18);

  continueBtn.disabled = false;

  if (scene.showChoices) {
    choicesEl.classList.remove("hidden");
  }
}

// ====== Advance to next scene ======
function next() {
  // If already at last scene, do nothing
  if (index >= LINES.length - 1) return;

  index++;
  renderScene();
}

const uiSelect = new Audio("assets/select.mp3");
uiSelect.volume = 0.6;

function playSelect() {
  if (!soundOn) return;
  uiSelect.currentTime = 0;
  uiSelect.play();
}

// ====== Celebration after clicking YES ======
function celebrate() {
      // switch music
  if (soundOn) {
    bgm.pause();
    bgm.currentTime = 0;

    // play caught jingle once
    caught.currentTime = 0;
    caught.play();

    // (optional) resume bgm after jingle ends
    caught.onended = async () => {
      if (soundOn) {
        try { await bgm.play(); } catch (e) {}
      }
    };
    }
  // Hide choices, show overlay
  choicesEl.classList.add("hidden");
  celebrateEl.classList.remove("hidden");

  finalTextEl.textContent =
    `You made ${YOUR_NAME} the happiest trainer alive.\nHappy Valentine’s Day, Jaan! 🥹❤️`;

  // Load gifs
  gifRowEl.innerHTML = "";
  ASSETS.loveGifs.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "love gif";
    gifRowEl.appendChild(img);
  });
}

// ====== Event listeners ======
continueBtn.addEventListener("click", () => {
  playSelect();
  next();
});

// Press Enter to continue (like a game)
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  if (!soundOn) {
    enableSound();
  }

  const choicesVisible = !choicesEl.classList.contains("hidden");
  if (choicesVisible) return;

  const scene = LINES[index];

  if (continueBtn.disabled) {
    typingToken++;
    textEl.textContent = scene.text;
    continueBtn.disabled = false;

    if (scene.showChoices) {
      choicesEl.classList.remove("hidden");
    }
    return;
  }

playSelect();
next();
});


// Choices click
choicesEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".choice");
  if (!btn) return;
  celebrate();
});

// ====== Start ======
renderScene();
