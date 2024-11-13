import React, { useState, useEffect } from 'react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch tasks from the server
  const getTasks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/task-manager/list-tasks');
      const data = await response.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    getTasks();
  }, [statusFilter]);

  // Add a new task
  const addTask = async () => {
    if (!newTask.title) {
      alert('Title is required!');
      return;
    }
    try {
      await fetch('http://127.0.0.1:5000/task-manager/add-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      setNewTask({ title: '', description: '' });  // Clear input fields
      getTasks();  // Refresh task list
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Update an existing task
  const updateTask = async () => {
    if (!taskToEdit.title) {
      alert('Title is required!');
      return;
    }
    try {
      await fetch(`http://127.0.0.1:5000/task-manager/update-task/${taskToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToEdit),
      });
      setTaskToEdit(null);  // Clear edit state
      getTasks();  // Refresh task list
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await fetch(`http://127.0.0.1:5000/task-manager/delete-task/${id}`, {
        method: 'DELETE',
      });
      getTasks();  // Refresh task list
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Mark task as done, in progress, or not done
  const markTask = async (id, status) => {
    try {
      await fetch(`http://127.0.0.1:5000/task-manager/mark-task/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      getTasks();  // Refresh task list
    } catch (error) {
      console.error('Error marking task:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Task Manager</h2>

      {/* Add Task Form */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Task Title"
          className="border p-2 w-full mb-2"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Task Description"
          className="border p-2 w-full mb-2"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 w-full"
        >
          Add Task
        </button>
      </div>

      {/* Filter Tasks */}
      <div className="mb-4">
        <button
          onClick={() => setStatusFilter('done')}
          className="bg-green-500 text-white p-2 mr-2"
        >
          Show Done
        </button>
        <button
          onClick={() => setStatusFilter('in progress')}
          className="bg-yellow-500 text-white p-2 mr-2"
        >
          Show In Progress
        </button>
        <button
          onClick={() => setStatusFilter('not done')}
          className="bg-red-500 text-white p-2 mr-2"
        >
          Show Not Done
        </button>
        <button
          onClick={() => setStatusFilter('')}
          className="bg-gray-500 text-white p-2"
        >
          Show All
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white shadow-md rounded p-4">
            <h3 className="font-semibold">{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: <span className={`font-semibold ${task.status === 'done' ? 'text-green-500' : task.status === 'in progress' ? 'text-yellow-500' : 'text-red-500'}`}>{task.status}</span></p>

            {/* Task Action Buttons */}
            <div className="mt-2">
              <button
                onClick={() => markTask(task.id, 'done')}
                className="bg-green-500 text-white p-2 mr-2"
              >
                Mark as Done
              </button>
              <button
                onClick={() => markTask(task.id, 'in progress')}
                className="bg-yellow-500 text-white p-2 mr-2"
              >
                Mark as In Progress
              </button>
              <button
                onClick={() => markTask(task.id, 'not done')}
                className="bg-red-500 text-white p-2 mr-2"
              >
                Mark as Not Done
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-gray-500 text-white p-2"
              >
                Delete
              </button>
            </div>

            {/* Edit Task */}
            <button
              onClick={() => setTaskToEdit(task)}
              className="bg-blue-500 text-white p-2 mt-2"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Edit Task Form */}
      {taskToEdit && (
        <div className="mt-4 p-4 border rounded shadow-md">
          <h3 className="font-semibold mb-2">Edit Task</h3>
          <input
            type="text"
            value={taskToEdit.title}
            onChange={(e) => setTaskToEdit({ ...taskToEdit, title: e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <textarea
            value={taskToEdit.description}
            onChange={(e) => setTaskToEdit({ ...taskToEdit, description: e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={updateTask}
            className="bg-blue-500 text-white p-2 w-full"
          >
            Update Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
