const timeMainEl = document.querySelector('.time-main');
const timeMsEl = document.querySelector('.time-ms');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const lapsEl = document.getElementById('laps');
const emptyEl = document.getElementById('empty');
const lapCountEl = document.getElementById('lapCount');

let startAt = 0;
let saved = 0;
let frame = null;
let lapNumber = 0;
let lapTimes = [];
let running = false;

function pad(n, len = 2) { return String(n).padStart(len, '0'); }

function format(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return {
    main: `${pad(h)}:${pad(m)}:${pad(s)}`,
    ms: `.${pad(cs)}`
  };
}

function currentMs() {
  return running ? saved + Date.now() - startAt : saved;
}

function tick() {
  const { main, ms } = format(currentMs());
  timeMainEl.textContent = main;
  timeMsEl.textContent = ms;
  frame = requestAnimationFrame(tick);
}

function updateButtons() {
  lapBtn.disabled = !running;
  resetBtn.disabled = running || (saved === 0 && lapNumber === 0);
  if (running) {
    startBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause`;
    startBtn.classList.add('paused');
  } else {
    startBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> ${saved > 0 ? 'Resume' : 'Start'}`;
    startBtn.classList.remove('paused');
  }
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
    const { main, ms } = format(saved);
    timeMainEl.textContent = main;
    timeMsEl.textContent = ms;
  }
  updateButtons();
});

resetBtn.addEventListener('click', () => {
  if (frame) cancelAnimationFrame(frame);
  frame = null;
  running = false;
  saved = 0;
  lapNumber = 0;
  lapTimes = [];
  timeMainEl.textContent = '00:00:00';
  timeMsEl.textContent = '.00';
  lapsEl.innerHTML = '';
  emptyEl.hidden = false;
  lapCountEl.hidden = true;
  updateButtons();
});

lapBtn.addEventListener('click', () => {
  const now = currentMs();
  lapNumber += 1;
  const prev = lapTimes.length > 0 ? lapTimes[lapTimes.length - 1] : 0;
  const diff = now - prev;
  lapTimes.push(now);

  emptyEl.hidden = true;
  lapCountEl.hidden = false;
  lapCountEl.textContent = `${lapNumber} Lap${lapNumber !== 1 ? 's' : ''}`;

  const item = document.createElement('div');
  item.className = 'lap-item';

  const { main: lapMain, ms: lapMs } = format(now);
  const { main: diffMain, ms: diffMs } = format(diff);

  item.innerHTML = `
    <span class="lap-name">Lap ${lapNumber}</span>
    <div class="lap-times">
      <div class="lap-time">${lapMain}${lapMs}</div>
      ${lapNumber > 1 ? `<div class="lap-diff">+${diffMain}${diffMs}</div>` : '<div class="lap-diff">--</div>'}
    </div>
  `;
  lapsEl.prepend(item);
});

updateButtons();
