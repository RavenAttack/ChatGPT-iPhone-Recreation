const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");
const screenElement = document.getElementById("screen");
const setupFlow = document.getElementById("setupFlow");
const home = document.getElementById("home");
const nextSetupBtn = document.getElementById("nextSetup");
const finishSetupBtn = document.getElementById("finishSetup");
const setupCards = [...document.querySelectorAll(".setup-card")];
const toast = document.getElementById("toast");
const modeToggle = document.getElementById("modeToggle");
const restartSetup = document.getElementById("restartSetup");

let currentSetupStep = 0;
let pressTimer;
let toastTimer;

const appMessages = {
  facetime: "FaceTime ready. Start your first call.",
  mail: "Mail opened. Inbox is currently empty.",
  music: "Apple Music trial started.",
  maps: "Maps: Home saved as Cupertino.",
  safari: "Safari opened start page.",
  photos: "Photos: 0 items synced.",
  health: "Health permissions pending setup.",
  notes: "New note created: 'My new iPhone'.",
  phone: "Phone app: No SIM alerts.",
  messages: "Messages ready with iMessage.",
  camera: "Camera launched in Photo mode.",
  settings: "Settings opened. Tap and hold screen for edit mode.",
};

function updateClock() {
  const now = new Date();
  timeElement.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (dateElement) {
    dateElement.textContent = now.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderSetupStep() {
  setupCards.forEach((card, index) => {
    card.classList.toggle("active", index === currentSetupStep);
  });

  nextSetupBtn.disabled = currentSetupStep >= setupCards.length - 1;
  finishSetupBtn.disabled = currentSetupStep < setupCards.length - 1;
}

function finishSetup() {
  setupFlow.hidden = true;
  home.hidden = false;
  showToast("Setup complete. Welcome to your new iPhone.");
}

nextSetupBtn.addEventListener("click", () => {
  if (currentSetupStep < setupCards.length - 1) {
    currentSetupStep += 1;
    renderSetupStep();
  }
});

finishSetupBtn.addEventListener("click", finishSetup);

restartSetup.addEventListener("click", () => {
  currentSetupStep = 0;
  renderSetupStep();
  setupFlow.hidden = false;
  home.hidden = true;
  screenElement.classList.remove("edit-mode");
  showToast("Setup restarted.");
});

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("ipad-mode");
  const ipadOn = document.body.classList.contains("ipad-mode");
  modeToggle.textContent = ipadOn ? "Switch to iPhone mode" : "Switch to iPad mode";
  showToast(ipadOn ? "iPad mode enabled." : "iPhone mode enabled.");
});

window.addEventListener("resize", () => {
  const shouldUseIpad = window.matchMedia("(orientation: landscape)").matches;
  document.body.classList.toggle("ipad-mode", shouldUseIpad);
  modeToggle.textContent = shouldUseIpad ? "Switch to iPhone mode" : "Switch to iPad mode";
});

screenElement.addEventListener("pointerdown", () => {
  if (home.hidden) return;
  pressTimer = setTimeout(() => {
    screenElement.classList.toggle("edit-mode");
    showToast(screenElement.classList.contains("edit-mode") ? "Edit mode on" : "Edit mode off");
  }, 650);
});

["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => {
  screenElement.addEventListener(eventName, () => clearTimeout(pressTimer));
});

[...document.querySelectorAll(".app, .dock-app")].forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.app || button.dataset.action;
    const message = appMessages[key] || "App opened.";
    showToast(message);
  });
});

updateClock();
renderSetupStep();
setInterval(updateClock, 1000);
window.dispatchEvent(new Event("resize"));
