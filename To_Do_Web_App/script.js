// ── State ──
let tasks      = JSON.parse(localStorage.getItem('m3_tasks') || '[]');
let filter     = 'all';
let editingId  = null;
let priority   = 'medium';

// ── Elements ──
const greeting    = document.getElementById('greeting');
const subtext     = document.getElementById('subtext');
const taskList    = document.getElementById('taskList');
const emptyState  = document.getElementById('emptyState');
const addFab      = document.getElementById('addFab');
const backdrop    = document.getElementById('backdrop');
const bottomSheet = document.getElementById('bottomSheet');
const sheetTitle  = document.getElementById('sheetTitle');
const taskInput   = document.getElementById('taskInput');
const taskNote    = document.getElementById('taskNote');
const saveBtn     = document.getElementById('saveBtn');
const cancelBtn   = document.getElementById('cancelBtn');
const chips       = document.querySelectorAll('.chip');
const priorityBtns = document.querySelectorAll('.priority-btn');

// ── Greeting ──
function updateGreeting() {
  const h = new Date().getHours();
  greeting.textContent = h < 12 ? 'Good Morning 🌅' : h < 17 ? 'Good Afternoon ☀️' : 'Good Evening 🌙';
  const active = tasks.filter(t => !t.done).length;
  subtext.textContent = active === 0
    ? 'All caught up! 🎉'
    : `You have ${active} task${active !== 1 ? 's' : ''} remaining`;
}

// ── Save ──
function save() {
  localStorage.setItem('m3_tasks', JSON.stringify(tasks));
}

// ── Render ──
function render() {
  updateGreeting();
  taskList.innerHTML = '';

  const visible = tasks.filter(t => {
    if (filter === 'active')    return !t.done;
    if (filter === 'completed') return t.done;
    return true;
  });

  emptyState.hidden = visible.length > 0;

  visible.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card' + (task.done ? ' done' : '');
    card.dataset.id = task.id;

    card.innerHTML = `
      <div class="task-check ${task.done ? 'checked' : ''}" role="checkbox" aria-checked="${task.done}" tabindex="0"></div>
      <div class="task-content">
        <div class="task-title ${task.done ? 'done' : ''}">${escHtml(task.title)}</div>
        ${task.note ? `<div class="task-note">${escHtml(task.note)}</div>` : ''}
        <div class="task-meta">
          <div class="priority-dot priority-dot--${task.priority}"></div>
          <span class="priority-label">${task.priority}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="task-action task-action--edit" aria-label="Edit task">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="task-action task-action--delete" aria-label="Delete task">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        </button>
      </div>
    `;

    // Toggle done
    const check = card.querySelector('.task-check');
    const toggle = () => {
      task.done = !task.done;
      save();
      render();
    };
    check.addEventListener('click', toggle);
    check.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); } });

    // Edit
    card.querySelector('.task-action--edit').addEventListener('click', e => {
      e.stopPropagation();
      openSheet(task);
    });

    // Delete
    card.querySelector('.task-action--delete').addEventListener('click', e => {
      e.stopPropagation();
      card.style.transform = 'scale(0.95)';
      card.style.opacity = '0';
      card.style.transition = 'all 0.2s';
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== task.id);
        save();
        render();
      }, 200);
    });

    taskList.appendChild(card);
  });
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Sheet ──
function openSheet(task = null) {
  editingId = task ? task.id : null;
  sheetTitle.textContent = task ? 'Edit Task' : 'New Task';
  saveBtn.textContent    = task ? 'Save Changes' : 'Add Task';
  taskInput.value = task ? task.title : '';
  taskNote.value  = task ? (task.note || '') : '';
  setPriority(task ? task.priority : 'medium');
  backdrop.classList.add('open');
  bottomSheet.classList.add('open');
  setTimeout(() => taskInput.focus(), 350);
}

function closeSheet() {
  backdrop.classList.remove('open');
  bottomSheet.classList.remove('open');
  editingId = null;
}

function setPriority(p) {
  priority = p;
  priorityBtns.forEach(btn => {
    btn.classList.toggle('priority-btn--active', btn.dataset.p === p);
  });
}

priorityBtns.forEach(btn => btn.addEventListener('click', () => setPriority(btn.dataset.p)));
addFab.addEventListener('click', () => openSheet());
cancelBtn.addEventListener('click', closeSheet);
backdrop.addEventListener('click', closeSheet);

saveBtn.addEventListener('click', () => {
  const title = taskInput.value.trim();
  if (!title) { taskInput.focus(); return; }

  if (editingId) {
    const t = tasks.find(t => t.id === editingId);
    if (t) { t.title = title; t.note = taskNote.value.trim(); t.priority = priority; }
  } else {
    tasks.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title,
      note: taskNote.value.trim(),
      priority,
      done: false,
      createdAt: Date.now()
    });
  }
  save();
  closeSheet();
  render();
});

// Enter to save
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveBtn.click(); });

// ── Filter chips ──
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    filter = chip.dataset.filter;
    chips.forEach(c => {
      c.classList.toggle('chip--active', c === chip);
      c.setAttribute('aria-selected', c === chip);
    });
    render();
  });
});

render();
