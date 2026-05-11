const boardEl       = document.getElementById('board');
const turnIndicator = document.getElementById('turnIndicator');
const scoreXEl      = document.getElementById('scoreX');
const scoreOEl      = document.getElementById('scoreO');
const newGameBtn    = document.getElementById('newGame');
const p1col         = document.getElementById('p1col');
const p2col         = document.getElementById('p2col');
const p2label       = document.getElementById('p2label');
const modeBtns      = document.querySelectorAll('.mode-btn');

const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let board    = Array(9).fill('');
let current  = 'X';
let finished = false;
let mode     = 'computer'; // 'computer' | 'human'
let score    = { X: 0, O: 0 };

// ── Mode toggle ──
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    mode = btn.dataset.mode;
    modeBtns.forEach(b => b.classList.toggle('mode-btn--active', b === btn));
    p2label.textContent = mode === 'computer' ? 'COMPUTER' : 'PLAYER 2';
    reset();
  });
});

// ── Win detection ──
function getResult(state) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return { mark: state[a], line };
    }
  }
  return state.every(Boolean) ? { mark: 'D', line: [] } : null;
}

// ── Minimax AI ──
function minimax(state, isMax) {
  const result = getResult(state);
  if (result) {
    if (result.mark === 'O') return 10;
    if (result.mark === 'X') return -10;
    return 0;
  }
  const scores = [];
  state.forEach((cell, i) => {
    if (!cell) {
      const copy = [...state];
      copy[i] = isMax ? 'O' : 'X';
      scores.push(minimax(copy, !isMax));
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
      const score = minimax(copy, false);
      if (score > best) { best = score; move = i; }
    }
  });
  return move;
}

// ── Turn UI ──
function updateTurnUI() {
  const cls    = current === 'X' ? 'x-mark' : 'o-mark';
  const symbol = current === 'X' ? '✕' : '○';
  turnIndicator.innerHTML = `It's <span class="turn-mark ${cls}">${symbol}</span> turn`;
  p1col.classList.toggle('active', current === 'X');
  p2col.classList.toggle('active', current === 'O');
}

// ── Render board ──
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

  scoreXEl.textContent = score.X;
  scoreOEl.textContent = score.O;
}

// ── Play a move ──
function play(index) {
  if (finished || board[index]) return;
  board[index] = current;

  const result = getResult(board);
  if (result) {
    finished = true;
    if (result.mark !== 'D') score[result.mark]++;
    const who = result.mark === 'X'
      ? 'Player 1 wins!'
      : (mode === 'computer' ? 'Computer wins!' : 'Player 2 wins!');
    turnIndicator.innerHTML = `<span class="win-message">${result.mark === 'D' ? "It's a draw!" : who}</span>`;
    p1col.classList.remove('active');
    p2col.classList.remove('active');
    render();
    return;
  }

  current = current === 'X' ? 'O' : 'X';
  updateTurnUI();
  render();

  // Computer plays O
  if (!finished && mode === 'computer' && current === 'O') {
    boardEl.querySelectorAll('.cell').forEach(c => c.disabled = true);
    setTimeout(() => {
      play(bestMove());
    }, 350);
  }
}

// ── Reset ──
function reset() {
  board    = Array(9).fill('');
  current  = 'X';
  finished = false;
  updateTurnUI();
  render();
}

newGameBtn.addEventListener('click', reset);
reset();
