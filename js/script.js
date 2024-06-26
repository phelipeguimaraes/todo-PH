// Seleção de elementos
const todoForm = document.querySelector('#todo-form')
const todoInput = document.querySelector('#todo-input')
const editForm = document.querySelector('#edit-form')
const editInput = document.querySelector('#edit-input')
const cancelBtn = document.querySelector('#cancel-edit-btn')
const searchInput = document.querySelector('#search-input')
const eraseBtn = document.querySelector('#erase-btn')
const selectFilter = document.querySelector('#select-filter')
const todoList = document.querySelector("#todo-list")

let oldTitleValue

// Funções
const updateList = (todoInputValue, done = 0, save = 1) => {
    const todo = document.createElement('div')
    todo.classList.add('todo')

    const todoTitle = document.createElement('h3')
    todoTitle.innerText = todoInputValue
    todo.appendChild(todoTitle)

    const finishBtn = document.createElement('button')
    finishBtn.classList.add('finish-todo')
    finishBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(finishBtn)

    const editBtn = document.createElement('button')
    editBtn.classList.add('edit-todo')
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)

    const delBtn = document.createElement('button')
    delBtn.classList.add('del-todo')
    delBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(delBtn)


    // Utilizando dados da LocalStorage
    if(done) {
        todo.classList.add('done')
    }

    if(save) {
        saveTodoLocalStorage({todoInputValue, done})
    }
    
    todoList.appendChild(todo)
    todoInput.value = ''
    todoInput.focus()
}

const toggleForm = () => {
    editForm.classList.toggle('hide')
    todoForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
    
}


const updateTodo = (text) => {
    const todos = document.querySelectorAll('.todo')

    todos.forEach(todo => {
        let todoTitle = todo.querySelector('h3')
        if(todoTitle.innerText === oldTitleValue) {
            todoTitle.innerText = text

            updateTodoLocalStorage(oldTitleValue, text)
        }
    })
}

const getInputTodos = (text) => {
    const todos = document.querySelectorAll('.todo')

    todos.forEach(todo => {
        let todoTitle = todo.querySelector('h3').innerText.toLowerCase()
        let search = text.toLowerCase()

        todo.style.display = 'flex'

        if(!todoTitle.includes(search)) {
            todo.style.display = 'none'
        }
    })
}

const selectFilterTodos = (text) => {
    const todos = document.querySelectorAll('.todo')

    switch(text) {
        case 'all':
        todos.forEach((todo) => {
            todo.style.display = 'flex'
        })
        break


        case "done":
        todos.forEach((todo) => {
            if(todo.classList.contains('done')) {
                todo.style.display = 'flex'
            }
            else {
                todo.style.display = 'none'
            }
        })
        break

        case 'todo':
        todos.forEach((todo) => {
            if(todo.classList.contains('done')) {
                todo.style.display = 'none'
            }
            else {
                todo.style.display = 'flex'
            }
        })
    }
}


// Eventos
todoForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const todoInputValue = todoInput.value
    if(todoInputValue) {
        updateList(todoInputValue)
    }

})

document.addEventListener('click', (e) => {
    const targetEl = e.target
    const parentEl = targetEl.closest('div')

    let todoTitle = parentEl.querySelector('h3').innerText

    
    if(targetEl.classList.contains('finish-todo')) {
        parentEl.classList.toggle('done')
        updateTodoStatusLocalStorage(todoTitle)
    }

    if(targetEl.classList.contains('del-todo')) {
        parentEl.remove()
        removeLocalStorage(todoTitle)
    }

    if(targetEl.classList.contains('edit-todo')) {
        toggleForm()
        editInput.value = todoTitle
        oldTitleValue = todoTitle
        editInput.focus()
    }

})

cancelBtn.addEventListener('click', (e) => {
    e.preventDefault()
    toggleForm()
})

editForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const editInputValue = editInput.value

    if(editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForm()
})

searchInput.addEventListener('keyup', (e) => {
    
    const search = searchInput.value

    if(search) {
        getInputTodos(search)
    }
})

eraseBtn.addEventListener('click', (e) => {
    e.preventDefault()

    searchInput.value = ''
    searchInput.focus()

    const todos = document.querySelectorAll('.todo')

    todos.forEach(todo => {
        todo.style.display = 'flex'
    })

})

selectFilter.addEventListener('change', (e) => {
    const selectFilterValue = selectFilter.value

    if(selectFilterValue) {
        selectFilterTodos(selectFilterValue)
    }
})

// Local Storage

const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || []
    return todos
}

const loadTodos = () => {
    const todos = getTodosLocalStorage()

    todos.forEach(todo => {
        updateList(todo.todoInputValue, todo.done, 0)
    })
}

const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage()

    todos.push(todo)

    localStorage.setItem('todos', JSON.stringify(todos))
}

const removeLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage()

    const filteredTodos = todos.filter((todo) => todo.todoInputValue !== todoText)

    localStorage.setItem('todos', JSON.stringify(filteredTodos))
}

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage()

    todos.map((todo) => todo.todoInputValue === todoText ? (todo.done = !todo.done) : null)

    localStorage.setItem('todos', JSON.stringify(todos))
}

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage()

    todos.map((todo) => todo.todoInputValue === todoOldText ? (todo.todoInputValue = todoNewText) : null)

    localStorage.setItem('todos', JSON.stringify(todos))
}


loadTodos()