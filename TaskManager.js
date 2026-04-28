let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const filterButtons = document.querySelectorAll(".filters button");

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  const emptyMessage = document.getElementById("emptyMessage");

  // Empty state messages
  if (filteredTasks.length === 0) {
    if (currentFilter === "completed") {
      emptyMessage.innerText = "No tasks completed yet ✅";
    } else if (currentFilter === "pending") {
      emptyMessage.innerText = "No pending tasks 🎉";
    } else {
      emptyMessage.innerText = "No tasks yet 👆";
    }
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  // Render each task
  filteredTasks.forEach(task => {
    let li = document.createElement("li");

    let content = document.createElement("div");

    // Task name
    let span = document.createElement("span");
    span.innerText = task.text;

    // Only show strike-through in ALL tab
    if (currentFilter === "all" && task.completed) {
      span.classList.add("completed");
    }

    // Meta info
    let meta = document.createElement("div");
    meta.classList.add("task-meta");

    let priority = document.createElement("span");
    priority.innerText = task.priority.toUpperCase();
    priority.classList.add(`priority-${task.priority}`);

    let date = document.createElement("span");
    date.innerText = task.dueDate ? ` | 📅 ${task.dueDate}` : "";

    meta.appendChild(priority);
    meta.appendChild(date);

    // ONLY in ALL tab → checkbox
    if (currentFilter === "all") {
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      checkbox.addEventListener("change", () => {
        toggleTask(task.id);
      });

      content.appendChild(checkbox);
    }

    content.appendChild(span);
    content.appendChild(meta);

    li.appendChild(content);

    // ONLY in ALL tab → edit + delete
    if (currentFilter === "all") {
      let actions = document.createElement("div");
      actions.classList.add("actions");

      let editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.onclick = () => editTask(task.id);

      let deleteBtn = document.createElement("button");
      deleteBtn.innerText = "X";
      deleteBtn.onclick = () => deleteTask(task.id);

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(actions);
    }

    taskList.appendChild(li);
  });

  // Task count
  document.getElementById("taskCount").innerText = `${tasks.length} task(s)`;
}

// Add task
function addTask() {
  let text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({
    id: Date.now(),
    text: text,
    completed: false,
    priority: priorityInput.value,
    dueDate: dateInput.value
  });

  taskInput.value = "";
  dateInput.value = "";

  saveTasks();
  renderTasks();
}

// Toggle complete
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

  saveTasks();
  renderTasks();
}

// Edit task
function editTask(id) {
  let task = tasks.find(t => t.id === id);

  let newText = prompt("Edit task:", task.text);

  if (newText && newText.trim() !== "") {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Events
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

// Initial load
renderTasks();