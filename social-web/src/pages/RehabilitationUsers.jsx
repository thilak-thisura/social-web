import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getAllUsers } from "../services/usersApi";

import "../styles/RehabilitationUsers.css";


function RehabilitationUsers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        async function loadUsers() {

            try {

                const data =
                    await getAllUsers();

                setUsers(data);

            }
            catch (error) {

                console.error(
                    "Failed to load users:",
                    error
                );

                setError(
                    "Failed to load users"
                );

            }
            finally {

                setLoading(false);

            }

        }


        loadUsers();

    }, []);


    if (loading) {

        return (
            <div className="rehab-users-page">

                <h2>
                    Rehabilitation Progress
                </h2>

                <p>
                    Loading users...
                </p>

            </div>
        );

    }


    if (error) {

        return (
            <div className="rehab-users-page">

                <h2>
                    Rehabilitation Progress
                </h2>

                <p>
                    {error}
                </p>

            </div>
        );

    }


    return (

        <div className="rehab-users-page">

            <div className="rehab-users-header">

                <h1>
                    Rehabilitation Progress
                </h1>

                <p>
                    Select a user to view their rehabilitation history.
                </p>

            </div>


            <div className="rehab-users-list">

                {users.length === 0 ? (

                    <p>
                        No users found.
                    </p>

                ) : (

                    users.map((user) => (

                        <div
                            className="rehab-user-card"
                            key={user.id}
                        >

                            <div className="rehab-user-info">

                                <h3>
                                    {user.name}
                                </h3>

                                <p>
                                    {user.email}
                                </p>

                            </div>


                            <button
                                className="view-progress-btn"
                                onClick={() =>
                                    navigate(
                                        `/rehabilitation/${user.id}`
                                    )
                                }
                            >
                                View Progress
                            </button>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}


export default RehabilitationUsers;