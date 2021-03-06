const todoForm = document.querySelector(".todo-form");
const todoText = document.querySelector(".todo-form__text");
const todoDeadline = document.querySelector(".todo-form__deadline");
const todoItemsList = document.querySelector(".todo-items");
let allTodos = [];

getFromLocalStorage();

function changeProcessing() {
    let tempTodos = allTodos;
    let stateFilter = document.querySelector(".controls__isDone").value;
    let dateFromFilter = document.querySelector("#deadline-from").value;
    let dateToFilter = document.querySelector("#deadline-to").value;

    if (stateFilter !== "all") {
        tempTodos = filterByComplete(stateFilter);
    }

    if (dateFromFilter || dateToFilter) {
        tempTodos = filterByDeadline(dateFromFilter, dateToFilter, tempTodos);
    }

    renderTodos(tempTodos);
}

function addTodo(text, deadline) {
    if (text) {
        const todo = {
            id: Date.now(),
            name: text,
            isCompleted: false,
            deadline: deadline
        };
        allTodos.push(todo);
        addToLocalStorage(allTodos);
        todoText.value = '';
        todoDeadline.value = "";
    }
}

function renderTodos(todos) {
    todoItemsList.innerHTML = '';
    todos.forEach(function (item) {
        const isChecked = item.isCompleted ? "checked" : null;
        const liElement = document.createElement("li");

        liElement.setAttribute("class", "todo-items__item");
        liElement.setAttribute("data-id", item.id);

        if (item.isCompleted) {
            liElement.classList.add("item_checked");
        }

        liElement.innerHTML = `<input type="checkbox" class="todo-items__checkbox" ${isChecked}>
                                <span class="todo-items__text">${item.name}</span>
                                <span class="todo-items__deadline">${item.deadline}</span>
                                <button class="todo-items__delete-button">X</button>`;

        todoItemsList.append(liElement);
    })
}

function changeState(id) {
    allTodos.forEach(function (item) {
        if (item.id == id) {
            item.isCompleted = !item.isCompleted;
        }
    });
    addToLocalStorage(allTodos);
}

function deleteTodo(id) {
    allTodos = allTodos.filter(item => item.id != id);
    addToLocalStorage(allTodos);
}

function filterByComplete(state) {
    switch (state) {
        case "completed":
            return allTodos.filter(todo => todo.isCompleted);
        case "incomplete":
            return allTodos.filter(todo => !todo.isCompleted);
        case "all":
            return allTodos;
    }
}

function filterByDeadline(from, to, todos) {
    let tempTodos = todos;

    if (from) {
        tempTodos = tempTodos.filter(todo => todo.deadline >= from)
    }

    if (to) {
        tempTodos = tempTodos.filter(todo => todo.deadline <= to);
    }

    return tempTodos;
}

function addToLocalStorage(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
    changeProcessing();
}

function getFromLocalStorage() {
    const ref = localStorage.getItem("todos");

    if (ref) {
        console.log(ref);
        allTodos = JSON.parse(ref);
        changeProcessing();
    }
}

todoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo(todoText.value, todoDeadline.value);
});

todoItemsList.addEventListener("click", function (event) {
    let todo = event.target.parentElement.getAttribute("data-id");

    if (event.target.type === "checkbox") {
        changeState(todo);
    }

    if (event.target.classList.contains("todo-items__delete-button")) {
        deleteTodo(todo);
    }
});

document.querySelector(".controls").addEventListener("change", () => changeProcessing());

document.querySelector(".deadline-clear").addEventListener("click", function () {
    document.querySelector("#deadline-from").value = null;
    document.querySelector("#deadline-to").value = null;
    changeProcessing();
})