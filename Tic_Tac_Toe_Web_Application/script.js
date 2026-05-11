const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const modeEl = document.getElementById("mode");
const scoreEl = document.getElementById("score");
const newGameBtn = document.getElementById("newGame");

const lines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill("");
let current = "X";
let finished = false;
let score = { X: 0, O: 0, D: 0 };

function getResult(state) {
  for (const line of lines) {
    const [a, b, c] = line;
    if (state[a] && state[a] === state[b] && state[a] === state[c]) return { mark: state[a], line };
  }
  return state.every(Boolean) ? { mark: "D", line: [] } : null;
}

function render() {
  const result = getResult(board);
  boardEl.innerHTML = "";
  board.forEach((mark, index) => {
    const cell = document.createElement("button");
    cell.className = `cell ${mark.toLowerCase()}`;
    if (result && result.line.includes(index)) cell.classList.add("win");
    cell.textContent = mark;
    cell.disabled = finished || Boolean(mark);
    cell.addEventListener("click", () => play(index));
    boardEl.appendChild(cell);
  });
  scoreEl.textContent = `X: ${score.X} | O: ${score.O} | Draws: ${score.D}`;
}

function play(index) {
  if (finished || board[index]) return;
  board[index] = current;
  const result = getResult(board);
  if (result) {
    finished = true;
    score[result.mark] += 1;
    statusEl.textContent = result.mark === "D" ? "Game draw" : `Player ${result.mark} wins`;
    render();
    return;
  }
  current = current === "X" ? "O" : "X";
  statusEl.textContent = `Player ${current} turn`;
  render();
  if (modeEl.value === "computer" && current === "O") setTimeout(computerPlay, 250);
}

function bestMove() {
  const open = board.map((mark, index) => mark ? null : index).filter(index => index !== null);
  for (const mark of ["O", "X"]) {
    for (const index of open) {
      const copy = [...board];
      copy[index] = mark;
      const result = getResult(copy);
      if (result && result.mark === mark) return index;
    }
  }
  if (open.includes(4)) return 4;
  return open.find(index => [0, 2, 6, 8].includes(index)) ?? open[0];
}

function computerPlay() {
  if (!finished) play(bestMove());
}

function reset() {
  board = Array(9).fill("");
  current = "X";
  finished = false;
  statusEl.textContent = "Player X turn";
  render();
}

newGameBtn.addEventListener("click", reset);
modeEl.addEventListener("change", reset);
render();
