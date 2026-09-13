

/* ================= ACCOUNTS ================= */

let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
let currentUser = localStorage.getItem("currentUser");

function saveAccounts() {
  localStorage.setItem("accounts", JSON.stringify(accounts));
}


/* ================= LOGIN / SIGNUP ================= */

function showLogin() {
  const loginPage = document.getElementById("loginPage");
  const signupPage = document.getElementById("signupPage");
  const appPage = document.getElementById("appPage");

  if (loginPage) loginPage.style.display = "flex";
  if (signupPage) signupPage.style.display = "none";
  if (appPage) appPage.style.display = "none";
}

function showSignup() {
  const loginPage = document.getElementById("loginPage");
  const signupPage = document.getElementById("signupPage");

  if (loginPage) loginPage.style.display = "none";
  if (signupPage) signupPage.style.display = "flex";
}

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

  accounts.push({
    username: username,
    password: password
  });

  saveAccounts();

  alert("Account created successfully!");

  document.getElementById("signupUsername").value = "";
  document.getElementById("signupPassword").value = "";
  document.getElementById("confirmPassword").value = "";

  showLogin();
}

function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!username || !password) {
    alert("Please enter username and password!");
    return;
  }

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

  showLogin();
}


/* ================= OPEN APP ================= */

function openApp() {
  const loginPage = document.getElementById("loginPage");
  const signupPage = document.getElementById("signupPage");
  const appPage = document.getElementById("appPage");
  const welcomeUser = document.getElementById("welcomeUser");

  if (loginPage) loginPage.style.display = "none";
  if (signupPage) signupPage.style.display = "none";
  if (appPage) appPage.style.display = "block";

  if (welcomeUser) {
    welcomeUser.textContent = "Welcome, " + currentUser + "!";
  }

  loadTasks();
  showTasks();
  updateInternetStatus();
}


/* ================= TASKS ================= */

let tasks = [];
let currentFilter = "ALL";

function getTaskKey() {
  return "tasks_" + currentUser;
}

function loadTasks() {
  if (!currentUser) {
    tasks = [];
    return;
  }

  tasks = JSON.parse(
    localStorage.getItem(getTaskKey())
  ) || [];
}

function saveTasks() {
  if (!currentUser) return;

  localStorage.setItem(
    getTaskKey(),
    JSON.stringify(tasks)
  );
}


/* ================= ADD TASK ================= */

function addTask() {
  const taskInput = document.getElementById("taskInput");

  if (!taskInput) return;

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


/* ================= TASK BUTTONS ================= */

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

  const newText = prompt(
    "Edit your task:",
    tasks[index].text
  );

  if (newText && newText.trim()) {
    tasks[index].text = newText.trim();

    saveTasks();
    showTasks();
  }
}


/* ================= PHOTO UPLOAD ================= */

function addPhoto(index) {
  if (!tasks[index]) return;

  const input = document.createElement("input");

  input.type = "file";
  input.accept = "image/*";

  input.onchange = function(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Photo is too large! Select a photo smaller than 10 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
      tasks[index].photo = e.target.result;

      try {
        saveTasks();
        showTasks();
      } catch (error) {
        alert("Photo could not be saved. Try a smaller photo.");
      }
    };

    reader.onerror = function() {
      alert("Could not open this photo!");
    };

    reader.readAsDataURL(file);
  };

  input.click();
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

  const searchText = searchInput
    ? searchInput.value.toLowerCase()
    : "";

  const completed = tasks.filter(
    task => task.completed
  ).length;

  if (counter) {
    counter.textContent =
      "Total: " + tasks.length +
      " | Done: " + completed;
  }

  tasks.forEach(function(task, index) {

    if (!task.text.toLowerCase().includes(searchText)) {
      return;
    }

    if (currentFilter === "ACTIVE" && task.completed) {
      return;
    }

    if (currentFilter === "DONE" && !task.completed) {
      return;
    }

    const taskDiv = document.createElement("div");

    taskDiv.className =
      task.completed ? "task done" : "task";


    const taskContent = document.createElement("div");
    taskContent.className = "task-content";


    /* PHOTO */

    if (task.photo) {
      const image = document.createElement("img");

      image.src = task.photo;
      image.className = "task-photo";
      image.alt = "Task Photo";

      taskContent.appendChild(image);
    }


    /* TEXT */

    const taskText = document.createElement("div");

    taskText.className = "task-text";
    taskText.textContent = task.text;

    taskContent.appendChild(taskText);


    /* BUTTON AREA */

    const buttons = document.createElement("div");

    buttons.className = "task-buttons";


    const editButton = document.createElement("button");

    editButton.className = "edit";
    editButton.textContent = "EDIT";

    editButton.onclick = function() {
      editTask(index);
    };


    const photoButton = document.createElement("button");

    photoButton.className = "photo";
    photoButton.textContent = "📷 PHOTO";

    photoButton.onclick = function() {
      addPhoto(index);
    };


    const doneButton = document.createElement("button");

    doneButton.className = "done";

    doneButton.textContent =
      task.completed ? "UNDO" : "DONE";

    doneButton.onclick = function() {
      toggleDone(index);
    };


    const deleteButton = document.createElement("button");

    deleteButton.className = "delete";
    deleteButton.textContent = "DELETE";

    deleteButton.onclick = function() {
      deleteTask(index);
    };


    buttons.appendChild(editButton);
    buttons.appendChild(photoButton);
    buttons.appendChild(doneButton);
    buttons.appendChild(deleteButton);


    taskDiv.appendChild(taskContent);
    taskDiv.appendChild(buttons);

    taskList.appendChild(taskDiv);
  });
}


/* ================= INTERNET STATUS ================= */

function updateInternetStatus() {
  const status = document.getElementById("internetStatus");

  if (!status) return;

  if (navigator.onLine) {
    status.textContent = "🟢 Online - Internet Connected";
    status.className = "internet-status online";
  } else {
    status.textContent = "🔴 Offline - No Internet Connection";
    status.className = "internet-status offline";
  }
}

window.addEventListener("online", updateInternetStatus);

window.addEventListener("offline", updateInternetStatus);


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
  if (stopwatchInterval !== null) return;

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


/* ================= ABOUT ================= */

function openAbout() {
  const aboutPage = document.getElementById("aboutPage");

  if (aboutPage) {
    aboutPage.style.display = "block";
  }
}

function closeAbout() {
  const aboutPage = document.getElementById("aboutPage");

  if (aboutPage) {
    aboutPage.style.display = "none";
  }
}


/* ================= START APP ================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

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

    /* CHECK INTERNET */
    updateInternetStatus();


    if (currentUser) {
      openApp();
    } else {
      showLogin();
    }

  }
);
