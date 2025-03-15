import React, { useState } from 'react';

const TeamCollaboration = () => {
  const [teams, setTeams] = useState([]);
  const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', members: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam({ ...newTeam, [name]: value });
  };

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!newTeam.name.trim() || !newTeam.members.trim()) return;
    setTeams([...teams, { name: newTeam.name, members: newTeam.members.split(','), tasks: [] }]);
    setNewTeam({ name: '', members: '' });
    setShowCreateTeamForm(false); // Close the form after creating a team
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <SideMenu />

      {/* Main Content */}
      <div className="ml-64 p-8 w-full relative">
        {/* Centered Title */}
        <div className="relative mb-8">
  <h1
    className="text-3xl font-bold absolute"
    style={{
      left: "30%", // Horizontally centers it relative to the container
      transform: "translateX(-50%)", // Ensures it's perfectly centered
      top: "20px", // Adjust the vertical position as needed
    }}
  >
    Team Collaboration
  </h1>
</div>


        {/* Create Team Button */}
        <button
          onClick={() => setShowCreateTeamForm(!showCreateTeamForm)}
          className="absolute top-8 right-8 bg-gray-800 text-white p-4 rounded-lg"
        >
          {showCreateTeamForm ? 'Close Create Team Form' : 'Create Team'}
        </button>

        {/* Create Team Form (conditionally displayed as a pop-up) */}
        {showCreateTeamForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-black p-6 rounded-md w-96">
              <h2 className="text-xl mb-4 text-center">Create a Team</h2>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block">Team Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newTeam.name}
                    onChange={handleInputChange}
                    className="p-2 border w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block">Add Members (comma-separated emails)</label>
                  <input
                    type="text"
                    name="members"
                    value={newTeam.members}
                    onChange={handleInputChange}
                    className="p-2 border w-full"
                    required
                  />
                </div>
                <div>
                  <a
                    href="/taskform"
                    className="text-sm text-blue-400 underline"
                  >
                    Create Task For Team
                  </a>
                </div>
                <button type="submit" className="p-2 bg-gray-800 text-white w-full">Create Team</button>
              </form>
            </div>
          </div>
        )}

        {/* Display Teams */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {teams.map((team, index) => (
            <div key={index} className="bg-black bg-opacity-70 text-white p-6 rounded-md">
              <h2 className="text-2xl font-bold mb-2">{team.name}</h2>
              <h3 className="text-lg font-semibold">Members:</h3>
              <ul className="list-disc list-inside mb-2">
                {team.members.map((member, i) => (
                  <li key={i}>{member}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold">Tasks:</h3>
              <ul className="list-disc list-inside mb-2">
                {team.tasks.length
                  ? team.tasks.map((task, i) => <li key={i}>{task}</li>)
                  : <p>No tasks assigned yet.</p>}
              </ul>
              <div className="mt-4">
                <a
                  href="/create-task"
                  className="inline-block bg-gray-800 text-white py-2 px-4 rounded-md mr-2"
                >
                  Add Task
                </a>
              </div>
            </div>
          ))}
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
  

export default TeamCollaboration;
