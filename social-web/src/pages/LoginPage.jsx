import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

import { login } from "../services/authApi";

function LoginPage({ setLoggedInUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter Email & Password");
      return;
    }

    try {
      const response = await login({
        email,
        password,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      setLoggedInUser(response.user);

      alert(response.message);

      if (response.user.role_type === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="container">
      <h1 className="title">Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="button"
        onClick={handleLogin}
      >
        Login
      </button>

      <button
        className="linkButton"
        onClick={() => navigate("/register-admin")}
      >
        Register New Admin
      </button>
    </div>
  );
}

export default LoginPage;