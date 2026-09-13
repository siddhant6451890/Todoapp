/* ================= ACCOUNTS ================= */

let accounts =
  JSON.parse(localStorage.getItem("accounts")) || [];

let currentUser =
  localStorage.getItem("currentUser");


function saveAccounts() {

  localStorage.setItem(
    "accounts",
    JSON.stringify(accounts)
  );
}


/* ================= SHOW LOGIN ================= */

function showLogin() {

  document.getElementById(
    "loginPage"
  ).style.display = "flex";

  document.getElementById(
    "signupPage"
  ).style.display = "none";

  document.getElementById(
    "appPage"
  ).style.display = "none";
}


/* ================= SHOW SIGNUP ================= */

function showSignup() {

  document.getElementById(
    "loginPage"
  ).style.display = "none";

  document.getElementById(
    "signupPage"
  ).style.display = "flex";
}


/* ================= SIGNUP ================= */

function signup() {

  const username =
    document
      .getElementById("signupUsername")
      .value
      .trim();

  const password =
    document
      .getElementById("signupPassword")
      .value;

  const confirmPassword =
    document
      .getElementById("confirmPassword")
      .value;


  if (!username || !password || !confirmPassword) {

    alert("Please fill all fields!");

    return;
  }


  if (password !== confirmPassword) {

    alert("Passwords do not match!");

    return;
  }


  const exists =
    accounts.find(
      account =>
        account.username === username
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


  alert(
    "Account created successfully!"
  );


  document
    .getElementById("signupUsername")
    .value = "";

  document
    .getElementById("signupPassword")
    .value = "";

  document
    .getElementById("confirmPassword")
    .value = "";


  showLogin();
}


/* ================= LOGIN ================= */

function login() {

  const username =
    document
      .getElementById("loginUsername")
      .value
      .trim();

  const password =
    document
      .getElementById("loginPassword")
      .value;


  if (!username || !password) {

    alert("Please enter username and password!");

    return;
  }


  const account =
    accounts.find(
      account =>

        account.username === username &&

        account.password === password
    );


  if (!account) {

    alert(
      "Invalid username or password!"
    );

    return;
  }


  currentUser = username;


  localStorage.setItem(
    "currentUser",
    username
  );


  openApp();
}


/* ================= LOGOUT ================= */

function logout() {

  currentUser = null;


  localStorage.removeItem(
    "currentUser"
  );


  showLogin();
}


/* ================= OPEN APP ================= */

function openApp() {

  document.getElementById(
    "loginPage"
  ).style.display = "none";


  document.getElementById(
    "signupPage"
  ).style.display = "none";


  document.getElementById(
    "appPage"
  ).style.display = "block";


  document.getElementById(
    "welcomeUser"
  ).textContent =
    "Welcome, " + currentUser + "!";


  loadTasks();

  showTasks();
}


/* ================= TASKS ================= */

let tasks = [];

let currentFilter = "ALL";


function getTaskKey() {

  return "tasks_" + currentUser;
}


function loadTasks() {

  tasks =
    JSON.parse(
      localStorage.getItem(
        getTaskKey()
      )
    ) || [];
}


function saveTasks() {

  localStorage.setItem(
    getTaskKey(),
    JSON.stringify(tasks)
  );
}


/* ================= ADD TASK ================= */

function addTask() {

  const taskInput =
    document.getElementById(
      "taskInput"
    );


  const text =
    taskInput.value.trim();


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


/* ================= DONE ================= */

function toggleDone(index) {

  tasks[index].completed =
    !tasks[index].completed;


  saveTasks();

  showTasks();
}


/* ================= DELETE ================= */

function deleteTask(index) {

  if (
    confirm("Delete this task?")
  ) {

    tasks.splice(index, 1);

    saveTasks();

    showTasks();

  }
}


/* ================= EDIT ================= */

function editTask(index) {

  const newText =
    prompt(
      "Edit your task:",
      tasks[index].text
    );


  if (
    newText &&
    newText.trim()
  ) {

    tasks[index].text =
      newText.trim();


    saveTasks();

    showTasks();

  }
}


/* ================= PHOTO ================= */

function addPhoto(index) {

  const input =
    document.createElement("input");


  input.type = "file";

  input.accept = "image/*";


  input.onchange =
    function(event) {

      const file =
        event.target.files[0];


      if (!file) return;


      const reader =
        new FileReader();


      reader.onload =
        function(e) {

          tasks[index].photo =
            e.target.result;


          saveTasks();

          showTasks();

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

  const taskList =
    document.getElementById(
      "taskList"
    );


  const searchInput =
    document.getElementById(
      "searchInput"
    );


  taskList.innerHTML = "";


  const searchText =
    searchInput.value.toLowerCase();


  const completed =
    tasks.filter(
      task => task.completed
    ).length;


  document.getElementById(
    "counter"
  ).textContent =
    "Total: " +
    tasks.length +
    " | Done: " +
    completed;


  tasks.forEach(
    function(task, index) {


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

        photoHTML =
          '<img src="' +
          task.photo +
          '" class="task-photo">';

      }


      taskDiv.innerHTML =

        '<div class="task-content">' +

        photoHTML +

        '<div class="task-text">' +

        task.text +

        '</div>' +

        '</div>' +


        '<div class="task-buttons">' +


        '<button class="edit" onclick="editTask(' +
        index +
        ')">EDIT</button>' +


        '<button class="photo" onclick="addPhoto(' +
        index +
        ')">📷 PHOTO</button>' +


        '<button class="done" onclick="toggleDone(' +
        index +
        ')">' +

        (
          task.completed
            ? "UNDO"
            : "DONE"
        ) +

        '</button>' +


        '<button class="delete" onclick="deleteTask(' +
        index +
        ')">DELETE</button>' +


        '</div>';


      taskList.appendChild(taskDiv);

    }
  );
}


/* ================= SEARCH ================= */

document
  .getElementById("searchInput")
  .addEventListener(
    "input",
    showTasks
  );


/* ================= ENTER KEY ================= */

document
  .getElementById("taskInput")
  .addEventListener(
    "keypress",
    function(event) {

      if (
        event.key === "Enter"
      ) {

        addTask();

      }

    }
  );


/* ================= STOPWATCH ================= */

let stopwatchSeconds = 0;

let stopwatchInterval = null;


function updateStopwatch() {

  const hours =
    Math.floor(
      stopwatchSeconds / 3600
    );


  const minutes =
    Math.floor(
      (
        stopwatchSeconds % 3600
      ) / 60
    );


  const seconds =
    stopwatchSeconds % 60;


  document.getElementById(
    "stopwatch"
  ).textContent =

    String(hours)
      .padStart(2, "0") +

    ":" +

    String(minutes)
      .padStart(2, "0") +

    ":" +

    String(seconds)
      .padStart(2, "0");
}


function startStopwatch() {

  if (
    stopwatchInterval !== null
  ) {

    return;

  }


  stopwatchInterval =
    setInterval(
      function() {

        stopwatchSeconds++;

        updateStopwatch();

      },
      1000
    );
}


function stopStopwatch() {

  clearInterval(
    stopwatchInterval
  );


  stopwatchInterval = null;
}


function resetStopwatch() {

  stopStopwatch();


  stopwatchSeconds = 0;


  updateStopwatch();
}


/* ================= ABOUT ================= */

function openAbout() {

  document.getElementById(
    "aboutPage"
  ).style.display = "block";
}


function closeAbout() {

  document.getElementById(
    "aboutPage"
  ).style.display = "none";
}


/* ================= START APP ================= */

updateStopwatch();


if (currentUser) {

  openApp();

} else {

  showLogin();

}
