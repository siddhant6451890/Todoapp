<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>My To-Do App</title>

  <link rel="stylesheet" href="style.css">
</head>

<body>

  <div class="container">

    <h1>MY TO-DO APP</h1>

    <div id="counter">
      Total: 0 | Done: 0
    </div>

    <input
      type="text"
      id="searchInput"
      placeholder="Search tasks..."
    >

    <div class="add-task">
      <input
        type="text"
        id="taskInput"
        placeholder="Enter new task..."
      >

      <button onclick="addTask()">
        ADD TASK
      </button>
    </div>

    <div class="filters">

      <button onclick="setFilter('ALL')">
        ALL
      </button>

      <button onclick="setFilter('ACTIVE')">
        ACTIVE
      </button>

      <button onclick="setFilter('DONE')">
        DONE
      </button>

    </div>

    <div id="taskList"></div>

  </div>

  <script src="script.js"></script>

</body>
</html>
