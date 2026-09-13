let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "ALL";

const taskInput = document.getElementById("taskInput");
const searchInput = document.getElementById("searchInput");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    alert("Please enter a task!");
    return;
  }

  tasks.push({
    text: text,
    completed: false,
    photo: ""
  });

  taskInput.value = "";
  saveTasks();
  showTasks();
}

function toggleDone(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  showTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  showTasks();
}

function editTask(index) {
  const text = prompt("Edit task:", tasks[index].text);

  if (text && text.trim()) {
    tasks[index].text = text.trim();
    saveTasks();
    showTasks();
  }
}

function addPhoto(index) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {
      tasks[index].photo = event.target.result;
      saveTasks();
      showTasks();
    };

    reader.readAsDataURL(file);
  };

  input.click();
}

function setFilter(filter) {
  currentFilter = filter;
  showTasks();
}

function showTasks() {
  taskList.innerHTML = "";

  const search = searchInput.value.toLowerCase();

  let doneCount = tasks.filter(
    task => task.completed
  ).length;

  counter.textContent =
    "Total: " + tasks.length +
    " | Done: " + doneCount;

  tasks.forEach(function(task, index) {

    if (!task.text.toLowerCase().includes(search)) return;

    if (currentFilter === "ACTIVE" && task.completed) return;

    if (currentFilter === "DONE" && !task.completed) return;

    const div = document.createElement("div");

    div.className =
      task.completed ? "task done" : "task";

    let photo = "";

    if (task.photo) {
      photo =
        '<img src="' + task.photo +
        '" class="task-photo">';
    }

    div.innerHTML =
      photo +
      '<div class="task-text">' +
      task.text +
      '</div>' +

      '<div class="task-buttons">' +

      '<button class="edit" onclick="editTask(' + index + ')">EDIT</button>' +

      '<button class="photo" onclick="addPhoto(' + index + ')">📷 PHOTO</button>' +

      '<button class="done" onclick="toggleDone(' + index + ')">' +
      (task.completed ? "UNDO" : "DONE") +
      '</button>' +

      '<button class="delete" onclick="deleteTask(' + index + ')">DELETE</button>' +

      '</div>';

    taskList.appendChild(div);
  });
}

/* SEARCH */
searchInput.addEventListener("input", showTasks);

/* ENTER */
taskInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    addTask();
  }
});

/* CLOCK */
function updateClock() {
  const now = new Date();

  const clock = document.getElementById("clock");
  const date = document.getElementById("date");

  if (clock) {
    clock.innerText = now.toLocaleTimeString();
  }

  if (date) {
    date.innerText = now.toDateString();
  }
}

updateClock();
setInterval(updateClock, 1000);

/* START */
showTasks();
