import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">
        Admin Dashboard
      </h1>

      <button
        className="dashboard-button"
        onClick={() => navigate("/create-user")}
      >
        Create User
      </button>

      <button
        className="dashboard-button"
        onClick={() => navigate("/view-users")}
      >
        View Users
      </button>

      <button
        className="dashboard-button"
        onClick={() => navigate("/rehabilitation")
        }
      >
        Rehabilitation Progress
      </button>

      <button
        className="logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  );
}

export default AdminDashboard;