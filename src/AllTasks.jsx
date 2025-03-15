import React from "react";

const tasks = [
  {
    name: "TASK TITLE 1",
    priority: "High",
    startDate: "2025-02-10",
    endDate: "2025-02-15",
    status: "Ongoing",
    description: "description of the respective task.",
  },
  {
    name: "TASK TITLE 2",
    priority: "Medium",
    startDate: "2025-02-12",
    endDate: "2025-02-20",
    status: "To Do",
    description: "description of the respective task.",
  },
  {
    name: "TASK TITLE 3",
    priority: "Low",
    startDate: "2025-02-14",
    endDate: "2025-02-22",
    status: "To Do",
    description: "description of the respective task.",
  },
  {
    name: "TASK TITLE 4",
    priority: "Low",
    startDate: "2025-02-14",
    endDate: "2025-02-22",
    status: "To Do",
    description: "description of the respective task.",
  },
  {
    name: "TASK TITLE 5",
    priority: "Low",
    startDate: "2025-02-14",
    endDate: "2025-02-22",
    status: "To Do",
    description: "description of the respective task.",
  },
  {
    name: "TASK TITLE 6",
    priority: "Low",
    startDate: "2025-02-14",
    endDate: "2025-02-22",
    status: "To Do",
    description: "description of the respective task.",
  },
  {
    name: "TASK TITLE 7",
    priority: "Low",
    startDate: "2025-02-14",
    endDate: "2025-02-22",
    status: "To Do",
    description: "description of the respective task.",
  },
];

const TaskGrid = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideMenu />

      {/* Main Content */}
      <div className="ml-64 bg-white min-h-screen flex flex-col items-center p-6">
        {/* Centered Heading */}
        <h1 className="text-4xl font-bold text-black mb-6 text-center">
          ALL TASKS
        </h1>

        {/* Grid Container */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-6xl">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="relative bg-gray-900 text-white p-6 rounded-lg shadow-lg group"
            >
              {/* Status Button */}
              <button className="absolute top-2 right-2 bg-white text-black px-4 py-2 rounded-full text-sm">
                {task.status}
              </button>

              <h1 className="text-xl font-bold mb-2">{task.name}</h1>
              <p className="text-gray-300">
                <strong>Priority:</strong> {task.priority}
              </p>
              <p className="text-gray-300">
                <strong>Start Date:</strong> {task.startDate}
              </p>
              <p className="text-gray-300">
                <strong>End Date:</strong> {task.endDate}
              </p>

              {/* Description on Hover */}
              <div className="absolute inset-0 bg-black bg-opacity-70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 rounded-lg">
                <p>{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SideMenu = () => (
  <div className="w-64 bg-black text-white flex flex-col min-h-screen">
    <h1 className="text-3xl font-bold p-6 border-b border-gray-700">ZIDIO</h1>
    <nav className="flex-1 p-4 space-y-4">
      <a href="/" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
        Dashboard
      </a>
      <a href="/create-task" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
        Create Task
      </a>
      <a href="/all-tasks" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
        All Tasks
      </a>
      <a
        href="/status-tracking"
        className="block py-2 px-4 rounded-lg hover:bg-gray-700"
      >
        Activity Tracking
      </a>
      <a
        href="/team-collaboration"
        className="block py-2 px-4 rounded-lg hover:bg-gray-700"
      >
        Teams
      </a>
    </nav>
  </div>
);

export default TaskGrid;
