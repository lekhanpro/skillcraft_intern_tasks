const form = document.getElementById('taskForm');
const titleInput = document.getElementById('taskTitle');
const taskListEl = document.getElementById('taskList');
const completedListEl = document.getElementById('completedList');
const completedSection = document.getElementById('completedSection');
const greetingText = document.getElementById('greetingText');
const greetingSub = document.getElementById('greetingSub');
const taskCountText = document.getElementById('taskCountText');

let tasks = JSON.parse(localStorage.getItem('lumina_tasks') || '[]');

function save() {
  localStorage.setItem('lumina_tasks', JSON.stringify(tasks));
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function updateGreeting() {
  greetingText.textContent = getGreeting();
  const active = tasks.filter(t => !t.done).length;
  taskCountText.textContent = `${active} task${active !== 1 ? 's' : ''}`;
}

function createCheckbox(done) {
  const box = document.createElement('div');
  box.className = 'task-checkbox' + (done ? ' checked' : '');
  box.setAttribute('role', 'checkbox');
  box.setAttribute('aria-checked', done ? 'true' : 'false');
  box.setAttribute('tabindex', '0');
  return box;
}

function renderTask(task, container) {
  const item = document.createElement('div');
  item.className = 'task-item';
  item.dataset.id = task.id;

  const checkbox = createCheckbox(task.done);

  const textEl = document.createElement('span');
  textEl.className = 'task-text' + (task.done ? ' done' : '');
  textEl.textContent = task.title;

  // Toggle done
  const toggleDone = () => {
    task.done = !task.done;
    save();
    render();
  };
  checkbox.addEventListener('click', toggleDone);
  checkbox.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleDone(); } });

  // Actions
  const actions = document.createElement('div');
  actions.className = 'task-actions';

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.className = 'task-action-btn edit';
  editBtn.setAttribute('aria-label', 'Edit task');
  editBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
  editBtn.addEventListener('click', () => startEdit(task, item, textEl));

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'task-action-btn delete';
  delBtn.setAttribute('aria-label', 'Delete task');
  delBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;
  delBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => t.id !== task.id);
    save();
    render();
  });

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  item.appendChild(checkbox);
  item.appendChild(textEl);
  if (!task.done && task.priority) {
    const badge = document.createElement('span');
    badge.className = 'task-priority';
    badge.textContent = task.priority;
    item.appendChild(badge);
  }
  item.appendChild(actions);
  container.appendChild(item);
}

function startEdit(task, item, textEl) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-edit-input';
  input.value = task.title;
  item.replaceChild(input, textEl);
  input.focus();

  const finish = () => {
    const val = input.value.trim();
    if (val) task.title = val;
    save();
    render();
  };

  input.addEventListener('blur', finish);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); finish(); }
    if (e.key === 'Escape') render();
  });
}

function render() {
  taskListEl.innerHTML = '';
  completedListEl.innerHTML = '';

  const active = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  active.forEach(t => renderTask(t, taskListEl));
  done.forEach(t => renderTask(t, completedListEl));

  completedSection.hidden = done.length === 0;
  updateGreeting();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  tasks.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title,
    done: false,
    priority: null
  });
  titleInput.value = '';
  save();
  render();
});

render();
