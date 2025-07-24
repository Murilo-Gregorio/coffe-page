let countdownInterval = null;
let remainingTime = 0;

const clock = document.getElementById("clock");
const buttons = document.querySelectorAll("[data-minutes]");
const resetButton = document.getElementById("reset");

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function updateClock() {
  clock.textContent = formatTime(remainingTime);
  document.title = `${formatTime(remainingTime)} - Restantes`;
}

function startCountdown() {
  if (countdownInterval) return;

  countdownInterval = setInterval(() => {
    remainingTime--;
    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      remainingTime = 0;
    }
    updateClock();
  }, 1000);
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const addedMinutes = parseInt(button.dataset.minutes);
    remainingTime += addedMinutes * 60;
    updateClock();
    startCountdown();
  });
});

resetButton.addEventListener("click", () => {
  clearInterval(countdownInterval);
  countdownInterval = null;
  remainingTime = 0;
  updateClock();
});

updateClock(); // inicia com 00:00:00
