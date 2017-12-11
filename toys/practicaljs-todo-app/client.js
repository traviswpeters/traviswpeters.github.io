var todoList = {

  // the actual list holding todos
  todos: [],

  // ex. todoList.addTodo('my new todo');
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
  },

  // ex. todoList.changeTodo(1, 'my updated todo');
  changeTodo: function(position, newTodoText) {
    this.todos[position].todoText = newTodoText;
  },

  // ex. todoList.deleteTodo(1);
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
  },

  // ex. todoList.toggleCompleted(1);
  toggleCompleted: function(position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
  },

  // ex. todoList.toggleAll();
  toggleAll: function() {
    var totalTodos = this.todos.length;
    var completedTodos = 0;

    // Get the number of completed todos.
    this.todos.forEach(function(todo) {
      if (todo.completed) {
        completedTodos++;
      }
    });

    // Toggle todos
    this.todos.forEach(function(todo) {
      // Case 1: If everything is true, make everything false.
      if (completedTodos === totalTodos) {
        todo.completed = false;
      // Case 2: Otherwise, make everything true.
      } else {
        todo.completed = true;
      }
    });
  }

};

// Event handling methods
var handlers = {

  addTodo: function() {
    var addTodoTextInput = document.getElementById('addTodoTextInput');
    todoList.addTodo(addTodoTextInput.value);
    addTodoTextInput.value = ''; // clear the input

    // Re-render the todo list
    view.displayTodos();
  },

  changeTodo: function(position, newTodoText) {
    var changeTodoPositionInput = document.getElementById('changeTodoPositionInput');
    var changeTodoTextInput = document.getElementById('changeTodoTextInput');
    todoList.changeTodo(changeTodoPositionInput.valueAsNumber, changeTodoTextInput.value);
    changeTodoPositionInput.value = '';
    changeTodoTextInput.value = '';

    // Re-render the todo list
    view.displayTodos();
  },

  deleteTodo: function(position) {
    todoList.deleteTodo(position);

    // Re-render the todo list
    view.displayTodos();
  },

  toggleCompleted: function(position) {
    var toggleCompletedPositionInput = document.getElementById('toggleCompletedPositionInput');
    todoList.toggleCompleted(toggleCompletedPositionInput.valueAsNumber);
    toggleCompletedPositionInput.value = '';

    // Re-render the todo list
    view.displayTodos();
  },

  toggleAll: function() {
    todoList.toggleAll();

    // Re-render the todo list
    view.displayTodos();
  }

};

// An object for UI-related methods
var view = {

  displayTodos: function() {
    // Select the unordered list and clear it.
    var todosUl = document.querySelector('ul');
    todosUl.innerHTML = '';

    // Add all of the todos to the unordered list of todos shown on the page.
    todoList.todos.forEach(function(todo, position) {
      var todoLi = document.createElement('li');

      // Customize the todoTextWithCompletion based on whether or not the todo is completed.
      var todoTextWithCompletion = '';
      if (todo.completed) {
        todoTextWithCompletion = '(x) ' + todo.todoText;
      } else { // !completed
        todoTextWithCompletion = '( ) ' + todo.todoText;
      }

      todoLi.id = position;                                 // set the todo `li`'s id to be its position in the todo list
      todoLi.textContent = todoTextWithCompletion;   // set the actual text that will be rendered for this todo `li`
      todoLi.appendChild(this.createDeleteButton()); // add the delete button for this todo `li`

      todosUl.appendChild(todoLi);
    }, this);
  },

  // A helper method for displaying todos --- creates the delete button for a todo item.
  createDeleteButton: function() {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete'
    deleteButton.className = 'deleteButton'
    return deleteButton;
  },

  setUpEventListeners: function() {

    // Whenever a click event occurs within the `ul` DOM element, the callback defined below will be called.
    var todosUl = document.querySelector('ul');
    todosUl.addEventListener('click', function(event) {
      // "Event Delegation" --- responding to javascript events via a single common (i.e., parent) DOM element.
      var elementClicked = event.target;

      // Check if the clicked element is a delete button.
      if (elementClicked.className === 'deleteButton') {
        handlers.deleteTodo( parseInt(elementClicked.parentNode.id) );
      }
    });

  }

};

// Run the method for setting up event listeners for our View (i.e., the UI).
view.setUpEventListeners();
