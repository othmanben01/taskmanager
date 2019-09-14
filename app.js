var base = {
  form: document.querySelector("#task-form"),
  taskList: document.querySelector(".collection"),
  clearBtn: document.querySelector(".clear-tasks"),
  filter: document.querySelector("#filter"),
  taskInput: document.querySelector("#task")
};

// LocalStorage Functions
function initLocalStorage() {
  localStorage.setItem("collection", JSON.stringify([]));
}

function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("collection"));
}

function updateLocalStorage() {
  localStorage.setItem("collection", JSON.stringify(tasks));
}
// UI FUNCTIONS
// get input from the user
function getTaskInput() {
  return base.taskInput.value;
}
// clear the input field
function clearInput() {
  base.taskInput.value = "";
}

// clear the task list
function clearTasks() {
  base.taskList.innerHTML = "";
}

// rendering the taks functions
function createTaskUI(task) {
  var li =
    '<li class="collection-item" data-id=' +
    task.id +
    ">" +
    task.input +
    '<a class="delete-item secondary-content">' +
    '<i class="fa fa-remove"></i>' +
    "</a>" +
    "</li>";
  return li;
}

function renderTask(task) {
  base.taskList.insertAdjacentHTML("afterbegin", createTaskUI(task));
}

function renderTasks(tasks) {
  tasks.map(task => {
    renderTask(task);
  });
}

// Filter Section
// hide elements when filtering
function hideElements(collection, input) {
  collection.forEach(list => {
    if (!list.textContent.toLowerCase().includes(input)) {
      list.style.display = "none";
    }
  });
}

// reset the display style form the lists
function clearHide(collection) {
  collection.forEach(list => {
    list.style.display = "block";
  });
}

// Task Manager FUNCTIONS
function Task(id, input) {
  this.id = id;
  this.input = input;
}

var tasks = [];

function removeTaskFromTasks(id) {
  var newTasks = tasks.filter(task => {
    return task.id != id;
  });

  tasks = newTasks;
  updateLocalStorage();
}

// APP CONTROLLER FUNCTIONS
// Event Listeners:
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
  // retrieving data from local storage
  window.addEventListener("load", retrieveLocalStorageData);
  // Add task event
  base.form.addEventListener("submit", addTask);
  // remove task
  base.taskList.addEventListener("click", removeTask);
  // clear tasks
  base.clearBtn.addEventListener("click", clearTaskList);
  // filter the tasks list
  base.filter.addEventListener("keyup", filterTasks);
}

// add task function
function addTask(e) {
  e.preventDefault();
  // get the input field from the user
  var userInput = getTaskInput();
  // if the input is not empty
  if (userInput) {
    // create a new task
    var newTask = new Task(tasks.length + userInput, userInput);
    // add the task to tasks list
    tasks.push(newTask);
    // update the localStorage by adding the newTask
    updateLocalStorage();
    // clear the list input from the UI
    clearInput();
    clearTasks();
    // render the task list
    renderTasks(tasks);
  }
  // if the input is empty
  else {
    alert("Please Enter a Task");
  }
}

// remove task function
function removeTask(e) {
  e.preventDefault();
  if (e.target.tagName === "I") {
    // reach the li element
    var li = e.target.closest("li");
    // get the id from the li data set
    var id = li.dataset.id;
    // remove the element from the task list data-structure
    removeTaskFromTasks(id);
    // clear tasks from the UI
    clearTasks();
    // render the task list
    renderTasks(tasks);
  }
}

// clear tasks
function clearTaskList(e) {
  tasks = [];
  updateLocalStorage();
  clearTasks();
}

// filter tasks
function filterTasks(e) {
  var input = e.target.value.toLowerCase();

  var collection = Array.from(
    e.target.parentElement.nextElementSibling.children
  );
  // reset the display style form the lists:
  clearHide(collection);
  // hide the elements when filtering
  hideElements(collection, input);
}

// retrieve data from local storage
function retrieveLocalStorageData(wnd, e) {
  // if the localStorage is empty
  if (localStorage.getItem("collection") === null) {
    initLocalStorage();
  }
  // if the localStorage is not empty
  else {
    // update the tasks from localStorage
    tasks = getTasksFromLocalStorage();
    // render the tasks on the UI
    renderTasks(tasks);
  }
}
