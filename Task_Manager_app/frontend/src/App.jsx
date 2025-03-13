import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AllTasks from "./AllTasks";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import UserDashboard from "./UserDashboard";

const App = () => {
  return (
    <Routes>
      {/* Redirect the home route `/` to login */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/alltasks" element={<AllTasks />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
