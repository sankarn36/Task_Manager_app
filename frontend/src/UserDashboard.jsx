import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("To Do");
  const [filterStatus, setFilterStatus] = useState("To Do"); // Default filter

  const [user, setUser] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Low",
    endDate: "",
    status: "To Do",
    image: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.name) {
          setUser(parsedUser); // ✅ Now user will be an object with name, id, email, etc.
        } else {
          console.error("User data is missing from localStorage:", parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      navigate("/login"); // Redirect to login if no user found
    }
  }, [navigate]);

  useEffect(() => {
    if (user && user.id) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      if (!user?.id) return;
      const response = await axios.post("http://localhost:5000/api/tasks/all", { userId: user.id });
      console.log("Tasks fetched !!!", response.data);
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
    if (!user?.id) return;
  
    try {
      let image = "";
  
      // ✅ Upload image to Cloudinary if file exists
      if (newTask.image) {
        const formData = new FormData();
        formData.append("file", newTask.image);
        formData.append("upload_preset", "sshevytu");
      
        try {
          console.log("📤 Uploading image...");
          const res = await axios.post("https://api.cloudinary.com/v1_1/dbwgvmbm2/image/upload", formData);
          image = res.data.secure_url;
          console.log("✅ Image uploaded:", image);
        } catch (error) {
          console.error("❌ Image upload failed:", error.response?.data || error);
          return;
        }
      }
      
  
      // ✅ Prepare task data
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        endDate: newTask.endDate,
        status: newTask.status,
        image: image || "", // ✅ Set image URL if available
        userId: user.id,
      };
  
      console.log("📝 Sending task data:", taskData);
  
      // ✅ Send task data to backend
      const response = await axios.post("http://localhost:5000/api/tasks/create", taskData);
      console.log("✅ Task added successfully:", response.data);
  
      // ✅ Update UI with new task
      setTasks((prevTasks) => [...prevTasks, response.data.task]);

      setNewTask({ title: "", description: "", priority: "Low",  endDate: "", status: "To Do", image: null });
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error adding task:", error.response?.data || error);
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  
  const handleStatusChange = async (task, newStatus) => {
     
  
    if (!task || !task._id) {
      console.error("❌ Error: Task ID is missing!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");

      console.log("sending update request for task:", task._id);
      const response = await axios.put(
        `http://localhost:5000/api/tasks/update/${task._id}`, // 🔹 Ensure task._id exists
        { status:  newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("✅ Task updated:", response.data);
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error("❌ Error updating status:", error);
    }
  };
  

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="w-64 bg-gray-900 p-6 flex flex-col justify-between shadow-lg">
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Dashboard</h2>
          <button
            onClick={() => navigate("/alltasks")}
            className="block w-full p-3 bg-gray-800 rounded mb-4"
          >
            View All Tasks
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-lg">
              {user?.name? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <span>{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-100 px-4 py-2 rounded text-black"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex-1 p-8 bg-gray-950 overflow-y-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-4xl font-bold">Your Tasks</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-black px-6 py-3 rounded-lg"
          >
            + Add Task
          </button>
        </div>

        <div className="flex flex-col items-center">
    
    {/* Filter Buttons */}
    <div className="flex space-x-4 mb-6">
      <button onClick={() => setFilterStatus("To Do")} className={`px-4 py-2 rounded ${filterStatus === "To Do" ? "bg-blue-500" : "bg-gray-700"}`}>
        To Do
      </button>
      <button onClick={() => setFilterStatus("In Progress")} className={`px-4 py-2 rounded ${filterStatus === "In Progress" ? "bg-yellow-500" : "bg-gray-700"}`}>
        In Progress
      </button>
      <button onClick={() => setFilterStatus("Completed")} className={`px-4 py-2 rounded ${filterStatus === "Completed" ? "bg-green-500" : "bg-gray-700"}`}>
        Completed
      </button>
    </div>

    {/* Display Tasks Based on Selected Status */}
    {tasks.filter(task => task.status === filterStatus).length ? (
      tasks
        .filter(task => task.status === filterStatus)
        .map((task) => (
          <div key={task._id.toString()} className="w-1/2 p-4 mb-4 bg-gray-800 shadow-lg rounded-lg">
            <h3 className="text-xl font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p>Priority: <span className="font-semibold">{task.priority}</span></p>
            
            {/* Status Dropdown */}
            <p>
              Status:
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task, e.target.value)}
                className="ml-2 bg-gray-800 text-white border p-1 rounded"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </p>

            <p>Due Date: {new Date(task.endDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            
            {/* Image Display */}
            {task.image && (
              <img src={task.image} alt="Task" className="w-full h-40 object-cover rounded-lg mt-2" />
            )}
            
            {/* Delete Button */}
            <div className="mt-3 flex space-x-2">
              <button onClick={() => handleDeleteTask(task._id)} className="bg-gray-500 px-4 py-2 rounded">
                Delete
              </button>
            </div>
          </div>
        ))
    ) : (
      <p>No tasks found.</p>
    )}
  </div>

        

      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
            <form onSubmit={handleAddTask}>
              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="Task Title"
                  className="w-full p-3 border rounded bg-gray-800 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Task Description"
                  className="w-full p-3 border rounded bg-gray-800 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded bg-gray-800 text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="mb-4"> 
              <select name="status" value={newTask.status} onChange={handleInputChange}
               className="w-full p-3 border rounded bg-gray-800 text-white">
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              </div>
              <div className="mb-4">
                <input
                  type="date"
                  name="endDate"
                  value={newTask.endDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded bg-gray-800 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full p-3 border rounded bg-gray-800 text-white"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-black px-4 py-3 rounded"
              >
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;