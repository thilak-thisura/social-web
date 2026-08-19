import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    getUserRehabilitationHistory
} from "../services/rehabilitationApi";

import "../styles/RehabilitationHistory.css";


function RehabilitationHistory() {

    const { userId } = useParams();

    const navigate = useNavigate();


    const [history, setHistory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        async function loadHistory() {

            try {

                const data =
                    await getUserRehabilitationHistory(
                        userId
                    );

                setHistory(data);

            }
            catch (error) {

                console.error(
                    "Failed to load rehabilitation history:",
                    error
                );

                setError(
                    "Failed to load rehabilitation history"
                );

            }
            finally {

                setLoading(false);

            }

        }


        loadHistory();

    }, [userId]);


    if (loading) {

        return (
            <div className="rehab-history-page">

                <h1>
                    Rehabilitation History
                </h1>

                <p>
                    Loading history...
                </p>

            </div>
        );

    }


    if (error) {

        return (
            <div className="rehab-history-page">

                <h1>
                    Rehabilitation History
                </h1>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate("/rehabilitation")
                    }
                >
                    Back to Users
                </button>

            </div>
        );

    }


    return (

        <div className="rehab-history-page">

            <div className="rehab-history-header">

                <button
                    className="back-btn"
                    onClick={() =>
                        navigate("/rehabilitation")
                    }
                >
                    ← Back
                </button>

                <div>
                    <h1>
                        Rehabilitation History
                    </h1>

                    <p>
                        User ID: {userId}
                    </p>
                </div>

            </div>


            {history.length === 0 ? (

                <div className="no-history">

                    <h2>
                        No Rehabilitation History
                    </h2>

                    <p>
                        This user has not completed
                        any rehabilitation sessions yet.
                    </p>

                </div>

            ) : (

                <div className="history-list">

                    {history.map((session) => (

                        <div
                            className="history-card"
                            key={session.id}
                        >

                            <div className="history-card-header">

                                <h2>
                                    {session.exercise_name}
                                </h2>

                                <span>
                                    {new Date(
                                        session.created_at
                                    ).toLocaleDateString()}
                                </span>

                            </div>


                            <div className="history-stats">

                                <div>
                                    <strong>
                                        {session.total_reps}
                                    </strong>

                                    <span>
                                        Total Reps
                                    </span>
                                </div>


                                <div>
                                    <strong>
                                        {session.good_reps}
                                    </strong>

                                    <span>
                                        Good
                                    </span>
                                </div>


                                <div>
                                    <strong>
                                        {session.medium_reps}
                                    </strong>

                                    <span>
                                        Medium
                                    </span>
                                </div>


                                <div>
                                    <strong>
                                        {session.low_reps}
                                    </strong>

                                    <span>
                                        Low
                                    </span>
                                </div>

                            </div>


                            <div className="history-details">

                                <p>
                                    <strong>
                                        Best Angle:
                                    </strong>

                                    {" "}

                                    {session.best_angle}°
                                </p>


                                <p>
                                    <strong>
                                        Overall Score:
                                    </strong>

                                    {" "}

                                    <span
                                        className={
                                            `score-${session.overall_score?.toLowerCase()}`
                                        }
                                    >
                                        {session.overall_score}
                                    </span>
                                </p>


                                <p>
                                    <strong>
                                        Duration:
                                    </strong>

                                    {" "}

                                    {session.duration_seconds}
                                    {" "}
                                    seconds
                                </p>


                                <p>
                                    <strong>
                                        Session Time:
                                    </strong>

                                    {" "}

                                    {new Date(
                                        session.created_at
                                    ).toLocaleTimeString()}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}


export default RehabilitationHistory;