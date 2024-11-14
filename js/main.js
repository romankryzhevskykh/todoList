// find elements on the page
const form = document.querySelector("#form");
const taskInput = document.getElementById("taskInput");
const tasksList = document.getElementById("tasksList");
const emptyList = document.getElementById("emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener("submit", addTask);

function addTask(event) {

  // reject form sending
  event.preventDefault();

  // get text from the input
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);

  saveToLocalStorage();

  renderTask(newTask);

  //clear input and return focus
  taskInput.value = "";
  taskInput.focus();
}

tasksList.addEventListener("click", deleteTask);

function deleteTask(event) {
  // check that we clicked on Delete button and delete task
  if (event.target.dataset.action !== "delete") return;

  const parentNode = event.target.closest(".list-group-item");

  const id = Number(parentNode.id);

  // remove task via filter
  tasks = tasks.filter((task) => task.id !== id);

  saveToLocalStorage();

  //remove task from the markup
  parentNode.remove();

  checkEmptyList();
}

tasksList.addEventListener("click", doneTask);

function doneTask(event) {
  if (event.target.dataset.action !== "done") return;

  const parentNode = event.target.closest(".list-group-item");

  const id = Number(parentNode.id);

  const task = tasks.find((task) => task.id === id);

  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");

  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">TODO LIST</div>
				</li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task){
   // create CSS class
   const cssClass = task.done ? "task-title task-title--done" : "task-title";

   // create a markup for the new task
   const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
           <span class="${cssClass}">${task.text}</span>
           <div class="task-item__buttons">
             <button type="button" data-action="done" class="btn-action">
               <img src="./img/tick.svg" alt="Done" width="18" height="18">
             </button>
             <button type="button" data-action="delete" class="btn-action">
               <img src="./img/cross.svg" alt="Delete" width="18" height="18">
             </button>
           </div>
         </li>`;
 
   // add task to the page
   tasksList.insertAdjacentHTML("beforeend", taskHTML);
}