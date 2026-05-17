// Inject SVG gradient
document.body.insertAdjacentHTML('afterbegin', `
  <svg class="ring-defs" aria-hidden="true">
    <defs>
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#7c4dff"/>
        <stop offset="100%" stop-color="#00bcd4"/>
      </linearGradient>
    </defs>
  </svg>
`);

const timeHM    = document.getElementById('timeHM');
const timeS     = document.getElementById('timeS');
const timeMS    = document.getElementById('timeMS');
const timeStatus = document.getElementById('timeStatus');
const startBtn  = document.getElementById('startBtn');
const resetBtn  = document.getElementById('resetBtn');
const lapBtn    = document.getElementById('lapBtn');
const lapsList  = document.getElementById('lapsList');
const lapsEmpty = document.getElementById('lapsEmpty');
const lapChip   = document.getElementById('lapChip');
const ringFill  = document.getElementById('ringFill');
const playIcon  = startBtn.querySelector('.fab-icon--play');
const pauseIcon = startBtn.querySelector('.fab-icon--pause');

const CIRCUMFERENCE = 2 * Math.PI * 100; // r=100

let startAt  = 0;
let saved    = 0;
let frame    = null;
let running  = false;
let lapCount = 0;
let lapTimes = [];

function pad(n, len = 2) { return String(n).padStart(len, '0'); }

function formatTime(ms) {
  const h  = Math.floor(ms / 3600000);
  const m  = Math.floor((ms % 3600000) / 60000);
  const s  = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return { hm: `${pad(h)}:${pad(m)}`, s: pad(s), ms: `.${pad(cs)}` };
}

function formatFull(ms) {
  const { hm, s, ms: mss } = formatTime(ms);
  return `${hm}:${s}${mss}`;
}

function currentMs() {
  return running ? saved + Date.now() - startAt : saved;
}

function updateRing(ms) {
  // One full rotation = 60 seconds
  const progress = (ms % 60000) / 60000;
  const offset = CIRCUMFERENCE * (1 - progress);
  ringFill.style.strokeDashoffset = offset;
}

function tick() {
  const ms = currentMs();
  const { hm, s, ms: mss } = formatTime(ms);
  timeHM.textContent = hm;
  timeS.textContent  = s;
  timeMS.textContent = mss;
  updateRing(ms);
  frame = requestAnimationFrame(tick);
}

function setUI() {
  playIcon.style.display  = running ? 'none' : 'block';
  pauseIcon.style.display = running ? 'block' : 'none';
  startBtn.classList.toggle('running', running);
  lapBtn.disabled   = !running;
  resetBtn.disabled = running || (saved === 0 && lapCount === 0);
  timeStatus.textContent = running ? 'Running' : saved > 0 ? 'Paused' : 'Ready';
}

startBtn.addEventListener('click', () => {
  if (!running) {
    startAt = Date.now();
    running = true;
    tick();
  } else {
    saved = currentMs();
    cancelAnimationFrame(frame);
    frame = null;
    running = false;
    const { hm, s, ms } = formatTime(saved);
    timeHM.textContent = hm;
    timeS.textContent  = s;
    timeMS.textContent = ms;
  }
  setUI();
});

resetBtn.addEventListener('click', () => {
  cancelAnimationFrame(frame);
  frame = null;
  running = false;
  saved = 0;
  lapCount = 0;
  lapTimes = [];
  timeHM.textContent = '00:00';
  timeS.textContent  = '00';
  timeMS.textContent = '.00';
  updateRing(0);
  lapsList.innerHTML = '';
  lapsEmpty.hidden   = false;
  lapChip.hidden     = true;
  setUI();
});

lapBtn.addEventListener('click', () => {
  const now  = currentMs();
  lapCount  += 1;
  const prev = lapTimes.length ? lapTimes[lapTimes.length - 1] : 0;
  const diff = now - prev;
  lapTimes.push(now);

  lapsEmpty.hidden = true;
  lapChip.hidden   = false;
  lapChip.textContent = `${lapCount} lap${lapCount !== 1 ? 's' : ''}`;

  const row = document.createElement('div');
  row.className = 'lap-row';
  row.innerHTML = `
    <span class="lap-row__name">Lap ${lapCount}</span>
    <div class="lap-row__right">
      <div class="lap-row__time">${formatFull(now)}</div>
      <div class="lap-row__diff">${lapCount > 1 ? '+' + formatFull(diff) : '—'}</div>
    </div>
  `;
  lapsList.prepend(row);
});

setUI();
