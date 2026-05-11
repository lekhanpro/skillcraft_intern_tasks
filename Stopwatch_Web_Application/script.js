const timeEl = document.getElementById("time");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");
const lapsEl = document.getElementById("laps");
const emptyEl = document.getElementById("empty");

let startAt = 0;
let saved = 0;
let frame = null;
let lapNumber = 0;

function format(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const milli = Math.floor(ms % 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(milli).padStart(3, "0")}`;
}

function currentTime() {
  return frame ? saved + Date.now() - startAt : saved;
}

function render() {
  timeEl.textContent = format(currentTime());
  frame = requestAnimationFrame(render);
}

function setButtons(running) {
  startBtn.disabled = running;
  pauseBtn.disabled = !running;
  lapBtn.disabled = !running;
  resetBtn.disabled = running ? false : saved === 0 && lapNumber === 0;
}

startBtn.addEventListener("click", () => {
  startAt = Date.now();
  setButtons(true);
  render();
});

pauseBtn.addEventListener("click", () => {
  saved = currentTime();
  cancelAnimationFrame(frame);
  frame = null;
  timeEl.textContent = format(saved);
  setButtons(false);
});

resetBtn.addEventListener("click", () => {
  if (frame) cancelAnimationFrame(frame);
  frame = null;
  saved = 0;
  lapNumber = 0;
  timeEl.textContent = "00:00:00.000";
  lapsEl.innerHTML = "";
  emptyEl.hidden = false;
  setButtons(false);
});

lapBtn.addEventListener("click", () => {
  lapNumber += 1;
  emptyEl.hidden = true;
  const li = document.createElement("li");
  li.innerHTML = `<span>Lap ${lapNumber}</span><strong>${format(currentTime())}</strong>`;
  lapsEl.prepend(li);
});
