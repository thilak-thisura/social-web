import { useEffect, useState } from "react";
import { getAllUsers } from "../services/usersApi";
import "../styles/ViewUsersPage.css";

function ViewUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="view-users-container">

      <h1 className="title">
        View Users
      </h1>

      <table className="users-table">

        <thead>

          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Designation</th>
            <th>Location</th>
          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user.id}>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>{user.role}</td>

              <td>{user.designation}</td>

              <td>{user.location}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default ViewUsersPage;