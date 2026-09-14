/* ================= ACCOUNTS ================= */

let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
let currentUser = localStorage.getItem("currentUser");
let tasks = [];
let currentFilter = "ALL";


/* ================= ACCOUNTS ================= */

function saveAccounts() {
  localStorage.setItem("accounts", JSON.stringify(accounts));
}

function showLogin() {
  document.getElementById("loginPage").style.display = "flex";
  document.getElementById("signupPage").style.display = "none";
  document.getElementById("appPage").style.display = "none";
}

function showSignup() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("signupPage").style.display = "flex";
}


/* ================= SIGNUP ================= */

function signup() {
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!username || !password || !confirmPassword) {
    alert("Please fill all fields!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const exists = accounts.find(
    account => account.username.toLowerCase() === username.toLowerCase()
  );

  if (exists) {
    alert("Username already exists!");
    return;
  }

  accounts.push({ username, password });
  saveAccounts();

  alert("Account created successfully!");
  showLogin();
}


/* ================= LOGIN ================= */

function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  const account = accounts.find(
    account =>
      account.username === username &&
      account.password === password
  );

  if (!account) {
    alert("Invalid username or password!");
    return;
  }

  currentUser = username;
  localStorage.setItem("currentUser", username);

  openApp();
}


function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  tasks = [];
  showLogin();
}


/* ================= OPEN APP ================= */

function openApp() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("signupPage").style.display = "none";
  document.getElementById("appPage").style.display = "block";

  const welcome = document.getElementById("welcomeUser");

  if (welcome) {
    welcome.textContent = "Welcome, " + currentUser + "!";
  }

  loadTasks();
  showTasks();
}


/* ================= TASK STORAGE ================= */

function getTaskKey() {
  return "tasks_" + currentUser;
}

function loadTasks() {
  if (!currentUser) {
    tasks = [];
    return;
  }

  try {
    tasks = JSON.parse(localStorage.getItem(getTaskKey())) || [];
  } catch (error) {
    tasks = [];
  }
}

function saveTasks() {
  if (!currentUser) return;

  try {
    localStorage.setItem(getTaskKey(), JSON.stringify(tasks));
  } catch (error) {
    alert("Storage is full. Please use a smaller photo.");
  }
}


/* ================= ADD TASK ================= */

function addTask() {
  const input = document.getElementById("taskInput");

  if (!input) return;

  const text = input.value.trim();

  if (!text) {
    alert("Please enter a task!");
    return;
  }

  tasks.push({
    text: text,
    completed: false,
    photo: ""
  });

  input.value = "";

  saveTasks();
  showTasks();
}


/* ================= TASK ACTIONS ================= */

function toggleDone(index) {
  if (!tasks[index]) return;

  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  showTasks();
}

function deleteTask(index) {
  if (!tasks[index]) return;

  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    showTasks();
  }
}

function editTask(index) {
  if (!tasks[index]) return;

  const text = prompt("Edit your task:", tasks[index].text);

  if (text && text.trim()) {
    tasks[index].text = text.trim();
    saveTasks();
    showTasks();
  }
}


/* ================= GALLERY ================= */

function addPhoto(index) {
  const input = document.createElement("input");

  input.type = "file";
  input.accept = "image/*";

  input.onchange = function() {
    const file = input.files[0];

    if (!file) return;

    saveImage(index, file);
  };

  input.click();
}


/* ================= CAMERA ================= */

function takePhoto(index) {
  const input = document.createElement("input");

  input.type = "file";
  input.accept = "image/*";
  input.setAttribute("capture", "environment");

  input.onchange = function() {
    const file = input.files[0];

    if (!file) return;

    saveImage(index, file);
  };

  input.click();
}


/* ================= SAVE IMAGE ================= */

function saveImage(index, file) {

  if (file.size > 10 * 1024 * 1024) {
    alert("Photo must be smaller than 10 MB!");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    tasks[index].photo = event.target.result;

    saveTasks();
    showTasks();
  };

  reader.onerror = function() {
    alert("Could not load photo!");
  };

  reader.readAsDataURL(file);
}


/* ================= SHARE ================= */

async function shareTask(index) {

  if (!tasks[index]) return;

  const task = tasks[index];

  const text =
    "📋 MY TO-DO TASK\n\n" +
    "Task: " + task.text +
    "\n\nStatus: " +
    (task.completed ? "Completed ✅" : "Active ⏳") +
    "\n\nShared from My To-Do App";

  try {

    if (navigator.share) {

      await navigator.share({
        title: "My To-Do Task",
        text: text
      });

    } else {

      const textarea = document.createElement("textarea");

      textarea.value = text;

      document.body.appendChild(textarea);

      textarea.select();

      document.execCommand("copy");

      document.body.removeChild(textarea);

      alert("Task copied! Now paste it in WhatsApp or another app.");

    }

  } catch (error) {
    console.log("Share cancelled");
  }
}


