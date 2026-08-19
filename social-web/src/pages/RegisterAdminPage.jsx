import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin } from "../services/authApi";
import "../styles/RegisterAdminPage.css";

function RegisterAdminPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await registerAdmin({
        name,
        email,
        password,
      });

      alert(response.message);

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Signup Failed"
      );
    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <h1>Create Admin Account</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleSignup}>
          Register Admin
        </button>

        <p
          className="login-link"
          onClick={() => navigate("/")}
        >
          Already have an account? Login
        </p>

      </div>

    </div>
  );
}

export default RegisterAdminPage;