const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");
const phoneElement = document.querySelector(".iphone");

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  timeElement.textContent = time;
  dateElement.textContent = date;
}

updateClock();
setInterval(updateClock, 1000);

let pressTimer;

phoneElement.addEventListener("pointerdown", () => {
  pressTimer = setTimeout(() => {
    phoneElement.classList.toggle("edit-mode");
  }, 650);
});

["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => {
  phoneElement.addEventListener(eventName, () => clearTimeout(pressTimer));
});
