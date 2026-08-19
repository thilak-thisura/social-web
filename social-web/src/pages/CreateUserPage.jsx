import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUser } from "../services/usersApi";

import "../styles/CreateUserPage.css";

function CreateUserPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const handleCreateUser = async () => {
    if (
      !name ||
      !role ||
      !designation ||
      !email ||
      !password ||
      !location ||
      !profilePicture
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await createUser({
        name,
        role,
        designation,
        email,
        password,
        location,
        profile_picture: profilePicture,
      });

      alert(response.message);

      navigate("/admin-dashboard");
    } catch (error) {
  console.log(error.response);
  console.log(error.response?.data);

  alert(
    JSON.stringify(error.response?.data || error.message)
  );
}
  };

  return (
    <div className="create-user-container">
      <div className="create-user-card">
        <h1>Create User Account</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="text"
          placeholder="Profile Image URL"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
        />

        <button onClick={handleCreateUser}>
          Create User Account
        </button>
      </div>
    </div>
  );
}

export default CreateUserPage;