---
layout: default
---

# Todo App

<center>
<b><a href="./v11/">[LIVE VERSION (Todo App v11)]</a></b>
</center>

This document details the creation of a simple Todo App.
This app was built while following along with the Watch and Code Javascript Series: [https://watchandcode.com/courses/practical-javascript/](https://watchandcode.com/courses/practical-javascript/).
A *big* shout out to [Gordon Zhu](https://medium.com/@gordon_zhu) --- he is an extremely gifted teacher.
His descriptions of ideas are intuitive and insightful.
I'm definitely looking forward to more of his courses.

Useful resources brought up in this series:

* [How to be great at asking coding questions](https://medium.com/@gordon_zhu/how-to-be-great-at-asking-questions-e37be04d0603)
* [cheatsheet-js](https:github.com/gordonmzhu/cheatsheet-js)

## V1 Requirements (Arrays)

A *very* basic version of the todo app.
Here, we only focus on the operations themselves,
    which will lay the groundwork for enhancing the app.

* it should have a place to *store* todos
* it should have a way to *display* todos
* it should have a way to *add* a new todo
* it should have a way to *update/change/edit* a todo
* it should have a way to *delete* a todo

```javascript
// store and display the todo list items
var todos = ['item 1', 'item 2', 'item 3'];
console.log('My Todos:', todos);

// add an item
todos.push('new item');

// edit an item (e.g., the item at position 1; using 0-based indexing)
todos[1] = '*item 2 updated*';

// delete an item (splice lets you specify (position, num-items-to-delete))
todos.splice(1, 1);
```

## V2 Requirements (Functions)

All of the requirements from V1 apply, but now we create functions which our app can use to display, add, update, delete todos. Thus,

* it should have a function to *display* todos
* it should have a function to *add* a new todo
* it should have a function to *update/change/edit* a todo
* it should have a function to *delete* a todo

```javascript
var todos = ['item 1', 'item 2', 'item 3'];

function displayTodos() {
    console.log('My Todos:', todos);
}

// ex. addTodo('my new todo');
function addTodo(todo) {
    todos.push(todo);
    displayTodos();
}

// ex. changeTodo(1, 'my updated todo');
function changeTodo(position, newValue) {
    todos[position] = newValue;
    displayTodos();
}

// ex. deleteTodo(1);
function deleteTodo(position) {
    todos.splice(position, 1);
    displayTodos();
}
```

## V3 Requirements (Objects)

We now move towards putting these functions "on" objects.
In other words, we want to make these methods for a todo list object.

```javascript
var todoList = {

  // the actual list holding todos
  todos: ['item 1', 'item 2', 'item 3'],

  // ex. todoList.displayTodos();
  displayTodos: function() {
      console.log('My Todos:', this.todos);
  },

  // ex. todoList.addTodo('my new todo');
  addTodo: function(todo) {
      this.todos.push(todo);
      this.displayTodos();
  },

  // ex. todoList.changeTodo(1, 'my updated todo');
  changeTodo: function(position, newValue) {
      this.todos[position] = newValue;
      this.displayTodos();
  },

  // ex. todoList.deleteTodo(1);
  deleteTodo: function(position) {
      this.todos.splice(position, 1);
      this.displayTodos();
  }

};
```

#### Javascript Object Refresher

Each element of an object is called a "property."
A property is a key-value pair separated by a colon (`:`).
Each property is separated by commas (`,`).
The value of a property can be pretty much anything (e.g., string, number, function).
Use the keyword `this` to refer to *this* object
    (the object in which the property is defined).

```javascript
// An example object with information about my computer & an anonymous function.
var myComputer = {
    os: 'mac',
    screenSize: '15 inches',
    purchaseYear: 2013,
    printDetails: function() {
        console.log('OS: ', this.os,
                    '- Screen Size: ', this.screenSize,
                    '- Year: ', this.purchaseYear);
    }
}
```

## V4 Requirements (Booleans)

More abstraction and customization capabilities.
We are focusing on adding *state* to a todo object.
A todo object consists of two properties: `todoText` (string) and `completed` (boolean).
Our requirements are now:

* `todoList.addTodo` should add objects (instead of just strings)
* `todoList.changeTodo` should change the todoText property
* `todoList.toggleCompleted` should change the completed property

The big changes include:

1. update the `addTodo` method to add todo objects instead of just strings.
2. updating the `changeTodo` method to update just the todoText within the todo object.
3. add a new method to toggle the `completed` property of a todo object.

```javascript
var todoList = {

  // the actual list holding todos
  todos: [],

  // ex. todoList.displayTodos();
  displayTodos: function() {
      console.log('My Todos:', this.todos);
  },

  // ex. todoList.addTodo('my new todo');
  addTodo: function(todoText) {
      this.todos.push({
        todoText: todoText,
        completed: false
      });
      this.displayTodos();
  },

  // ex. todoList.changeTodo(1, 'my updated todo');
  changeTodo: function(position, newTodoText) {
      this.todos[position].todoText = newTodoText;
      this.displayTodos();
  },

  // ex. todoList.toggleCompleted(1);
  toggleCompleted: function(position) {
      var todo = this.todos[position];
      todo.completed = !todo.completed;
      this.displayTodos();
  },

  // ex. todoList.deleteTodo(1);
  deleteTodo: function(position) {
      this.todos.splice(position, 1);
      this.displayTodos();
  }

};
```

## V5 Requirements (Loops of Logic)

In this version we are focusing on using loops to iterate over todos and update how we display todos.

Our requirements are now:

* `todoList.displayTodos` should show `.todoText`
* `todoList.displayTodos` should tell you if `.todos` is empty
* `todoList.displayTodos` should show `.completed`

```javascript
var todoList = {

  // the actual list holding todos
  todos: [],

  // ex. todoList.displayTodos();
  displayTodos: function() {
    if (this.todos.length === 0) {
      console.log('Your todo list is empty!');
    } else {
      console.log('My Todos:');
      for (var i = 0; i < this.todos.length; i++) {
        if (this.todos[i].completed) {
          console.log('(x)', this.todos[i].todoText);
        } else {
          console.log('( )', this.todos[i].todoText);
        }
      }
    }
  },

  // ex. todoList.addTodo('my new todo');
  addTodo: function(todoText) {
      this.todos.push({
        todoText: todoText,
        completed: false
      });
      this.displayTodos();
  },

  // ex. todoList.changeTodo(1, 'my updated todo');
  changeTodo: function(position, newTodoText) {
      this.todos[position].todoText = newTodoText;
      this.displayTodos();
  },

  // ex. todoList.toggleCompleted(1);
  toggleCompleted: function(position) {
      var todo = this.todos[position];
      todo.completed = !todo.completed;
      this.displayTodos();
  },

  // ex. todoList.deleteTodo(1);
  deleteTodo: function(position) {
      this.todos.splice(position, 1);
      this.displayTodos();
  }

};
```

## V6 Requirements (Thinking in Code)

In this version of the app we add one feature: `toggleAll`.
The requirements for this feature can be written as follows:

* `.toggleAll`: if everything is true, make everything false.
* `.toggleAll`: otherwise, make everything true.

```javascript
var todoList = {

  // the actual list holding todos
  todos: [],

  // ex. todoList.displayTodos();
  displayTodos: function() {
    if (this.todos.length === 0) {
      console.log('Your todo list is empty!');
    } else {
      console.log('My Todos:');
      for (var i = 0; i < this.todos.length; i++) {
        if (this.todos[i].completed) {
          console.log('(x)', this.todos[i].todoText);
        } else {
          console.log('( )', this.todos[i].todoText);
        }
      }
    }
  },

  // ex. todoList.addTodo('my new todo');
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
    this.displayTodos();
  },

  // ex. todoList.changeTodo(1, 'my updated todo');
  changeTodo: function(position, newTodoText) {
    this.todos[position].todoText = newTodoText;
    this.displayTodos();
  },

  // ex. todoList.toggleCompleted(1);
  toggleCompleted: function(position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
    this.displayTodos();
  },

  // ex. todoList.toggleAll();
  toggleAll: function() {
    var totalTodos = this.todos.length;
    var completedTodos = 0;

    // Get the number of completed todos.
    for (var i = 0; i < totalTodos; i++) {
      if (this.todos[i].completed) {
        completedTodos++;
      }
    }

    // Case 1: If everything is truee, make everything false.
    if (completedTodos === totalTodos) {
      for (i = 0; i < totalTodos; i++) {
        this.todos[i].completed = false;
      }
    } else { // Case 2: otherwise, make everything true.
      for (i = 0; i < totalTodos; i++) {
        this.todos[i].completed = true;
      }
    }
    this.displayTodos();
  },

  // ex. todoList.deleteTodo(1);
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
    this.displayTodos();
  }

};
```

## Interlude - Data types and comparisons

#### Objects (can be as complex as you want)

* `{}` // todoList, arrays, functions

#### Primitives

* String     // 'this is a string'
* Number     // 1, 2, 3, 4, ....
* Boolean    // true, false
* Undefined  // value that hasn't been set
* Null       // "nothing"

#### Comparisons with primitives

Think "just like how we expect comparisons to work in math class!" Use `===`.
Primitive comparisons compare *values*.

#### Comparisons with objects

When comparing objects (even with `===`) comparisons work differently than we might expect.
Javascript doesn't care that the objects look the same (e.g., same elements of an array) but rather, it is concerned with its *address* (or *reference*) in memory.

Gordon used an example of comparing identical looking houses on "Identical Street" to show that,
    even though houses may *look* identical, the houses physical reside at different addresses.
Like "Identical Street," javascript uses memory addresses to compare objects.

## V7 Requirements (HTML and the DOM)

In this version of the app we begin to move away from a purely console-based Todo App.
Specifically, we add a simple UI for displaying and toggling todos.  
The requirements for these features can be written as follows:

* There should be a "Display todos" button and a "Toggle all" button in the app.
* Clicking "Display todos" should run `todoList.displayTodos`.
* Clicking "Toggle all" should run `todoList.toggleAll`.

The DOM is basically just a representation of how the browser is interpreting a webpage described with HTML.
Now that we are adding UI elements, we will include the relevant HTML as well as javascript for the versions of our app as we continue our development.

#### index.html

```html
<!DOCTYPE html>
<html>

  <head>
    <link rel="stylesheet" href="style.css">
  </head>

  <body>
    <h1>Todo List</h1>

    <button id="displayTodosButton">Display Todos</button>
    <button id="toggleAllButton">Toggle All</button>

    <!-- We move the script.js reference down here so that the HTML page "loads" before our javascript is run. -->
    <script src="script.js"></script>
  </body>

</html>
```

#### script.js

```javascript
var todoList = {

  // the actual list holding todos
  todos: [],

  // ex. todoList.displayTodos();
  displayTodos: function() {
    if (this.todos.length === 0) {
      console.log('Your todo list is empty!');
    } else {
      console.log('My Todos:');
      for (var i = 0; i < this.todos.length; i++) {
        if (this.todos[i].completed) {
          console.log('(x)', this.todos[i].todoText);
        } else {
          console.log('( )', this.todos[i].todoText);
        }
      }
    }
  },

  // ex. todoList.addTodo('my new todo');
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
    this.displayTodos();
  },

  // ex. todoList.changeTodo(1, 'my updated todo');
  changeTodo: function(position, newTodoText) {
    this.todos[position].todoText = newTodoText;
    this.displayTodos();
  },

  // ex. todoList.toggleCompleted(1);
  toggleCompleted: function(position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
    this.displayTodos();
  },

  // ex. todoList.toggleAll();
  toggleAll: function() {
    var totalTodos = this.todos.length;
    var completedTodos = 0;

    // Get the number of completed todos.
    for (var i = 0; i < totalTodos; i++) {
      if (this.todos[i].completed) {
        completedTodos++;
      }
    }

    // Case 1: If everything is truee, make everything false.
    if (completedTodos === totalTodos) {
      for (i = 0; i < totalTodos; i++) {
        this.todos[i].completed = false;
      }
    } else { // Case 2: otherwise, make everything true.
      for (i = 0; i < totalTodos; i++) {
        this.todos[i].completed = true;
      }
    }
    this.displayTodos();
  },

  // ex. todoList.deleteTodo(1);
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
    this.displayTodos();
  }

};

// Get the display button by its id and add a 'click' event listener to display the todos.
var displayTodosButton = document.getElementById('displayTodosButton');
displayTodosButton.addEventListener('click', function() {
  todoList.displayTodos();
});

// Get the toggle button by its id and add a 'click' event listener to toggle the todos.
var toggleAllButton = document.getElementById('toggleAllButton');
toggleAllButton.addEventListener('click', function() {
  todoList.toggleAll();
});
```

## Interlude - Don't wonder about things the debugger can tell you

Insert the work `debugger;` anywhere in your javascript scripts -- the execution of your script will pause when it encounters the debugger keyword.
This is a programmatic way of adding a *break point* in your code.
You can then use the Google Chrome interface ("Sources") to step lines of code, and inspect variables, etc., and ultimately resume execution, to debug your code!

Gordon (in the video series) spent time stepping through each of the methods we've defined thus far with the debugger.
I encourage you to check that out if you haven't used the Chrome Developer Tools!

## V8 Requirements (Getting data from inputs)

In this version of the app we begin with a bit of refactoring.
Specifically, we change the code for how we specify the event-handling code.
This change is not a functional change, but rather a change to make the code more clear.
For instance, now we don't need to rely on unique IDs for each button and so forth,
    and instead we can simply use the `onclick` attribute in the HTML button tag to
    identify the appropriate handler to invoke when clicking a particular button.
This refactoring is useful because we really only need to specific a handler that
    will be invoked when certain buttons are clicked.
Using a more flexible way of specifying event listeners is good,
    but in this case, it is more than we need.

Next we aim to build out controls for other aspects of our app.
The requirements for these features can be written as follows:

* It should have working controls for `.addTodo`
* It should have working controls for `.changeTodo`
* It should have working controls for `.deleteTodo`
* It should have working controls for `.toggleCompleted`

These methods require arguments (e.g., adding a todo), which is why we've saved them until now.
This isn't a lot more complex, but it does require us to do a little more work.

We also update our HTML in accordance with our new features.

#### index.html

```html
<!DOCTYPE html>
<html>

  <head>
    <link rel="stylesheet" href="style.css">
  </head>

  <body>
    <h1>Todo List</h1>

    <div>
      <button onclick="handlers.displayTodos()">Display Todos</button>
      <button onclick="handlers.toggleAll()">Toggle All</button>
    </div>

    <!-- Todo input -->
    <div>
      <button onclick="handlers.addTodo()">Add</button>
      <input id="addTodoTextInput" type="text">
    </div>    

    <!-- Change a todo -->
    <div>
      <button onclick="handlers.changeTodo()">Change Todo</button>
      <input id="changeTodoPositionInput" type="number">
      <input id="changeTodoTextInput" type="text">
    </div>    

    <!-- Delete a todo -->
    <div>
      <button onclick="handlers.deleteTodo()">Delete</button>
      <input id="deleteTodoPositionInput" type="number">
    </div>    

    <!-- Toggle completed for a todo -->
    <div>
      <button onclick="handlers.toggleCompleted()">Toggle Completed</button>
      <input id="toggleCompletedPositionInput" type="number">
    </div>    

    <!-- We move the script.js reference down here so that the HTML page "loads" before our javascript is run. -->
    <script src="script.js"></script>
  </body>

</html>
```

#### script.js

```javascript
var todoList = {

  // the actual list holding todos
  todos: [],

  // ex. todoList.displayTodos();
  displayTodos: function() {
    if (this.todos.length === 0) {
      console.log('Your todo list is empty!');
    } else {
      console.log('My Todos:');
      for (var i = 0; i < this.todos.length; i++) {
        if (this.todos[i].completed) {
          console.log('(x)', this.todos[i].todoText);
        } else {
          console.log('( )', this.todos[i].todoText);
        }
      }
    }
  },

  // ex. todoList.addTodo('my new todo');
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
    this.displayTodos();
  },

  // ex. todoList.changeTodo(1, 'my updated todo');
  changeTodo: function(position, newTodoText) {
    this.todos[position].todoText = newTodoText;
    this.displayTodos();
  },

  // ex. todoList.deleteTodo(1);
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
    this.displayTodos();
  },

  // ex. todoList.toggleCompleted(1);
  toggleCompleted: function(position) {
    var todo = this.todos[position];
    todo.completed = !todo.completed;
    this.displayTodos();
  },

  // ex. todoList.toggleAll();
  toggleAll: function() {
    var totalTodos = this.todos.length;
    var completedTodos = 0;

    // Get the number of completed todos.
    for (var i = 0; i < totalTodos; i++) {
      if (this.todos[i].completed) {
        completedTodos++;
      }
    }

    // Case 1: If everything is truee, make everything false.
    if (completedTodos === totalTodos) {
      for (i = 0; i < totalTodos; i++) {
        this.todos[i].completed = false;
      }
    } else { // Case 2: otherwise, make everything true.
      for (i = 0; i < totalTodos; i++) {
        this.todos[i].completed = true;
      }
    }
    this.displayTodos();
  }

};

// Event handling methods
var handlers = {

  displayTodos: function() {
    todoList.displayTodos();
  },

  addTodo: function() {
    var addTodoTextInput = document.getElementById('addTodoTextInput');
    todoList.addTodo(addTodoTextInput.value);
    addTodoTextInput.value = ''; // clear the input
  },

  changeTodo: function(position, newTodoText) {
    var changeTodoPositionInput = document.getElementById('changeTodoPositionInput');
    var changeTodoTextInput = document.getElementById('changeTodoTextInput');
    todoList.changeTodo(changeTodoPositionInput.valueAsNumber, changeTodoTextInput.value);
    changeTodoPositionInput.value = '';
    changeTodoTextInput.value = '';
  },

  deleteTodo: function(position) {
    var deleteTodoPositionInput = document.getElementById('deleteTodoPositionInput');
    todoList.deleteTodo(deleteTodoPositionInput.valueAsNumber);
    deleteTodoPositionInput.value = '';
  },

  toggleCompleted: function(position) {
    var toggleCompletedPositionInput = document.getElementById('toggleCompletedPositionInput');
    todoList.toggleCompleted(toggleCompletedPositionInput.valueAsNumber);
    toggleCompletedPositionInput.value = '';
  },

  toggleAll: function() {
    todoList.toggleAll();
  }

};
```

## V9 Requirements (Escape from the console)

In this version of the app we are concerned with enhancing our UI to display todos.
Specifically, we want to use HTML `li` (list item) elements to render each todo.

* There should be an `li` (list item) element for every todo
* Each `li` element should contain `.todoText`
* Each `li` element should show `.completed`

We can use javascript to dynamically insert `li` elements as follows:

```javascript
var todoLi = document.createElement('li');
```

We want to insert these `li` elements into an unordered list (a `ul` element).
We can select a statically defined `ul` element as follows:

```javascript
var todosUl = document.querySelector('ul');
```

Here we take a bit of a shortcut to identify the correct `ul` in that
    we assume the page only displays a single unordered list (i.e., a list of todos).
Once we have captured a reference to the `ul` in `todosUl` we can add `li` elements to it:

```javascript
todosUl.appendChild(todoLi);
```

Also, we do a bit of refactoring to address the fact that we are now trying to
    "escape the console" and render our todo list on the webpage a.k.a. in the DOM
    (rather than in the console).
Thus, we removed the `displayTodos()` method that rendered our list in the console and
    have now created a `view` object which is meant to render our todo list by manipulating the DOM.
This `view` object is only concerned with showing what the todo list contains - not
    modifying the list or anything else.

#### index.html

```html
<!DOCTYPE html>
<html>

  <head>
    <link rel="stylesheet" href="style.css">
  </head>

  <body>
    <h1>Todo List</h1>

    <div>
      <button onclick="handlers.toggleAll()">Toggle All</button>
    </div>

    <!-- Todo input -->
    <div>
      <button onclick="handlers.addTodo()">Add</button>
      <input id="addTodoTextInput" type="text">
    </div>    

    <!-- Change a todo -->
    <div>
      <button onclick="handlers.changeTodo()">Change Todo</button>
      <input id="changeTodoPositionInput" type="number">
      <input id="changeTodoTextInput" type="text">
    </div>    

    <!-- Delete a todo -->
    <div>
      <button onclick="handlers.deleteTodo()">Delete</button>
      <input id="deleteTodoPositionInput" type="number">
    </div>    

    <!-- Toggle completed for a todo -->
    <div>
      <button onclick="handlers.toggleCompleted()">Toggle Completed</button>
      <input id="toggleCompletedPositionInput" type="number">
    </div>

    <!-- The unordered list where the todos will be rendered -->
    <ul>
    </ul>

    <!-- We move the script.js reference down here so that the HTML page "loads" before our javascript is run. -->
    <script src="script.js"></script>
  </body>

</html>
```

#### script.js

```javascript
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
    for (var i = 0; i < totalTodos; i++) {
      if (this.todos[i].completed) {
        completedTodos++;
      }
    }

    // Case 1: If everything is truee, make everything false.
    if (completedTodos === totalTodos) {
      for (i = 0; i < totalTodos; i++) {
        this.todos[i].completed = false;
      }
    } else { // Case 2: otherwise, make everything true.
      for (i = 0; i < totalTodos; i++) {
        this.todos[i].completed = true;
      }
    }
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
    var deleteTodoPositionInput = document.getElementById('deleteTodoPositionInput');
    todoList.deleteTodo(deleteTodoPositionInput.valueAsNumber);
    deleteTodoPositionInput.value = '';

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
    for (var i = 0; i < todoList.todos.length; i++) {
      var todoLi = document.createElement('li');
      var todo = todoList.todos[i];

      // Customize the todoTextWithCompletion based on whether or not the todo is completed.
      var todoTextWithCompletion = '';
      if (todo.completed) {
        todoTextWithCompletion = '(x) ' + todo.todoText;
      } else { // !completed
        todoTextWithCompletion = '( ) ' + todo.todoText;
      }

      todoLi.textContent = todoTextWithCompletion;
      todosUl.appendChild(todoLi);
    }
  }

};
```

## Interlude - Functions inside of functions

"Enhancing" other functions.

In this example we invoke the debugger then run some function that we want to run.

```javascript
function runWithDebugger(ourFunction) {
    debugger;
    ourFunction();
}

// Ex. call as...
// runWithDebugger(function logTenNumbers() {
//        for (var i = 0; i < 10; i++) {
//            console.log(i);
//        }
// });
```

An example of a timer ("alarm clock") using `setTimeout()`
    to call a function after some period of time:

```javascript
setTimeout(function(), {
    console.log('Wake up Travis!');
}, 5000)
```

An example using `forEach` to iterate over a collection, invoking a function on each item:

```javascript
var students = ['jonathan', 'jenny', 'elliot'];
function logName(name) {
    console.log(name);
}

students.forEach(logName);
```

On DOM elements we can use `.addEventListener()` to add event handlers (e.g., 'click').

```javascript
myDomElement.addEventListener('click', function(event) {
    console.log(event);
})
```

#### Higher order functions:

Generally speaking, higher order functions:

* Functions that accept other functions.
* Enhance the behavior of other functions.

Examples of higher order functions are,
    e.g., `runWithDebugger`, `setTimeout`, `forEach`, `addEventListener`.

#### Callback functions:

* The functions that are passed into higher order functions.

Examples of callback functions are,
    e.g., the named or anonymous functions passed into the higher order functions noted above.

## V10 Requirements (Click to delete)

The objective of this version is to add the "click to delete" feature.
Before doing this, however, we transition to a new tool
    that makes it easier for us to continue developing our app.
Specifically, we moved to use a tool called [Glitch](https://glitch.com/).
After creating an account and signing in,
    visit [https://glitch.com/~forest-sunset](https://glitch.com/~forest-sunset).
Then click "Remix your own" to get a copy of V9 of the todo application.

A couple things to note with this transition:

* The javascript file has changed from `script.js` to `public/client.js`. I copied over my code rather than keeping Gordon's version since I had added comments/spaces for readability. Other than this, this is the javascript code we've been writing thus far.
* The main HTML file has changed from `index.html` to `views/index.html`. I added some comments to it based on my previous versions of the file, but kept it unchanged otherwise. Other than this, this is the HTML we've been writing thus far.

I left everything else in the copied project alone.

Using Glitch, we can simply hit "Show Live" to open a new window that runs our app.
We can leave this window open and come back whenever we want.

With all of this out of way, the requirements for this version of the app are as follows:

* There should be a way to create delete buttons
* There should be a delete button for each todo
* Each `li` should have an id that has a todo position (by adding a single event listener to the `ul` element)
* Delete buttons should have access to the todo id (by using the `target`, `parentNode`, and `id` attributes within a DOM click event)
* Clicking delete should update `todoList.todos` and the DOM

#### index.html

```html
<!DOCTYPE html>
<html>

  <head>
    <title>Practical Todos</title>
    <link id="favicon" rel="icon" href="https://hyperdev.com/favicon.ico" type="image/x-icon">
  </head>

  <body>
    <h1>Todo List</h1>

    <div>
      <button onclick="handlers.toggleAll()">Toggle All</button>
    </div>

    <!-- Todo input -->
    <div>
      <button onclick="handlers.addTodo()">Add</button>
      <input id="addTodoTextInput" type="text">
    </div>

    <!-- Change a todo -->
    <div>
      <button onclick="handlers.changeTodo()">Change Todo</button>
      <input id="changeTodoPositionInput" type="number">
      <input id="changeTodoTextInput" type="text">
    </div>

    <!-- Toggle completed for a todo -->
    <div>
      <button onclick="handlers.toggleCompleted()">Toggle Completed</button>
      <input id="toggleCompletedPositionInput" type="number">
    </div>

    <!-- The unordered list where the todos will be rendered -->
    <ul>
    </ul>

    <!-- We move the script reference down here so that the HTML page "loads" before our javascript is run. -->
    <script src="/client.js"></script>
  </body>

</html>
```

#### client.js

```javascript
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
    for (var i = 0; i < totalTodos; i++) {
      if (this.todos[i].completed) {
        completedTodos++;
      }
    }

    // Case 1: If everything is truee, make everything false.
    if (completedTodos === totalTodos) {
      for (i = 0; i < totalTodos; i++) {
        this.todos[i].completed = false;
      }
    } else { // Case 2: otherwise, make everything true.
      for (i = 0; i < totalTodos; i++) {
        this.todos[i].completed = true;
      }
    }
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
    for (var i = 0; i < todoList.todos.length; i++) {
      var todoLi = document.createElement('li');
      var todo = todoList.todos[i];

      // Customize the todoTextWithCompletion based on whether or not the todo is completed.
      var todoTextWithCompletion = '';
      if (todo.completed) {
        todoTextWithCompletion = '(x) ' + todo.todoText;
      } else { // !completed
        todoTextWithCompletion = '( ) ' + todo.todoText;
      }

      todoLi.id = i;                                 // set the todo `li`'s id to be its position in the todo list
      todoLi.textContent = todoTextWithCompletion;   // set the actual text that will be rendered for this todo `li`
      todoLi.appendChild(this.createDeleteButton()); // add the delete button for this todo `li`

      todosUl.appendChild(todoLi);
    }
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
```

## V11 Requirements (Destroy all for loops)

Now that we've studied higher order functions and matured the app quite a bit,
    there are yet more opportunities to apply some of our lessons-learned to further improve the app.
Specifically, our requirements for this version of the app are as follows:

* `todoList.toggleAll` should use `forEach`
* `view.displayTodos` should use `forEach`

In reality these are just optimizations, and mostly in terms of readability.
Specifically, most of our changes consist of converting for loops into `forEach` blocks.

#### index.html

```html
<!DOCTYPE html>
<html>

  <head>
    <title>Practical Todos</title>
    <link id="favicon" rel="icon" href="https://hyperdev.com/favicon.ico" type="image/x-icon">
  </head>

  <body>
    <h1>Todo List</h1>

    <div>
      <button onclick="handlers.toggleAll()">Toggle All</button>
    </div>

    <!-- Todo input -->
    <div>
      <button onclick="handlers.addTodo()">Add</button>
      <input id="addTodoTextInput" type="text">
    </div>

    <!-- Change a todo -->
    <div>
      <button onclick="handlers.changeTodo()">Change Todo</button>
      <input id="changeTodoPositionInput" type="number">
      <input id="changeTodoTextInput" type="text">
    </div>

    <!-- Toggle completed for a todo -->
    <div>
      <button onclick="handlers.toggleCompleted()">Toggle Completed</button>
      <input id="toggleCompletedPositionInput" type="number">
    </div>

    <!-- The unordered list where the todos will be rendered -->
    <ul>
    </ul>

    <!-- We move the script reference down here so that the HTML page "loads" before our javascript is run. -->
    <script src="/client.js"></script>
  </body>

</html>
```

#### client.js

***NOTE:***
As we noted earlier, `this` refers to the object in which some, e.g., method is defined.
If a method within an object defines a callback
    (for example, when using `forEach` and defining a callback),
    then using `this` within the callback will now refer to the object in which
    it is contained (i.e., not our original object).

Luckily, methods such as `forEach` take
    two parameters: a callback and a reference to some object
    which will be referred to when using `this` inside the callback.
Thus, if we pass `this` when composing our `forEach` statement,
    we can pass in `this` and then `this` will be a reference to the object that
    we think it should reference when writing code for the callback.

If this doesn't make sense, that is OK for now. Just write `forEach` blocks as follows:

```javascript
forEach(callback, this);  <<< pass a reference to the current object b    
```

Without further ado, here is the actual `client.js` file now:

```javascript
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
```

## Interlude - Understanding `this`

The `this` keyword is an important on in Javascript.
Thus, Gordon has been nice enough to provide
    a helpful [cheatsheet-js](https:github.com/gordonmzhu/cheatsheet-js).
The cheatsheet is generally useful, but regarding `this`, be sure to see the section on
    [Understanding `this`](https://github.com/gordonmzhu/cheatsheet-js#understanding-this).

A general takeaway is that you have to look at a higher order function
    to determine what `this` will be.

## Until Next Time...

Unfortunately the tutorial stops rather abruptly with V11 of the app.
There appears to to be more content in the [premium version](https://watchandcode.com/p/premium),
    though it isn't clear whether or not the Todo app is wrapped up there.
