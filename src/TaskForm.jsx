import { Image } from "lucide-react";
import React, { useState } from "react";

const TaskForm = () => {
  const [task, setTask] = useState({
    title: "",
    startDate: "",
    endDate: "",
    priority: "Low",
    description: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleImageChange = (e) => {
    setTask({ ...task, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Task submitted:", task);
    // Here you can dispatch a Redux action to save the task or make an API call.
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideMenu />

      {/* Main Content */}
      <div className="ml-10 flex items-center justify-center w-full">
        <div className="bg-black p-10 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Create A New Task</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Task Title</label>
              <input
                type="text"
                name="title"
                value={task.title}
                onChange={handleInputChange}
                placeholder="Enter task title"
                className="w-full p-3 rounded-lg border border-gray-300 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Starting Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={task.startDate}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 text-white"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Ending Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={task.endDate}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Priority Level</label>
                <select
                  name="priority"
                  value={task.priority}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">Attach Image</label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="bg-gray-700 text-white py-2 px-4 rounded-lg cursor-pointer flex items-center space-x-2"
                  >
                    <Image className="w-5 h-5" />
                    <span>Add Image</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Description</label>
              <textarea
                name="description"
                value={task.description}
                onChange={handleInputChange}
                placeholder="Enter task description"
                rows="4"
                className="w-full p-3 rounded-lg border border-gray-300 text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black p-3 rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Create Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const SideMenu = () => (
  <div className="min-h-screen flex bg-gray-100">
    {/* Sidebar Navigation */}
    <div className="w-64 bg-black text-white flex flex-col">
      <h1 className="text-3xl font-bold p-6 border-b border-gray-700">ZIDIO</h1>
      <nav className="flex-1 p-4 space-y-4">
        <a href="/home" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
          Dashboard
        </a>
        <a href="/taskform" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
          Create Task
        </a>
        <a href="/alltasks" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
          All Tasks
        </a>
        <a href="/teams" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
          Teams
        </a>
        <a href="#" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
          Activity Tracking
        </a>
       
      </nav>
    </div>
  </div>
);


export default TaskForm;
