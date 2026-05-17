const boardEl      = document.getElementById('board');
const statusPill   = document.getElementById('statusPill');
const statusText   = document.getElementById('statusText');
const scoreXEl     = document.getElementById('scoreX');
const scoreOEl     = document.getElementById('scoreO');
const scoreDrawsEl = document.getElementById('scoreDraws');
const newGameBtn   = document.getElementById('newGameBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const p1card       = document.getElementById('p1card');
const p2card       = document.getElementById('p2card');
const p2label      = document.getElementById('p2label');
const modeBtns     = document.querySelectorAll('.mode-btn');

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let board    = Array(9).fill('');
let current  = 'X';
let finished = false;
let mode     = 'ai';
let score    = { X: 0, O: 0, D: 0 };

// ── Mode toggle ──
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    mode = btn.dataset.mode;
    modeBtns.forEach(b => b.classList.toggle('mode-btn--active', b === btn));
    p2label.textContent = mode === 'ai' ? 'Computer' : 'Player 2';
    reset();
  });
});

// ── Win check ──
function getResult(state) {
  for (const [a,b,c] of LINES) {
    if (state[a] && state[a] === state[b] && state[a] === state[c])
      return { mark: state[a], line: [a,b,c] };
  }
  return state.every(Boolean) ? { mark: 'D', line: [] } : null;
}

// ── Minimax ──
function minimax(state, isMax, depth = 0) {
  const r = getResult(state);
  if (r) {
    if (r.mark === 'O') return 10 - depth;
    if (r.mark === 'X') return depth - 10;
    return 0;
  }
  const scores = [];
  state.forEach((cell, i) => {
    if (!cell) {
      const copy = [...state];
      copy[i] = isMax ? 'O' : 'X';
      scores.push(minimax(copy, !isMax, depth + 1));
    }
  });
  return isMax ? Math.max(...scores) : Math.min(...scores);
}

function bestMove() {
  let best = -Infinity, move = -1;
  board.forEach((cell, i) => {
    if (!cell) {
      const copy = [...board];
      copy[i] = 'O';
      const s = minimax(copy, false);
      if (s > best) { best = s; move = i; }
    }
  });
  return move;
}

// ── UI helpers ──
function updateStatus(result) {
  statusPill.className = 'status-pill glass';
  if (!result) {
    const sym = current === 'X' ? '✕' : '○';
    const who = current === 'X' ? 'Player 1' : (mode === 'ai' ? 'Computer' : 'Player 2');
    statusText.textContent = `${who}'s turn  ${sym}`;
  } else if (result.mark === 'D') {
    statusText.textContent = "It's a draw! 🤝";
    statusPill.classList.add('draw');
  } else {
    const who = result.mark === 'X' ? 'Player 1' : (mode === 'ai' ? 'Computer' : 'Player 2');
    statusText.textContent = `${who} wins! 🎉`;
    statusPill.classList.add(result.mark === 'X' ? 'win-x' : 'win-o');
  }
}

function updateScoreHighlight() {
  p1card.classList.toggle('active', current === 'X' && !finished);
  p2card.classList.toggle('active', current === 'O' && !finished);
}

// ── Render ──
function render() {
  const result = getResult(board);
  boardEl.innerHTML = '';

  board.forEach((mark, i) => {
    const cell = document.createElement('button');
    cell.className = 'cell';
    if (mark) {
      cell.classList.add(mark.toLowerCase(), 'taken');
      cell.textContent = mark === 'X' ? '✕' : '○';
    }
    if (result && result.line.includes(i)) cell.classList.add('win');
    cell.disabled = finished || Boolean(mark);
    cell.addEventListener('click', () => play(i));
    boardEl.appendChild(cell);
  });

  scoreXEl.textContent     = score.X;
  scoreOEl.textContent     = score.O;
  scoreDrawsEl.textContent = score.D;
  updateStatus(result);
  updateScoreHighlight();
}

// ── Play ──
function play(i) {
  if (finished || board[i]) return;
  board[i] = current;

  const result = getResult(board);
  if (result) {
    finished = true;
    if (result.mark !== 'D') score[result.mark]++;
    else score.D++;
    p1card.classList.remove('active');
    p2card.classList.remove('active');
    render();
    return;
  }

  current = current === 'X' ? 'O' : 'X';
  render();

  if (!finished && mode === 'ai' && current === 'O') {
    // Disable board while AI thinks
    boardEl.querySelectorAll('.cell').forEach(c => c.disabled = true);
    setTimeout(() => { if (!finished) play(bestMove()); }, 400);
  }
}

// ── Reset ──
function reset() {
  board    = Array(9).fill('');
  current  = 'X';
  finished = false;
  render();
}

newGameBtn.addEventListener('click', reset);
resetScoreBtn.addEventListener('click', () => {
  score = { X: 0, O: 0, D: 0 };
  reset();
});

reset();
