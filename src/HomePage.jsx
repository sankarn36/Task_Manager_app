import { Plus } from "lucide-react";
import React, { useState } from "react";

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "Low",
    label: "",
    reminder: "",
    dueDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const addTask = () => {
    if (newTask.title) {
      setTasks([...tasks, newTask]);
      setNewTask({ title: "", priority: "Low", label: "", reminder: "", dueDate: "" });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <h1 className="text-3xl font-bold p-6 border-b border-gray-700">ZIDIO</h1>
        <nav className="flex-1 p-4 space-y-4">
          <a href="#" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
            Dashboard
          </a>
          <a href="#" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
            Create Task
          </a>
          <a href="#" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
            All Tasks
          </a>
          <a href="#" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
            Activity Tracking
          </a>
          <a href="#" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
            Teams
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Task Management</h2>
          <button
            onClick={addTask}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Task Input Form */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={newTask.title}
            onChange={handleInputChange}
            className="col-span-2 p-2 border rounded-lg"
          />
          <select
            name="priority"
            value={newTask.priority}
            onChange={handleInputChange}
            className="p-2 border rounded-lg"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="text"
            name="label"
            placeholder="Label (e.g., Work, Personal)"
            value={newTask.label}
            onChange={handleInputChange}
            className="p-2 border rounded-lg"
          />
          <input
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleInputChange}
            className="p-2 border rounded-lg"
          />
        </div>

        {/* Task List */}
        <h3 className="text-lg font-bold text-gray-800 mb-4">Tasks</h3>
        <div className="bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-5 p-4 font-semibold bg-gray-200">
            <div>Title</div>
            <div>Priority</div>
            <div>Label</div>
            <div>Reminder</div>
            <div>Due Date</div>
          </div>
          {tasks.map((task, index) => (
            <div
              key={index}
              className="grid grid-cols-5 p-4 border-t border-gray-200 items-center"
            >
              <div>{task.title}</div>
              <div>{task.priority}</div>
              <div>{task.label}</div>
              <div>{task.reminder || "None"}</div>
              <div>{task.dueDate || "Not Set"}</div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-4 text-gray-500 text-center">No tasks added yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
