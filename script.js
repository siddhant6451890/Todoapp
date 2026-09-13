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

  if (text === "") {
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
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);

    saveTasks();
    showTasks();
  }
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


/* PHOTO */

function addPhoto(index) {

  const input = document.createElement("input");

  input.type = "file";
  input.accept = "image/*";

  input.onchange = function(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

      tasks[index].photo = e.target.result;

      saveTasks();
      showTasks();
    };

    reader.readAsDataURL(file);
  };

  input.click();
}


/* FILTER */

function setFilter(filter) {
  currentFilter = filter;
  showTasks();
}


/* SHOW TASKS */

function showTasks() {

  taskList.innerHTML = "";

  const searchText =
    searchInput.value.toLowerCase();

  const total = tasks.length;

  const completed = tasks.filter(
    task => task.completed
  ).length;

  counter.textContent =
    `Total: ${total} | Done: ${completed}`;


  tasks.forEach((task, index) => {

    if (
      !task.text
        .toLowerCase()
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


    let photoHTML = "";


    if (task.photo) {

      photoHTML = `
        <img
          src="${task.photo}"
          class="task-photo"
          alt="Task photo"
        >
      `;
    }


    taskDiv.innerHTML = `

      <div class="task-content">

        ${photoHTML}

        <div class="task-text">

          ${task.completed
            ? "DONE - "
            : "• "
          }

          ${task.text}

        </div>

      </div>


      <div class="task-buttons">

        <button
          class="edit"
          onclick="editTask(${index})"
        >
          EDIT
        </button>


        <button
          class="photo"
          onclick="addPhoto(${index})"
        >
          📷 PHOTO
        </button>


        <button
          class="done"
          onclick="toggleDone(${index})"
        >
          ${task.completed
            ? "UNDO"
            : "DONE"
          }
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


/* SEARCH */

searchInput.addEventListener(
  "input",
  showTasks
);


/* ENTER KEY */

taskInput.addEventListener(
  "keypress",
  function(event) {

    if (event.key === "Enter") {
      addTask();
    }

  }
);


/* START */

showTasks();
