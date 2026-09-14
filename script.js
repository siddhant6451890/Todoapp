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


/* ================= SIGNUP ================= */

function signup() {
  const username =
    document.getElementById("signupUsername").value.trim();

  const password =
    document.getElementById("signupPassword").value;

  const confirmPassword =
    document.getElementById("confirmPassword").value;

  if (!username || !password || !confirmPassword) {
    alert("Please fill all fields!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const exists = accounts.find(
    account =>
      account.username.toLowerCase() ===
      username.toLowerCase()
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


/* ================= LOGIN ================= */

function login() {

  const username =
    document.getElementById("loginUsername").value.trim();

  const password =
    document.getElementById("loginPassword").value;

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

  currentUser = account.username;

  localStorage.setItem(
    "currentUser",
    currentUser
  );

  openApp();
}


/* ================= LOGOUT ================= */

function logout() {
  currentUser = null;

  localStorage.removeItem("currentUser");

  tasks = [];

  showLogin();
}


/* ================= OPEN APP ================= */

function openApp() {

  const loginPage =
    document.getElementById("loginPage");

  const signupPage =
    document.getElementById("signupPage");

  const appPage =
    document.getElementById("appPage");

  const welcomeUser =
    document.getElementById("welcomeUser");

  if (loginPage) loginPage.style.display = "none";
  if (signupPage) signupPage.style.display = "none";
  if (appPage) appPage.style.display = "block";

  if (welcomeUser) {
    welcomeUser.textContent =
      "Welcome, " + currentUser + "!";
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

  try {

    tasks =
      JSON.parse(
        localStorage.getItem(
          getTaskKey()
        )
      ) || [];

  } catch (error) {

    tasks = [];

  }

}


function saveTasks() {

  if (!currentUser) return;

  try {

    localStorage.setItem(
      getTaskKey(),
      JSON.stringify(tasks)
    );

  } catch (error) {

    alert(
      "Could not save task. Storage may be full."
    );

  }

}


/* ================= ADD TASK ================= */

function addTask() {

  const taskInput =
    document.getElementById("taskInput");

  if (!taskInput) return;

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

  if (!tasks[index]) return;

  tasks[index].completed =
    !tasks[index].completed;

  saveTasks();

  showTasks();

}


/* ================= DELETE ================= */

function deleteTask(index) {

  if (!tasks[index]) return;

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

  if (!tasks[index]) return;

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


/* ================= GALLERY PHOTO ================= */

function addPhoto(index) {

  if (!tasks[index]) return;

  const input =
    document.createElement("input");

  input.type = "file";

  input.accept = "image/*";


  input.onchange =
    function(event) {

      const file =
        event.target.files[0];

      if (!file) return;


      if (
        file.size >
        10 * 1024 * 1024
      ) {

        alert(
          "Photo is too large! Select a photo smaller than 10 MB."
        );

        return;

      }


      saveImageToTask(
        index,
        file
      );

    };


  input.click();

}


/* ================= CAMERA ================= */

function takePhoto(index) {

  if (!tasks[index]) return;

  const input =
    document.createElement("input");

  input.type = "file";

  input.accept = "image/*";

  /* Request camera */

  input.capture = "environment";


  input.onchange =
    function(event) {

      const file =
        event.target.files[0];

      if (!file) return;


      if (
        file.size >
        10 * 1024 * 1024
      ) {

        alert(
          "Photo is too large! Try taking a smaller photo."
        );

        return;

      }


      saveImageToTask(
        index,
        file
      );

    };


  input.click();

}


/* ================= SAVE IMAGE ================= */

function saveImageToTask(
  index,
  file
) {

  const reader =
    new FileReader();


  reader.onload =
    function(event) {

      tasks[index].photo =
        event.target.result;

      saveTasks();

      showTasks();

    };


  reader.onerror =
    function() {

      alert(
        "Could not open this photo!"
      );

    };


  reader.readAsDataURL(file);

}


/* ================= REMOVE PHOTO ================= */

function removePhoto(index) {

  if (!tasks[index]) return;

  tasks[index].photo = "";

  saveTasks();

  showTasks();

}


/* ================= SHARE ================= */

function shareTask(index) {

  if (!tasks[index]) return;

  const task =
    tasks[index];


  const shareText =

    "📋 MY TO-DO TASK\n\n" +

    "Task: " +

    task.text +

    "\n\nStatus: " +

    (
      task.completed
        ? "Completed ✅"
        : "Active ⏳"
    ) +

    "\n\nShared from My To-Do App";


  if (navigator.share) {

    navigator.share({

      title:
        "My To-Do Task",

      text:
        shareText

    })
    .catch(
      function(error) {

        console.log(
          "Share cancelled"
        );

      }
    );

  }

  else {

    copyTaskText(
      shareText
    );

  }

}


/* ================= COPY SHARE TEXT ================= */

function copyTaskText(text) {

  if (
    navigator.clipboard &&
    navigator.clipboard.writeText
  ) {

    navigator.clipboard
      .writeText(text)
      .then(
        function() {

          alert(
            "Task copied! Paste it in any app."
          );

        }
      )
      .catch(
        function() {

          fallbackCopy(text);

        }
      );

  }

  else {

    fallbackCopy(text);

  }

}


function fallbackCopy(text) {

  const textarea =
    document.createElement("textarea");

  textarea.value = text;

  textarea.style.position =
    "fixed";

  textarea.style.opacity =
    "0";

  document.body.appendChild(
    textarea
  );

  textarea.select();

  try {

    document.execCommand(
      "copy"
    );

    alert(
      "Task copied! Paste it anywhere."
    );

  }

  catch (error) {

    alert(
      "Sharing is not supported on this device."
    );

  }

  document.body.removeChild(
    textarea
  );

}


/* ================= FILTER ================= */

function setFilter(filter) {

  currentFilter =
    filter;

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

  const counter =
    document.getElementById(
      "counter"
    );


  if (!taskList) return;


  taskList.innerHTML = "";


  const searchText =
    searchInput
      ? searchInput.value
          .toLowerCase()
      : "";


  const completed =
    tasks.filter(
      task =>
        task.completed
    ).length;


  if (counter) {

    counter.textContent =

      "Total: " +

      tasks.length +

      " | Done: " +

      completed;

  }


  tasks.forEach(
    function(task, index) {


      /* SEARCH */

      if (
        !task.text
          .toLowerCase()
          .includes(searchText)
      ) {

        return;

      }


      /* ACTIVE FILTER */

      if (
        currentFilter === "ACTIVE" &&
        task.completed
      ) {

        return;

      }


      /* DONE FILTER */

      if (
        currentFilter === "DONE" &&
        !task.completed
      ) {

        return;

      }


      /* TASK */

      const taskDiv =
        document.createElement(
          "div"
        );


      taskDiv.className =

        task.completed
          ? "task done"
          : "task";


      /* CONTENT */

      const taskContent =
        document.createElement(
          "div"
        );


      taskContent.className =
        "task-content";


      /* PHOTO */

      if (task.photo) {

        const image =
          document.createElement(
            "img"
          );


        image.src =
          task.photo;


        image.className =
          "task-photo";


        image.alt =
          "Task Photo";


        taskContent.appendChild(
          image
        );

      }


      /* TEXT */

      const taskText =
        document.createElement(
          "div"
        );


      taskText.className =
        "task-text";


      taskText.textContent =
        task.text;


      taskContent.appendChild(
        taskText
      );


      /* BUTTONS */

      const buttons =
        document.createElement(
          "div"
        );


      buttons.className =
        "task-buttons";


      /* EDIT */

      const editButton =
        document.createElement(
          "button"
        );


      editButton.className =
        "edit";


      editButton.textContent =
        "EDIT";


      editButton.onclick =
        function() {

          editTask(index);

        };


      /* PHOTO */

      const photoButton =
        document.createElement(
          "button"
        );


      photoButton.className =
        "photo";


      photoButton.textContent =
        "📷 PHOTO";


      photoButton.onclick =
        function() {

          addPhoto(index);

        };


      /* CAMERA */

      const cameraButton =
        document.createElement(
          "button"
        );


      cameraButton.className =
        "camera";


      cameraButton.textContent =
        "📸 CAMERA";


      cameraButton.onclick =
        function() {

          takePhoto(index);

        };


      /* SHARE */

      const shareButton =
        document.createElement(
          "button"
        );


      shareButton.className =
        "share";


      shareButton.textContent =
        "📤 SHARE";


      shareButton.onclick =
        function() {

          shareTask(index);

        };


      /* DONE */

      const doneButton =
        document.createElement(
          "button"
        );


      doneButton.className =
        "done";


      doneButton.textContent =

        task.completed
          ? "UNDO"
          : "DONE";


      doneButton.onclick =
        function() {

          toggleDone(index);

        };


      /* DELETE */

      const deleteButton =
        document.createElement(
          "button"
        );


      deleteButton.className =
        "delete";


      deleteButton.textContent =
        "DELETE";


      deleteButton.onclick =
        function() {

          deleteTask(index);

        };


      /* ADD BUTTONS */

      buttons.appendChild(
        editButton
      );

      buttons.appendChild(
        photoButton
      );

      buttons.appendChild(
        cameraButton
      );

      buttons.appendChild(
        shareButton
      );

      buttons.appendChild(
        doneButton
      );

      buttons.appendChild(
        deleteButton
      );


      taskDiv.appendChild(
        taskContent
      );

      taskDiv.appendChild(
        buttons
      );


      taskList.appendChild(
        taskDiv
      );

    }
  );

}


/* ================= INTERNET STATUS ================= */

function updateInternetStatus() {

  const status =
    document.getElementById(
      "internetStatus"
    );


  if (!status) return;


  if (navigator.onLine) {

    status.textContent =
      "🟢 Online - Internet Connected";


    status.className =
      "internet-status online";

  }

  else {

    status.textContent =
      "🔴 Offline - No Internet Connection";


    status.className =
      "internet-status offline";

  }

}


window.addEventListener(
  "online",
  updateInternetStatus
);


window.addEventListener(
  "offline",
  updateInternetStatus
);


/* ================= STOPWATCH ================= */

let stopwatchSeconds = 0;

let stopwatchInterval = null;


function updateStopwatch() {

  const stopwatch =
    document.getElementById(
      "stopwatch"
    );


  if (!stopwatch) return;


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


  stopwatch.textContent =

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
  ) return;


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


  stopwatchInterval =
    null;

}


function resetStopwatch() {

  stopStopwatch();


  stopwatchSeconds = 0;


  updateStopwatch();

}


/* ================= ABOUT ================= */

function openAbout() {

  const aboutPage =
    document.getElementById(
      "aboutPage"
    );


  if (aboutPage) {

    aboutPage.style.display =
      "block";

  }

}


function closeAbout() {

  const aboutPage =
    document.getElementById(
      "aboutPage"
    );


  if (aboutPage) {

    aboutPage.style.display =
      "none";

  }

}


/* ================= START APP ================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {


    const searchInput =
      document.getElementById(
        "searchInput"
      );


    if (searchInput) {

      searchInput.addEventListener(
        "input",
        showTasks
      );

    }


    const taskInput =
      document.getElementById(
        "taskInput"
      );


    if (taskInput) {

      taskInput.addEventListener(
        "keypress",
        function(event) {

          if (
            event.key === "Enter"
          ) {

            addTask();

          }

        }
      );

    }


    updateStopwatch();

    updateInternetStatus();


    if (currentUser) {

      openApp();

    }

    else {

      showLogin();

    }

  }
);
