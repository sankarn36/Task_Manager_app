import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [tasks, setTasks] = useState(); // Initialize as an empty array
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState(); // Initialize as an empty array
    const [selectedUser, setSelectedUser] = useState(null);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "Low",
        endDate: "",
        assignedEmail: "",
        status: "To Do",
        image: null,
        adminId: "",
    });
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/users");
            console.log("✅ Users fetched:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("❌ Error fetching users:", error.response?.data || error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchAdminTasks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/admin-tasks", {
                withCredentials: true,
            });
            console.log("✅ Admin tasks fetched:", response.data);
            setTasks(response.data.tasks);
        } catch (error) {
            console.error("❌ Error fetching admin tasks:", error.response?.data || error);
        }
    };

    useEffect(() => {
        console.log("Checking localStorage:", localStorage.getItem("user"));
        const storedAdmin = localStorage.getItem("user");

        if (storedAdmin) {
            try {
                const parsedAdmin = JSON.parse(storedAdmin);
                console.log("🔹 Parsed Admin Data:", parsedAdmin);

                if (parsedAdmin && parsedAdmin.role?.trim()?.toLowerCase() === "admin") {
                    setAdmin(parsedAdmin);
                    setNewTask((prev) => ({
                        ...prev,
                        adminId: parsedAdmin.id || parsedAdmin._id,
                    }));
                } else {
                    console.error("User is not an admin.");
                    navigate("/login");
                    return;
                }
            } catch (error) {
                console.error("Error parsing admin data:", error);
                navigate("/login");
                return;
            }
        } else {
            console.error("No admin data found in localStorage.");
            navigate("/login");
            return;
        }
        setLoading(false);
    }, [navigate]);

    useEffect(() => {
        if (admin) {
            fetchAdminTasks();
        }
    }, [admin]);

    const fetchTasksForUser = async (userId) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/admin/admin-tasks",
                { userId },
                { withCredentials: true }
            );
            console.log("✅ Tasks for user:", response.data);
            setTasks(response.data.tasks);
        } catch (error) {
            console.error("❌ Error fetching user tasks:", error);
        }
    };

    const handleUserClick = async (userId) => {
        setSelectedUser(userId);
        setTasks(); // Corrected this line
        await fetchTasksForUser(userId);
    };

    const handleInputChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setNewTask({ ...newTask, image: e.target.files[0] });
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        console.log("📝 newTask state before submit:", newTask);
        console.log("Admin state:", admin);

        const adminId = admin?.id || admin?._id;

        if (!adminId) {
            console.error("Admin ID is missing.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("adminId", adminId);
            formData.append("title", newTask.title);
            formData.append("description", newTask.description);
            formData.append("priority", newTask.priority);
            formData.append("endDate", newTask.endDate);
            formData.append("status", newTask.status);
            formData.append("assignedEmail", newTask.assignedEmail);

            if (newTask.image) {
                formData.append("image", newTask.image);
            }

            console.log("📤 Uploading task with formData:", formData);

            const res = await axios.post(
                "http://localhost:5000/api/admin/tasks/create",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            console.log("✅ Task assigned successfully:", res.data);

            setTasks((prevTasks) => {
                const newTasks = prevTasks ? [...prevTasks, res.data.task] : [res.data.task];
                return newTasks;
            });
            if (selectedUser) {
                await fetchTasksForUser(selectedUser);
            }

            setNewTask({
                title: "",
                description: "",
                priority: "Low",
                endDate: "",
                status: "To Do",
                assignedEmail: "",
                image: null,
                adminId: adminId,
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

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
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
                        {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <span className="text-lg font-semibold mt-2">{admin?.name || "Admin1"}</span>
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

                <div className="flex-1 p-8 bg-gray-950 overflow-y-auto">
                    <div className="flex justify-between mb-6">
                        <h2 className="text-4xl font-bold">{selectedUser ? "Tasks for Selected User" : "Select a User"}</h2>
                    </div>

                    {/* Users List - Now in Main Content */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-4">Users</h3>
                        {users && Array.isArray(users) ? (
                            <div className="flex flex-wrap gap-2">
                                {users.map((user) => (
                                    <button
                                        key={user._id}
                                        onClick={() => handleUserClick(user._id)}
                                        className={`px-4 py-2 rounded ${selectedUser === user._id ? "bg-blue-500" : "bg-gray-800"}`}
                                    >
                                        {user.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p>Loading Users...</p>
                        )}
                    </div>

                    {/* Display Tasks */}
                    {tasks && Array.isArray(tasks) ? (
                        tasks.map((task) => (
                            <div key={task._id} className="p-4 mb-4 bg-gray-800 shadow-lg rounded-lg">
                                <h3 className="text-xl font-bold">{task.title}</h3>
                                <p>{task.description}</p>
                                <p>
                                    Priority: <span className="font-semibold">{task.priority}</span>
                                </p>
                                <p>
                                    Status: <span className="font-semibold">{task.status}</span>
                                </p>
                                <p>Due Date: {new Date(task.endDate).toLocaleDateString()}</p>
                                {task.image && <img src={task.image} alt="Task" className="w-full h-40 object-cover rounded-lg mt-2" />}
                            </div>
                        ))
                    ) : (
                        <p>No tasks found for this user.</p>
                    )}
                </div>

                {/* Task Creation Form */}
                {!loading && admin && showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-gray-900 p-8 rounded-lg w-96">
                            <h2 className="text-2xl font-bold mb-4">Assign New Task</h2>
                            <form onSubmit={handleAddTask}>
                                {/* Task Title */}
                                <input
                                    type="text"
                                    name="title"
                                    value={newTask.title}
                                    onChange={handleInputChange}
                                    placeholder="Task Title"
                                    className="mb-3 w-full p-3 border rounded bg-gray-800 text-white"
                                    required
                                />

                                {/* Task Description */}
                                <textarea
                                    name="description"
                                    value={newTask.description}
                                    onChange={handleInputChange}
                                    placeholder="Task Description"
                                    className="mb-3 w-full p-3 border rounded bg-gray-800 text-white"
                                    required
                                />

                                {/* Assign to User (via Email) */}
                                <input
                                    type="email"
                                    name="assignedEmail"
                                    value={newTask.assignedEmail}
                                    onChange={handleInputChange}
                                    placeholder="Assign to (User Email)"
                                    className="mb-3 w-full p-3 border rounded bg-gray-800 text-white"
                                    required
                                />

                                {/* Priority Selection */}
                                <select
                                    name="priority"
                                    value={newTask.priority}
                                    onChange={handleInputChange}
                                    className="mb-3 w-full p-3 border rounded bg-gray-800 text-white"
                                    required
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>

                                {/* Task Status */}
                                <select
                                    name="status"
                                    value={newTask.status}
                                    onChange={handleInputChange}
                                    className="mb-3 w-full p-3 border rounded bg-gray-800 text-white"
                                    required
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>

                                {/* Due Date */}
                                <input
                                    type="date"
                                    name="endDate"
                                    value={newTask.endDate}
                                    onChange={handleInputChange}
                                    className="mb-3 w-full p-3 border rounded bg-gray-800 text-white"
                                    required
                                />

                                {/* Task Image Upload */}
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="mb-3 w-full p-3 border rounded bg-gray-800 text-white"
                                />

                                {/* Submit Button */}
                                <button type="submit" className="w-full bg-white text-black px-4 py-3 rounded">
                                    Assign Task
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;