/* ================= FILTER ================= */

function setFilter(filter) {
  currentFilter = filter;
  showTasks();
}


/* ================= SHOW TASKS ================= */

function showTasks() {

  const taskList = document.getElementById("taskList");
  const searchInput = document.getElementById("searchInput");
  const counter = document.getElementById("counter");

  if (!taskList) return;

  taskList.innerHTML = "";

  const searchText =
    searchInput ? searchInput.value.toLowerCase() : "";

  const completed =
    tasks.filter(task => task.completed).length;

  if (counter) {
    counter.textContent =
      "Total: " + tasks.length +
      " | Done: " + completed;
  }


  tasks.forEach(function(task, index) {

    if (!task.text.toLowerCase().includes(searchText)) return;

    if (currentFilter === "ACTIVE" && task.completed) return;

    if (currentFilter === "DONE" && !task.completed) return;


    const taskDiv = document.createElement("div");

    taskDiv.className =
      task.completed ? "task done" : "task";


    /* CONTENT */

    const content = document.createElement("div");

    content.className = "task-content";


    if (task.photo) {

      const image = document.createElement("img");

      image.src = task.photo;

      image.className = "task-photo";

      content.appendChild(image);

    }


    const taskText = document.createElement("div");

    taskText.className = "task-text";

    taskText.textContent = task.text;

    content.appendChild(taskText);


    /* BUTTON AREA */

    const buttons = document.createElement("div");

    buttons.className = "task-buttons";


    function createButton(text, className, action) {

      const button = document.createElement("button");

      button.textContent = text;

      button.className = className;

      button.onclick = action;

      return button;
    }


    /* ALL BUTTONS */

    buttons.appendChild(
      createButton(
        "✏️ EDIT",
        "edit",
        function() {
          editTask(index);
        }
      )
    );


    buttons.appendChild(
      createButton(
        "📷 PHOTO",
        "photo",
        function() {
          addPhoto(index);
        }
      )
    );


    /* CAMERA WILL ALWAYS BE CREATED */

    buttons.appendChild(
      createButton(
        "📸 CAMERA",
        "camera",
        function() {
          takePhoto(index);
        }
      )
    );


    /* SHARE WILL ALWAYS BE CREATED */

    buttons.appendChild(
      createButton(
        "📤 SHARE",
        "share",
        function() {
          shareTask(index);
        }
      )
    );


    buttons.appendChild(
      createButton(
        task.completed ? "↩️ UNDO" : "✅ DONE",
        "done",
        function() {
          toggleDone(index);
        }
      )
    );


    buttons.appendChild(
      createButton(
        "🗑️ DELETE",
        "delete",
        function() {
          deleteTask(index);
        }
      )
    );


    taskDiv.appendChild(content);

    taskDiv.appendChild(buttons);

    taskList.appendChild(taskDiv);

  });
}


/* ================= STOPWATCH ================= */

let stopwatchSeconds = 0;
let stopwatchInterval = null;

function updateStopwatch() {

  const stopwatch = document.getElementById("stopwatch");

  if (!stopwatch) return;

  const hours = Math.floor(stopwatchSeconds / 3600);

  const minutes = Math.floor(
    (stopwatchSeconds % 3600) / 60
  );

  const seconds = stopwatchSeconds % 60;

  stopwatch.textContent =
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}

function startStopwatch() {

  if (stopwatchInterval) return;

  stopwatchInterval = setInterval(function() {

    stopwatchSeconds++;

    updateStopwatch();

  }, 1000);
}

function stopStopwatch() {

  clearInterval(stopwatchInterval);

  stopwatchInterval = null;
}

function resetStopwatch() {

  stopStopwatch();

  stopwatchSeconds = 0;

  updateStopwatch();
}


/* ================= START ================= */

document.addEventListener("DOMContentLoaded", function() {

  const searchInput =
    document.getElementById("searchInput");

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      showTasks
    );

  }


  const taskInput =
    document.getElementById("taskInput");

  if (taskInput) {

    taskInput.addEventListener(
      "keypress",
      function(event) {

        if (event.key === "Enter") {
          addTask();
        }

      }
    );

  }


  updateStopwatch();


  if (currentUser) {

    openApp();

  } else {

    showLogin();

  }

});
