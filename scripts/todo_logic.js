const todoForm = document.querySelector(".todo-form");
const todoText = document.querySelector(".todo-form__text");
const todoDeadline = document.querySelector(".todo-form__deadline");
const todoItemsList = document.querySelector(".todo-items");
let todos = [];
const view = {
    needFilterByComplete: null,
    needFilterByDeadline: {
        from: null,
        to: null
    }
}

document.querySelector("#deadline-from").valueAsDate = new Date();

function addTodo(text, deadline) {
    if (text) {
        const todo = {
            id: Date.now(),
            name: text,
            isCompleted: false,
            deadline: deadline
        };
        todos.push(todo);
        renderTodos(todos);
        todoText.value = '';
        todoDeadline.value = "";
    }
}

function renderTodos(todos) {
    if (view.needFilterByComplete) {
        todos = filterByComplete(view.needFilterByComplete);
        view.needFilterByDeadline = false;
        document.querySelector("#deadline-to").value = null;
    }

    if (view.needFilterByDeadline.to) {
        todos = filterByDeadline(view.needFilterByDeadline.from, view.needFilterByDeadline.to);
        view.needFilterByComplete = false;
        document.querySelector(".controls__isDone").value = "all";
    }

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
    todos.forEach(function (item) {
        if (item.id == id) {
            item.isCompleted = !item.isCompleted;
        }
    });
    renderTodos(todos);
}

function deleteTodo(id) {
    todos = todos.filter(item => item.id != id);
    renderTodos(todos);
}

function filterByComplete(state) {
    switch (state) {
        case "completed":
            view.needFilterByComplete = "completed";
            return todos.filter(todo => todo.isCompleted);
        case "incomplete":
            view.needFilterByComplete = "incomplete";
            return todos.filter(todo => !todo.isCompleted);
        case "all":
            view.needFilterByComplete = false;
            return todos;
    }
}

function filterByDeadline(from, to) {
    // let from = document.querySelector("#deadline-from").value;
    // let to = document.querySelector("#deadline-to").value;

    if (from && to) {
        view.needFilterByDeadline.from = from;
        view.needFilterByDeadline.to = to;
        return todos.filter(todo => todo.deadline >= from && todo.deadline <= to);
    }
}

todoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo(todoText.value, todoDeadline.value);
});

todoItemsList.addEventListener("click", function (event) {
    if (event.target.type === "checkbox") {
        changeState(event.target.parentElement.getAttribute("data-id"));
    }

    if (event.target.classList.contains("todo-items__delete-button")) {
        deleteTodo(event.target.parentElement.getAttribute("data-id"));
    }
});

document.querySelector(".controls").addEventListener("change", function (event) {
    let filteredTodos;

    if (event.target.classList.contains("controls__isDone")) {
        filteredTodos = filterByComplete(event.target.value);
    }

    if (event.target.classList.contains("deadline-filter")) {
        filteredTodos = filterByDeadline(document.querySelector("#deadline-from").value, document.querySelector("#deadline-to").value);
    }

    renderTodos(filteredTodos);
});