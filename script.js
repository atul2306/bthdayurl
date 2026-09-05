const beginButton = document.querySelector('#beginButton');
const replayButton = document.querySelector('#replayButton');
const note = document.querySelector('#note');
const lockScreen = document.querySelector('#lockScreen');
const lockTimer = document.querySelector('#lockTimer');
const surpriseToast = document.querySelector('#surpriseToast');
const balloonField = document.querySelector('#balloonField');
const songButton = document.querySelector('#songButton');
const songPlayer = document.querySelector('#songPlayer');
let songReady = false;

songPlayer.addEventListener('load', () => {
  songReady = true;
});
let hasUnlocked = false;

songButton.addEventListener('click', () => {
  const isPlaying = songButton.getAttribute('aria-pressed') !== 'true';
  const command = isPlaying ? 'playVideo' : 'pauseVideo';
  if (isPlaying && !songReady) {
    songPlayer.src = 'https://www.youtube.com/embed/Jhg9jRwl81Q?enablejsapi=1&playsinline=1&rel=0&autoplay=1';
  }
  const sendCommand = () => songPlayer.contentWindow.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), '*');
  sendCommand();
  if (isPlaying) setTimeout(sendCommand, 900);
  songButton.setAttribute('aria-pressed', String(isPlaying));
  songButton.innerHTML = isPlaying ? '<span class="song-icon">&#10074;&#10074;</span> Pause our song' : '<span class="song-icon">&#9835;</span> Play our song';
});

function celebrate() {
  for (let index = 0; index < 28; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.setProperty('--x', `${(Math.random() - 0.5) * 90}vw`);
    piece.style.setProperty('--y', `${(Math.random() * 70 + 25) * -1}vh`);
    piece.style.background = ['#df745d', '#f2b297', '#c8d5c6', '#e6c65d'][index % 4];
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1500);
  }
}

document.body.classList.add('locked');

// Midnight is fixed to India time so the reveal is consistent for both of you.
const birthdayReveal = new Date('2026-09-05T18:07:40+05:30');
function updateLockTimer() {
  const remaining = birthdayReveal - new Date();
  if (remaining <= 0) {
    if (!hasUnlocked) {
      hasUnlocked = true;
      document.body.classList.remove('locked');
      lockScreen.classList.add('unlocked');
      balloonField.classList.add('celebrate');
      celebrate();
    }
    return;
  }
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  lockTimer.textContent = [days, hours, minutes, seconds].map((unit) => String(unit).padStart(2, '0')).join(' : ');
}
updateLockTimer();
setInterval(updateLockTimer, 1000);

document.querySelectorAll('.balloon').forEach((balloon) => {
  balloon.addEventListener('click', () => {
    surpriseToast.textContent = balloon.dataset.message;
    surpriseToast.classList.add('show');
    celebrate();
    balloon.style.animation = 'pop .45s ease forwards';
    setTimeout(() => surpriseToast.classList.remove('show'), 2600);
    setTimeout(() => balloon.remove(), 450);
  });
});

document.querySelectorAll('.surprise-card').forEach((card) => {
  card.addEventListener('click', () => {
    surpriseToast.textContent = card.dataset.message;
    surpriseToast.classList.add('show');
    card.classList.add('opened');
    setTimeout(() => surpriseToast.classList.remove('show'), 3200);
  });
});

function showNote() {
  note.scrollIntoView({ behavior: 'smooth' });
}

beginButton.addEventListener('click', showNote);
replayButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));
