let wakeLock = null;
let countdownInterval = null;
let remainingTime = 0;

const clock = document.getElementById('clock');
const buttons = document.querySelectorAll('[data-minutes]');
const customBtn = document.getElementById('custom');

function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function updateClockUI() {
  clock.textContent = formatTime(remainingTime);
  document.title = `${formatTime(remainingTime)} - Restantes`;
}

function stopCountdown() {
  clearInterval(countdownInterval);
  countdownInterval = null;
  document.title = `Time's up! - No Sleep`;
  clock.textContent = "00:00:00";
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

function startCountdown(seconds) {
  remainingTime = seconds;
  updateClockUI();

  // Ativa o NoSleep
  requestWakeLock();

  countdownInterval = setInterval(() => {
    remainingTime--;
    if (remainingTime <= 0) {
      stopCountdown();
    } else {
      updateClockUI();
    }
  }, 1000);
}

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');

      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock was released');
      });
    }
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

// Botões de tempo fixo
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const minutes = parseInt(button.dataset.minutes);
    if (countdownInterval) clearInterval(countdownInterval);
    startCountdown(minutes * 60);
  });
});

// Botão Customizado
customBtn.addEventListener('click', () => {
  let input = prompt("Digite o tempo em minutos:");
  if (input) {
    const minutes = parseInt(input);
    if (!isNaN(minutes) && minutes > 0) {
      if (countdownInterval) clearInterval(countdownInterval);
      startCountdown(minutes * 60);
    } else {
      alert("Tempo inválido.");
    }
  }
});
