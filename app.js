// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgFQ54cabaD6ciUPR5YaTAdkGL72xlizw",
  authDomain: "todo-list-82937.firebaseapp.com",
  projectId: "todo-list-82937",
  storageBucket: "todo-list-82937.firebasestorage.app",
  messagingSenderId: "231289817141",
  appId: "1:231289817141:web:148d0ede015731b69e497c",
  measurementId: "G-HNMKSLR0VN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore instance

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Add Task to Firestore
const addTask = async (task) => {
  try {
    await addDoc(collection(db, "todos"), { task });
    loadTasks(); // Refresh the task list
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// Load Tasks from Firestore
const loadTasks = async () => {
  todoList.innerHTML = ""; // Clear current list
  const querySnapshot = await getDocs(collection(db, "todos"));
  querySnapshot.forEach((docSnapshot) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    todoItem.innerHTML = `
      ${docSnapshot.data().task}
      <div>
        <button class="edit-btn" data-id="${docSnapshot.id}" data-task="${docSnapshot.data().task}">Edit</button>
        <button class="delete-btn" data-id="${docSnapshot.id}">Delete</button>
      </div>
    `;
    todoList.appendChild(todoItem);
  });

  // Attach event listeners after rendering
  attachEventListeners();
};

// Edit Task in Firestore
const editTask = async (id, currentTask) => {
  const newTask = prompt("Edit Task:", currentTask);
  if (newTask) {
    try {
      await updateDoc(doc(db, "todos", id), { task: newTask });
      loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }
};

// Delete Task from Firestore
const deleteTask = async (id) => {
  try {
    await deleteDoc(doc(db, "todos", id));
    loadTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

// Attach Event Listeners to Buttons
const attachEventListeners = () => {
  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const task = e.target.dataset.task;
      editTask(id, task);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      deleteTask(id);
    });
  });
};

// Form Submission Handler
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = todoInput.value.trim();
  if (task) {
    addTask(task);
    todoInput.value = ""; // Clear input field
  }
});

// Load Tasks on Startup
loadTasks();
