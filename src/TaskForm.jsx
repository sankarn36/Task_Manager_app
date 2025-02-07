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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-2xl">
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
              className="w-full p-3 rounded-lg border border-gray-300"
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
                className="w-full p-3 rounded-lg border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Ending Date</label>
              <input
                type="date"
                name="endDate"
                value={task.endDate}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border border-gray-300"
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
                className="w-full p-3 rounded-lg border border-gray-300"
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
              className="w-full p-3 rounded-lg border border-gray-300"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
