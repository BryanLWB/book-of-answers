const answerBook = document.querySelector("#answerBook");
const openButton = document.querySelector("#openButton");
const closeButton = document.querySelector("#closeButton");
const themeToggle = document.querySelector("#themeToggle");
const answerLabel = document.querySelector("#answerLabel");
const answerText = document.querySelector("#answerText");
const pageAnswerText = document.querySelector("#pageAnswerText");
const answerShell = document.querySelector(".answer-shell");
const lightField = document.querySelector("#lightField");
let revealTimer = [];
let isAnimating = false;
let hasOpened = false;
const CLOSED_PROMPT = "闭上眼，把问题放在心里。";
const PAGE_PROMPT = "Await the whisper";
const baseAnswersEn = [
  "Trust your first instinct",
  "Wait a little longer",
  "Take the next small step",
  "Ask a clearer question",
  "Let this unfold slowly",
  "Choose the gentler path",
  "Keep your plans flexible",
  "Follow the simplest option",
  "Say yes with care",
  "Say no without guilt",
  "Look again tomorrow",
  "Make room for surprise",
  "Hold your ground quietly",
  "Invite help",
  "Leave the door open",
  "Turn back once more",
  "Start with what you know",
  "Protect your energy",
  "Trust the timing",
  "Lead with honesty",
  "Stay with the question",
  "Walk away for now",
  "Choose courage over comfort",
  "Rest before deciding",
  "Keep this private",
  "Speak plainly",
  "Notice what repeats",
  "Wait for a sign",
  "Finish what you began",
  "Accept the delay",
  "Return to your original plan",
  "Try the quieter route",
  "Do less, not more",
  "Make the call",
  "Hold off a little",
  "Follow the brighter option",
  "Let someone else lead",
  "Change the pace",
  "Ask for the truth",
  "Trust what feels light",
  "Release what feels forced",
  "Keep going gently",
  "Stop before you overreach",
  "Choose patience",
  "Take the invitation",
  "Listen before acting",
  "Reconsider the details",
  "Take the longer view",
  "Let your answer ripen",
  "Begin where you are"
];
const baseAnswersZh = [
  "相信你的第一直觉",
  "再等一等",
  "先迈出下一小步",
  "把问题问得更清楚",
  "让这件事慢慢展开",
  "选择更温和的路",
  "让计划保持弹性",
  "遵从最简单的方案",
  "谨慎地答应",
  "坦然地拒绝",
  "明天再看一次",
  "给惊喜留一点位置",
  "安静地站稳立场",
  "接受帮助",
  "把门留一条缝",
  "再回头看一次",
  "从你已知的开始",
  "保护你的能量",
  "相信时机",
  "以诚实带路",
  "继续守着这个问题",
  "暂时走开",
  "选择勇气而不是安逸",
  "决定前先休息",
  "把这件事留给自己",
  "把话说得简单些",
  "留意重复出现的东西",
  "等一个信号",
  "完成你已经开始的事",
  "接受这次延迟",
  "回到最初的计划",
  "试试更安静的路径",
  "少做一点，不必更多",
  "去打那个电话",
  "再缓一缓",
  "跟着更明亮的选择走",
  "让别人先带路",
  "换一个节奏",
  "去问真正的答案",
  "相信让你轻松的感觉",
  "放下那些太用力的部分",
  "继续温柔地前进",
  "在越界前停下",
  "选择耐心",
  "接受这次邀请",
  "先听，再行动",
  "重新考虑细节",
  "把目光放长远",
  "让答案慢慢成熟",
  "从你所在之处开始"
];
const answerEndingsEn = [
  ".",
  " for now.",
  " and stay patient.",
  " before asking for more.",
  " when your mind is quiet.",
  " and let the rest unfold.",
  " without forcing it.",
  " if it still feels right.",
  " and trust the result.",
  " with a calm heart."
];
const answerEndingsZh = [
  "。",
  " 先这样。",
  " 并保持耐心。",
  " 在索取更多之前先停一停。",
  " 等心安静下来再说。",
  " 其余的会自己展开。",
  " 不要太勉强。",
  " 如果它依然让你觉得对。",
  " 然后相信结果。",
  " 带着平静的心。"
];
const answers = baseAnswersEn.flatMap((baseEn, index) =>
  answerEndingsEn.map((endingEn, endingIndex) => ({
    en: `${baseEn}${endingEn}`,
    zh: `${baseAnswersZh[index]}${answerEndingsZh[endingIndex]}`
  }))
);

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
  return pool[Math.floor(Math.random() * pool.length)] ?? answers[0];
}

function closeBook() {
  if (isAnimating || !hasOpened) {
    return;
  }

  isAnimating = true;
  clearTimers();
  answerBook.classList.remove("flipping", "opening", "opened");
  closeButton.hidden = true;
  openButton.textContent = "开始解答";

  revealTimer.push(window.setTimeout(() => {
    answerLabel.textContent = "答案尚未显现";
    answerText.textContent = CLOSED_PROMPT;
    pageAnswerText.textContent = PAGE_PROMPT;
    answerShell.classList.remove("revealed");
    hasOpened = false;
    isAnimating = false;
  }, 1100));
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
    answerLabel.textContent = "答案浮现";
    const nextAnswer = pickAnswer();
    answerText.textContent = nextAnswer.zh;
    pageAnswerText.textContent = nextAnswer.en;
    answerShell.classList.add("revealed");
    openButton.textContent = "再问一次";
    closeButton.hidden = false;
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
initHalos();
