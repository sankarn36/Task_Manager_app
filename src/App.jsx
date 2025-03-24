import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import TaskForm from "./TaskForm";
import AllTasks from "./AllTasks"
import TeamCollaboration from "./TeamCollaboration"

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/taskform" element={<TaskForm />} />
      <Route path="/alltasks" element={<AllTasks />} />
      <Route path="/teams" element={<TeamCollaboration />} />
    </Routes>
  );
};

export default App;
