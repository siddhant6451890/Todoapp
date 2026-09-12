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

  if (text === "") return;

  tasks.push({
    text: text,
    completed: false
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
  const newText = prompt(
    "Edit your task:",
    tasks[index].text
  );

  if (newText && newText.trim() !== "") {
    tasks[index].text = newText.trim();

    saveTasks();
    showTasks();
  }
}

function setFilter(filter) {
  currentFilter = filter;
  showTasks();
}

function showTasks() {

  taskList.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();

  const total = tasks.length;

  const completed = tasks.filter(
    task => task.completed
  ).length;

  counter.textContent =
    `Total: ${total} | Done: ${completed}`;

  tasks.forEach((task, index) => {

    if (
      !task.text.toLowerCase()
        .includes(searchText)
    ) {
      return;
    }

    if (
      currentFilter === "ACTIVE" &&
      task.completed
    ) {
      return;
    }

    if (
      currentFilter === "DONE" &&
      !task.completed
    ) {
      return;
    }

    const taskDiv =
      document.createElement("div");

    taskDiv.className =
      task.completed
        ? "task done"
        : "task";

    taskDiv.innerHTML = `
      <div class="task-text">
        ${task.completed ? "DONE - " : "• "}
        ${task.text}
      </div>

      <div class="task-buttons">

        <button
          class="edit"
          onclick="editTask(${index})"
        >
          EDIT
        </button>

        <button
          class="done"
          onclick="toggleDone(${index})"
        >
          ${task.completed ? "UNDO" : "DONE"}
        </button>

        <button
          class="delete"
          onclick="deleteTask(${index})"
        >
          DELETE
        </button>

      </div>
    `;

    taskList.appendChild(taskDiv);
  });
}

searchInput.addEventListener(
  "input",
  showTasks
);

taskInput.addEventListener(
  "keypress",
  function(event) {
    if (event.key === "Enter") {
      addTask();
    }
  }
);

showTasks();
