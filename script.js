document.addEventListener('DOMContentLoaded', function() {
  // Initialize board from localStorage or fetch from API
  initializeBoard();

  // Event listeners for adding new tasks
  document.querySelectorAll('.new-task').forEach(button => {
      button.addEventListener('click', function() {
          addTask(this.parentElement.getAttribute('data-status'));
      });
  });

  // Drag and drop functionality (simplified example)
  // You would use a library like SortableJS to handle this in a real project
  document.querySelectorAll('.task').forEach(task => {
      task.addEventListener('dragstart', handleDragStart);
      task.addEventListener('drop', handleDrop);
      task.addEventListener('dragover', handleDragOver);
  });

  // Add event listeners to your columns
  document.querySelectorAll('.column').forEach(column => {
      column.addEventListener('dragover', allowDrop);
      column.addEventListener('drop', drop);
  });
});

function initializeBoard() {
  // Fetch tasks and populate the board
  const board = document.getElementById('board');
}


let taskIdCounter = 5;

function createTaskCard(taskContent) {
  // Increment the counter to get a unique ID for the new task
  taskIdCounter++;

  const taskCard = document.createElement('div');
  taskCard.classList.add('card');
  taskCard.textContent = taskContent;
  taskCard.setAttribute('draggable', true);
  // Set the unique ID for the task
  taskCard.id = 'task-' + taskIdCounter;

  // Add delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', function() {
      deleteTask(taskCard);
  });
  taskCard.appendChild(deleteButton);

  // Add event listeners for drag and drop if needed here
  taskCard.addEventListener('dragstart', handleDragStart);
  taskCard.addEventListener('dragover', handleDragOver);
  taskCard.addEventListener('drop', handleDrop);

  return taskCard;
}

function addTask(statusColumn) {
  // Prompt user for task content
  const taskContent = prompt('Enter the task description:');
  if (taskContent) {
      // Create a new task card with the entered content
      const taskCard = createTaskCard(taskContent);
      // Append the new task card to the appropriate status column
      statusColumn.appendChild(taskCard);
      // Update the task count for the column
      const newTaskButton = statusColumn.querySelector('.new-task');
      // Insert the new task card before the 'New' button
      statusColumn.insertBefore(taskCard, newTaskButton);
      updateTaskCount(statusColumn);
  }
}

function updateTaskCount(column) {
  const countElement = column.querySelector('.count');
  const numberOfTasks = column.getElementsByClassName('card').length;
  countElement.textContent = numberOfTasks; // Update the count display
}

function deleteTask(taskCard) {
  // Remove the task card from its parent node
  taskCard.parentNode.removeChild(taskCard);
  // Update task count for the column
  updateTaskCount(taskCard.closest('.column'));
}

function allowDrop(ev) {
  ev.preventDefault(); // Prevent default behavior (Prevent from being dropped)
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id); // Set the drag's data to be the task's id
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var target = ev.target;

  while (target && !target.classList.contains('column')) {
      // If the target is not a column, find the parent until it is
      target = target.parentNode;
  }
  if (target && target.classList.contains('column')) {
      // If the original drop target is a task, determine where to place the dragged task
      if (ev.target.classList.contains('task')) {
          // Find the mouse position relative to the tasks in the column
          var rect = ev.target.getBoundingClientRect();
          var offsetY = ev.clientY - rect.top;

          if (offsetY < rect.height / 2) {
              // If the mouse is in the upper half of the task, place the dragged task before it
              target.insertBefore(document.getElementById(data), ev.target);
          } else {
              // If the mouse is in the lower half of the task, place the dragged task after it
              target.insertBefore(document.getElementById(data), ev.target.nextSibling);
          }
      } else {
          // If the drop target is the column itself, append the task at the end of the column
          target.appendChild(document.getElementById(data));
      }
  }

  // Update task counts for all columns
  updateAllTaskCounts();
}

function updateAllTaskCounts() {
  document.querySelectorAll('.column').forEach(column => {
      updateTaskCount(column);
  });
}

function handleDragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
}

// Drag over event handler
function handleDragOver(event) {
  event.preventDefault(); // This allows us to drop.
}

function handleDrop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text/plain');
  const droppedElement = document.getElementById(data);
  const dropZone = event.target.closest('.column'); // Get the closest column element

  // Insert the dropped element before the 'New' button
  const newTaskButton = dropZone.querySelector('.new-task');
  dropZone.insertBefore(droppedElement, newTaskButton);
}

document.querySelectorAll('.new-task').forEach(button => {
  button.addEventListener('click', function() {
      const statusColumn = this.closest('.column'); // Find the closest column
      addTask(statusColumn); // Call addTask with the column as argument
  });
});
// document.addEventListener('DOMContentLoaded', function() {
//   // Event listeners for "New" buttons
//   document.querySelectorAll('.new-task').forEach(button => {
//       button.addEventListener('click', function() {
//           window.location.href = 'update.html'; // Change 'new-task.html' to the URL of your new task page
//       });
//   });

//   // Other event listeners and functions...
// });

