const form = document.getElementById("taskForm");
const titleInput = document.getElementById("taskTitle");
const listInput = document.getElementById("taskList");
const dateInput = document.getElementById("taskDate");
const submitBtn = document.getElementById("submitBtn");
const view = document.getElementById("taskListView");
const empty = document.getElementById("empty");
const summary = document.getElementById("summary");
const heading = document.getElementById("heading");
const filters = [...document.querySelectorAll(".filter")];

let tasks = JSON.parse(localStorage.getItem("sct_wd_04_tasks") || "[]");
let activeFilter = "all";
let editingId = null;

function save() {
  localStorage.setItem("sct_wd_04_tasks", JSON.stringify(tasks));
}

function formatDate(value) {
  if (!value) return "No date set";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function getVisibleTasks() {
  if (activeFilter === "active") return tasks.filter(task => !task.done);
  if (activeFilter === "completed") return tasks.filter(task => task.done);
  return tasks;
}

function resetForm() {
  editingId = null;
  form.reset();
  submitBtn.textContent = "Add Task";
}

function render() {
  const visible = getVisibleTasks();
  view.innerHTML = "";
  heading.textContent = activeFilter === "all" ? "All Tasks" : activeFilter === "active" ? "Active Tasks" : "Completed Tasks";
  summary.textContent = `${tasks.length} tasks`;
  empty.hidden = visible.length > 0;

  visible.forEach(task => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";
    li.innerHTML = `
      <input class="check" type="checkbox" ${task.done ? "checked" : ""}>
      <div>
        <div class="title"></div>
        <div class="meta">${task.list} | ${formatDate(task.date)}</div>
      </div>
      <div class="actions">
        <button class="small edit" type="button">Edit</button>
        <button class="small delete" type="button">Delete</button>
      </div>
    `;
    li.querySelector(".title").textContent = task.title;
    li.querySelector(".check").addEventListener("change", () => {
      task.done = !task.done;
      save();
      render();
    });
    li.querySelector(".edit").addEventListener("click", () => {
      editingId = task.id;
      titleInput.value = task.title;
      listInput.value = task.list;
      dateInput.value = task.date;
      submitBtn.textContent = "Save Task";
      titleInput.focus();
    });
    li.querySelector(".delete").addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      if (editingId === task.id) resetForm();
      save();
      render();
    });
    view.appendChild(li);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;

  if (editingId) {
    const task = tasks.find(item => item.id === editingId);
    if (task) {
      task.title = title;
      task.list = listInput.value;
      task.date = dateInput.value;
    }
  } else {
    tasks.push({
      id: window.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title,
      list: listInput.value,
      date: dateInput.value,
      done: false
    });
  }

  resetForm();
  save();
  render();
});

filters.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach(item => item.classList.toggle("active", item === button));
    render();
  });
});

render();
