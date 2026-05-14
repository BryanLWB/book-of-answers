const answerBook = document.querySelector("#answerBook");
const controls = document.querySelector("#controls");
const openButton = document.querySelector("#openButton");
const closeButton = document.querySelector("#closeButton");
const themeToggle = document.querySelector("#themeToggle");
const experience = document.querySelector(".experience");
const answerLabel = document.querySelector("#answerLabel");
const answerText = document.querySelector("#answerText");
const pageAnswerText = document.querySelector("#pageAnswerText");
const answerShell = document.querySelector(".answer-shell");
const lightField = document.querySelector("#lightField");
let revealTimer = [];
let isAnimating = false;
let hasOpened = false;
const CLOSED_PROMPT = "闭上眼，把问题放在心里。";
const INTRO_PROMPT = "闭上眼，把问题放在心里，然后打开答案之书";
const PAGE_PROMPT = "Await the whisper";
const answers = Array.isArray(window.answerLibrary) ? window.answerLibrary : [];
const fallbackAnswer = {
  zh: "答案会在更安静的时候出现。",
  en: "The answer will arrive in a quieter moment."
};

function setTheme(theme) {
  document.body.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", theme === "dark" ? "切换到亮色主题" : "切换到暗色主题");
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createHalo(index) {
  const halo = document.createElement("span");
  halo.className = "halo";
  halo.dataset.index = String(index);
  lightField.appendChild(halo);
  return halo;
}

function placeHalo(halo, immediate = false) {
  const size = randomBetween(120, 320);
  const left = randomBetween(-8, 88);
  const top = randomBetween(-4, 84);
  const scale = randomBetween(0.9, 1.25);
  const opacity = randomBetween(0.34, 0.72);
  const pulseDuration = randomBetween(12, 20);

  if (immediate) {
    halo.style.transition = "none";
  }

  halo.style.width = `${size}px`;
  halo.style.height = `${size}px`;
  halo.style.left = `${left}%`;
  halo.style.top = `${top}%`;
  halo.style.opacity = opacity.toFixed(2);
  halo.style.transform = `translate3d(${randomBetween(-16, 16)}px, ${randomBetween(-18, 18)}px, 0) scale(${scale.toFixed(2)})`;
  halo.style.setProperty("--pulse-duration", `${pulseDuration.toFixed(2)}s`);

  if (immediate) {
    requestAnimationFrame(() => {
      halo.style.removeProperty("transition");
    });
  }
}

function initHalos() {
  Array.from({ length: 6 }, (_, index) => createHalo(index)).forEach((halo) => placeHalo(halo, true));
  window.setInterval(() => {
    document.querySelectorAll(".halo").forEach((halo) => placeHalo(halo));
  }, 14600);
}

function clearTimers() {
  revealTimer.forEach((timer) => window.clearTimeout(timer));
  revealTimer = [];
}

function restartFlip() {
  answerBook.classList.remove("flipping");
  void answerBook.offsetWidth;
  answerBook.classList.add("flipping");
}

function pickAnswer() {
  const current = answerText.textContent;
  const pool = answers.filter((item) => item.zh !== current);
  return pool[Math.floor(Math.random() * pool.length)] ?? answers[0] ?? fallbackAnswer;
}

function closeBook() {
  if (isAnimating || !hasOpened) {
    return;
  }

  isAnimating = true;
  clearTimers();
  experience.classList.add("is-closing");
  answerShell.classList.remove("revealed");
  answerBook.classList.remove("flipping", "opening", "opened");
  controls.classList.remove("is-split");
  controls.classList.add("is-merging");

  revealTimer.push(window.setTimeout(() => {
    experience.classList.remove("book-open", "is-closing");
    answerLabel.textContent = "答案尚未显现";
    answerText.textContent = CLOSED_PROMPT;
    pageAnswerText.textContent = PAGE_PROMPT;
    openButton.textContent = "开始解答";
    controls.classList.remove("is-merging");
    hasOpened = false;
    isAnimating = false;
  }, 560));
}

function revealAnswer() {
  if (isAnimating) {
    return;
  }

  isAnimating = true;
  clearTimers();
  answerBook.classList.remove("flipping");

  if (!hasOpened) {
    answerBook.classList.add("opening");
    answerBook.classList.add("opened");
    restartFlip();
    hasOpened = true;
  } else {
    restartFlip();
  }

  revealTimer.push(window.setTimeout(() => {
    experience.classList.remove("is-closing");
    experience.classList.add("book-open");
    answerLabel.textContent = "答案浮现";
    const nextAnswer = pickAnswer();
    answerText.textContent = nextAnswer.zh;
    pageAnswerText.textContent = nextAnswer.en;
    answerShell.classList.add("revealed");
    openButton.textContent = "再问一次";
    controls.classList.remove("is-merging");
    controls.classList.add("is-split");
  }, 980));

  revealTimer.push(window.setTimeout(() => {
    answerBook.classList.remove("opening");
    answerBook.classList.add("opened");
    isAnimating = false;
  }, 1500));
}

openButton.addEventListener("click", revealAnswer);
answerBook.addEventListener("click", revealAnswer);
closeButton.addEventListener("click", closeBook);
themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

setTheme("light");
pageAnswerText.textContent = PAGE_PROMPT;
answerText.textContent = CLOSED_PROMPT;
document.getElementById("introPrompt").textContent = INTRO_PROMPT;
initHalos();
