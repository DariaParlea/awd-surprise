// Surprise: a word with two faces
// Two small interactions. Without JavaScript the page still reads
// completely; the buttons simply stay hidden.

// ---------- 0. Accessibility tools: larger text and dark mode ----------
// The choice is remembered in the browser (localStorage), if allowed.
const root = document.documentElement;
const tools = document.getElementById("a11y-tools");
const textButton = document.getElementById("text-size");
const themeButton = document.getElementById("theme-toggle");

function remember(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* storage blocked: ignore */ }
}
function recall(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}

function setLargeText(on) {
  root.classList.toggle("large-text", on);
  textButton.setAttribute("aria-pressed", on ? "true" : "false");
}

function setDark(on) {
  root.setAttribute("data-theme", on ? "dark" : "light");
  themeButton.setAttribute("aria-pressed", on ? "true" : "false");
}

if (tools && textButton && themeButton) {
  tools.hidden = false;

  setLargeText(recall("large-text") === "on");

  // start from the saved choice, otherwise from the device setting
  const savedTheme = recall("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  themeButton.setAttribute("aria-pressed", (savedTheme ? savedTheme === "dark" : systemDark) ? "true" : "false");
  if (savedTheme) { setDark(savedTheme === "dark"); }

  textButton.addEventListener("click", function () {
    const on = textButton.getAttribute("aria-pressed") !== "true";
    setLargeText(on);
    remember("large-text", on ? "on" : "off");
  });

  themeButton.addEventListener("click", function () {
    const on = themeButton.getAttribute("aria-pressed") !== "true";
    setDark(on);
    remember("theme", on ? "dark" : "light");
  });
}

// ---------- 1. The gift box ----------
// The first time it opens, it is a surprise. Every time after that,
// the visitor already knows what is inside, so it gets duller.
const gift = document.getElementById("gift");
const boxButton = document.getElementById("box-button");
const boxMessage = document.getElementById("box-message");
const boxHint = document.getElementById("box-hint");

const firstMessage = "Surprise! You did not know what was inside.";

// after the first time, the box is random: sometimes it still feels
// like a surprise (colourful), sometimes it does not (blue)
const blueMessages = [
  "You knew this time. Same box, same stars. Did it still feel like a surprise?",
  "Each time it is a little less surprising. That is the whole story of this page."
];
const colourMessage = "Colourful again! Sometimes a surprise still works, even when you know it is coming.";
let blueCount = 0;

let timesOpened = 0;
let isOpen = false;

if (gift && boxButton) {
  boxButton.hidden = false;

  boxButton.addEventListener("click", function () {
    if (isOpen) {
      gift.classList.remove("is-open");
      boxButton.textContent = "Open it again";
      boxMessage.textContent = "";
      isOpen = false;
      return;
    }

    timesOpened = timesOpened + 1;
    gift.classList.add("is-open");
    if (timesOpened === 1) {
      boxMessage.textContent = firstMessage;
    } else if (Math.random() < 0.5) {
      // blue: it feels expected
      gift.classList.add("is-expected");
      boxMessage.textContent = blueMessages[Math.min(blueCount, blueMessages.length - 1)];
      blueCount = blueCount + 1;
    } else {
      // colourful: still a surprise
      gift.classList.remove("is-expected");
      boxMessage.textContent = colourMessage;
    }
    boxButton.textContent = "Close the box";
    boxHint.textContent = "You opened the box " + timesOpened + (timesOpened === 1 ? " time." : " times.");
    isOpen = true;
  });
}

// ---------- 2. Shuffle the letters ----------
const letters = document.getElementById("letters");
const shuffleButton = document.getElementById("shuffle");
const resetButton = document.getElementById("reset");
const word = "SURPRISE";

// Fisher-Yates shuffle: swaps each letter with a random earlier one
function shuffle(text) {
  const chars = text.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = chars[i];
    chars[i] = chars[j];
    chars[j] = temp;
  }
  return chars.join("");
}

if (letters && shuffleButton && resetButton) {
  shuffleButton.hidden = false;
  resetButton.hidden = false;

  shuffleButton.addEventListener("click", function () {
    let result = shuffle(word);
    // make sure the visitor always sees a change
    while (result === letters.textContent) {
      result = shuffle(word);
    }
    letters.textContent = result;
  });

  resetButton.addEventListener("click", function () {
    letters.textContent = word;
  });
}
