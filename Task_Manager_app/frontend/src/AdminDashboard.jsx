import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Low",
    endDate: "",
    assignedEmail: "",
    status: "To Do",
    image: null,
  });

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error("Error parsing admin data:", error);
      }
    } else {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewTask({ ...newTask, image: e.target.files[0] });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      // ✅ Upload image to Cloudinary if file exists
      if (newTask.image) {
        const formData = new FormData();
        formData.append("file", newTask.image);
        formData.append("upload_preset", "sshevytu"); // ✅ Ensure correct upload preset
        try {
          console.log("📤 Uploading image to Cloudinary...");
          const res = await axios.post("https://api.cloudinary.com/v1_1/dbwgvmbm2/image/upload", formData);
          imageUrl = res.data.secure_url;
          console.log("✅ Image uploaded:", imageUrl);
        } catch (error) {
          console.error("❌ Error uploading image:", error.response?.data || error);
          return;
        }
      }

      const taskData = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        endDate: newTask.endDate,
        assignedEmail: newTask.assignedEmail,
        image: imageUrl || "",
        adminId: admin?._id, // ✅ Ensure admin ID is stored with the task
      };

      const response = await axios.post("http://localhost:5000/api/admin/tasks/create", taskData);
      console.log("✅ Task assigned successfully:", response.data);

      setTasks([...tasks, response.data.task]);
      setNewTask({
        title: "",
        description: "",
        priority: "Low",
        status: "To Do",
        endDate: "",
        assignedEmail: "",
        image: null,
      });

      setShowModal(false);
    } catch (error) {
      console.error("❌ Error adding task:", error.response?.data || error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/tasks/delete/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/tasks/update/${taskId}`, {
        status: newStatus,
      });
      setTasks(tasks.map((task) => (task._id === taskId ? response.data.task : task)));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-6 flex flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h2>
          <nav className="space-y-4">
            <button onClick={() => navigate("/alltasks")} className="block w-full p-3 bg-gray-800 rounded">
              All Tasks
            </button>
          </nav>
        </div>

        {/* Admin Profile & Logout */}
        <div className="flex flex-col items-center justify-center mt-6">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-lg">
            {admin?.name?.charAt(0)}
          </div>
          <span className="text-lg font-semibold mt-2">{admin?.name || "Admin"}</span>
          <button onClick={handleLogout} className="bg-gray-100 px-4 py-2 mt-4 rounded text-black">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-950 overflow-y-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-4xl font-bold">All Users' Tasks</h2>
          <button onClick={() => setShowModal(true)} className="bg-white text-black px-6 py-3 rounded-lg">
            + New Task
          </button>
        </div>

        {tasks.length ? (
          tasks.map((task) => (
            <div key={task._id} className="p-4 mb-4 bg-gray-800 shadow-lg rounded-lg">
              <h3 className="text-xl font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: <span className="font-semibold">{task.priority}</span></p>
              <p>Assigned to: <span className="font-semibold">{task.assignedEmail}</span></p>
              <p>Due Date: {new Date(task.endDate).toLocaleDateString()}</p>
              <p>
                Status: 
                <select
                  value={task.status}
                  onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                  className="bg-gray-700 p-1 ml-2"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </p>
              <div className="mt-3 flex space-x-2">
                <button onClick={() => handleDeleteTask(task._id)} className="bg-red-500 px-4 py-2 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Assign New Task</h2>
            <form onSubmit={handleAddTask}>
              <input type="text" name="title" value={newTask.title} onChange={handleInputChange} placeholder="Task Name" required />
              <textarea name="description" value={newTask.description} onChange={handleInputChange} placeholder="Description" required />
              <input type="text" name="assignedEmail" value={newTask.assignedEmail} onChange={handleInputChange} placeholder="Assign to (Email)" required />
              <input type="file" onChange={handleImageChange} />
              <button type="submit" className="bg-white text-black px-4 py-3 rounded">
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
