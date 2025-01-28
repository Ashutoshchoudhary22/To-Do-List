const input = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
const searchInput = document.querySelector(".search-input");
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");

let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
let filter = ''; // Current filter (completed or pending)
let searchQuery = ''; // Current search query

showTodos();

function getTodoHtml(todo, index) {
  let checked = todo.status === "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="edit-button" onclick="editTask(${index})">
        <i class="fa fa-pencil"></i>
      </button>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)">
        <i class="fa fa-times"></i>
      </button>
    </li>
  `;
}

function showTodos() {
  const filteredTodos = todosJson.filter(todo => {
    return (
      (!filter || todo.status === filter) &&
      todo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (filteredTodos.length === 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = filteredTodos
      .map((todo, index) => getTodoHtml(todo, index))
      .join('');
    emptyImage.style.display = 'none';
  }
}

function addTodo(todo) {
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", (e) => {
  const todo = input.value.trim();
  if (e.key === "Enter" && todo) {
    input.value = "";
    addTodo(todo);
  }
});

addButton.addEventListener("click", () => {
  const todo = input.value.trim();
  if (todo) {
    input.value = "";
    addTodo(todo);
  }
});

function updateStatus(todo) {
  const index = parseInt(todo.id);
  todosJson[index].status = todo.checked ? "completed" : "pending";
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function remove(todo) {
  const index = parseInt(todo.dataset.index);
  todosJson.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function editTask(index) {
  const newTask = prompt("Edit your task:", todosJson[index].name);
  if (newTask !== null) {
    todosJson[index].name = newTask;
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
  }
}

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  showTodos();
});

filters.forEach(el => {
  el.addEventListener("click", () => {
    filters.forEach(tag => tag.classList.remove("active"));
    el.classList.add("active");
    filter = el.dataset.filter || '';
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});
