import { useEffect, useState } from "react";

import AppRouter from "./router/AppRouter";

import { getUsers } from "./services/usersApi";

function App() {

  const [users, setUsers] = useState([]);

  const [loggedInUser, setLoggedInUser] = useState(null);

  // Load logged-in user from localStorage
  const loadLoggedInUser = () => {

    try {

      const storedUser = localStorage.getItem("user");

      if (storedUser) {

        const user = JSON.parse(storedUser);

        setLoggedInUser(user);

      }

    } catch (error) {

      console.log(error);

    }

  };

  // Load suggested users
  const loadUsers = async () => {

    try {

      if (!loggedInUser) return;

      const data = await getUsers(loggedInUser.id);

      setUsers(data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    loadLoggedInUser();

  }, []);

  useEffect(() => {

    if (loggedInUser) {

      loadUsers();

    }

  }, [loggedInUser]);

  return (

    <AppRouter
      users={users}
      setUsers={setUsers}
      loggedInUser={loggedInUser}
      setLoggedInUser={setLoggedInUser}
    />

  );

}

export default App;