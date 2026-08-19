import { useRef, useEffect, useState } from "react";

import WebcamView from "../components/WebcamView";

import { loadPoseDetector } from "../utils/poseDetector";

import PoseCanvas from "../components/PoseCanvas";

import {
    drawLandmarks,
    drawSkeleton
} from "../utils/drawPose";

import { exercises } from "../exerciseLogic/exercises";

import { createRepCounter } from "../utils/repCounter";

import {
    createSessionStats,
    addRep,
    getSessionSummary
} from "../utils/sessionStats";

import {
    saveRehabilitationSession
} from "../services/rehabilitationApi";

import "../styles/TrackPage.css";


function TrackPage() {

    const webcamRef = useRef(null);

    const canvasRef = useRef(null);


    const isTrackingRef =
        useRef(false);

    const selectedExerciseRef =
        useRef("");


    const repCounterRef =
        useRef(null);


    const sessionStatsRef =
        useRef(
            createSessionStats()
        );


    const sessionStartTimeRef =
        useRef(null);


    const [angle, setAngle] =
        useState("--");


    const [score, setScore] =
        useState("");


    const [scoreColor, setScoreColor] =
        useState("#111827");


    const [selectedExercise, setSelectedExercise] =
        useState("");


    const [isTracking, setIsTracking] =
        useState(false);


    const [repCount, setRepCount] =
        useState(0);


    const [repAngle, setRepAngle] =
        useState("--");


    const [repScore, setRepScore] =
        useState("");


    const [repScoreColor, setRepScoreColor] =
        useState("#111827");


    const [showSummary, setShowSummary] =
        useState(false);


    const [sessionSummary, setSessionSummary] =
        useState(null);


    useEffect(() => {

        async function initialize() {

            try {

                const detector =
                    await loadPoseDetector();

                console.log(
                    "Pose Detector Loaded"
                );

                startDetection(detector);

            }
            catch (error) {

                console.error(error);

            }

        }


        initialize();

    }, []);


    function handleExerciseChange(event) {

        const value =
            event.target.value;


        setSelectedExercise(value);

        selectedExerciseRef.current =
            value;


        setAngle("--");

        setScore("");

        setScoreColor("#111827");


        setRepCount(0);

        setRepAngle("--");

        setRepScore("");

        setRepScoreColor("#111827");


        setSessionSummary(null);

        setShowSummary(false);


        if (isTrackingRef.current) {

            isTrackingRef.current =
                false;

            setIsTracking(false);

        }


        if (value) {

            const exercise =
                exercises.find(
                    item =>
                        item.id === value
                );


            if (exercise) {

                repCounterRef.current =
                    createRepCounter(
                        exercise.startAngle,
                        exercise.repThreshold,
                        exercise.direction
                    );

            }

        }
        else {

            repCounterRef.current =
                null;

        }

    }


    async function toggleTracking() {

        if (isTrackingRef.current) {

            isTrackingRef.current =
                false;

            setIsTracking(false);


            const selectedId =
                selectedExerciseRef.current;


            const exercise =
                exercises.find(
                    item =>
                        item.id === selectedId
                );


            if (!exercise) {

                return;

            }


            const stats =
                sessionStatsRef.current;


            const sessionSummaryData =
                getSessionSummary(
                    stats,
                    exercise.direction
                );


            setSessionSummary(
                sessionSummaryData
            );

            setShowSummary(true);


            const durationSeconds =
                sessionStartTimeRef.current
                    ? Math.floor(
                        (
                            Date.now() -
                            sessionStartTimeRef.current
                        ) / 1000
                    )
                    : 0;


            if (stats.totalReps > 0) {

                const sessionData = {

                    exerciseId:
                        exercise.id,

                    exerciseName:
                        exercise.name,

                    totalReps:
                        stats.totalReps,

                    goodReps:
                        stats.good,

                    mediumReps:
                        stats.medium,

                    lowReps:
                        stats.low,

                    bestAngle:
                        sessionSummaryData.bestStretch,

                    overallScore:
                        sessionSummaryData.overallScore,

                    durationSeconds:
                        durationSeconds

                };


                try {

                    const result =
                        await saveRehabilitationSession(
                            sessionData
                        );


                    console.log(
                        "Session saved successfully:",
                        result
                    );

                }
                catch (error) {

                    console.error(
                        "Failed to save rehabilitation session:",
                        error
                    );

                }

            }


            setAngle("--");

            setScore("");

            setScoreColor("#111827");


            setRepCount(0);

            setRepAngle("--");

            setRepScore("");

            setRepScoreColor("#111827");


            repCounterRef.current?.reset();

        }
        else {

            if (
                !selectedExerciseRef.current
            ) {

                return;

            }


            sessionStatsRef.current =
                createSessionStats();


            sessionStartTimeRef.current =
                Date.now();


            setSessionSummary(null);

            setShowSummary(false);


            repCounterRef.current?.reset();


            setRepCount(0);

            setRepAngle("--");

            setRepScore("");

            setRepScoreColor("#111827");


            setAngle("--");

            setScore("");

            setScoreColor("#111827");


            isTrackingRef.current =
                true;

            setIsTracking(true);

        }

    }


    function startDetection(detector) {

        function detect() {

            if (
                webcamRef.current &&
                webcamRef.current.video &&
                webcamRef.current.video.readyState === 4
            ) {

                const video =
                    webcamRef.current.video;


                const results =
                    detector.detectForVideo(
                        video,
                        performance.now()
                    );


                if (
                    results.landmarks.length > 0
                ) {

                    const landmarks =
                        results.landmarks[0];


                    if (
                        isTrackingRef.current
                    ) {

                        const selectedId =
                            selectedExerciseRef.current;


                        const exercise =
                            exercises.find(
                                item =>
                                    item.id === selectedId
                            );


                        if (exercise) {

                            const result =
                                exercise.evaluate(
                                    landmarks
                                );


                            if (result.detected) {

                                setAngle(
                                    result.angle.toFixed(1)
                                );


                                setScore(
                                    result.score
                                );


                                setScoreColor(
                                    result.color
                                );


                                const repResult =
                                    repCounterRef.current?.update(
                                        result.angle
                                    );


                                if (
                                    repResult?.completed
                                ) {

                                    console.log(
                                        "Repetition completed:",
                                        repResult.repCount
                                    );


                                    const completedAngle =
                                        repResult.angle;


                                    const completedResult =
                                        exercise.evaluateAngle(
                                            completedAngle
                                        );


                                    addRep(
                                        sessionStatsRef.current,
                                        completedAngle,
                                        completedResult.score
                                    );


                                    setRepCount(
                                        repResult.repCount
                                    );


                                    setRepAngle(
                                        completedAngle.toFixed(1)
                                    );


                                    setRepScore(
                                        completedResult.score
                                    );


                                    setRepScoreColor(
                                        completedResult.color
                                    );

                                }

                            }
                            else {

                                setAngle("--");


                                setScore(
                                    result.score
                                );


                                setScoreColor(
                                    result.color
                                );

                            }

                        }

                    }


                    const canvas =
                        canvasRef.current;


                    if (canvas) {

                        canvas.width =
                            video.videoWidth;

                        canvas.height =
                            video.videoHeight;


                        drawSkeleton(
                            canvas,
                            landmarks
                        );


                        drawLandmarks(
                            canvas,
                            landmarks
                        );

                    }

                }

            }


            requestAnimationFrame(
                detect
            );

        }


        detect();

    }


    return (

        <div className="track-container">

            <div className="camera-container">

                <WebcamView
                    ref={webcamRef}
                />

                <PoseCanvas
                    ref={canvasRef}
                />

            </div>


            <div className="exercise-card">

                <h3>
                    Exercise
                </h3>


                <p className="track-description">

                    Stand in front of the camera and
                    follow the exercise instructions.

                </p>


                <select
                    value={selectedExercise}
                    onChange={handleExerciseChange}
                    className="exercise-select"
                >

                    <option value="">
                        Choose Exercise
                    </option>


                    {exercises.map(
                        (exercise) => (

                            <option
                                key={exercise.id}
                                value={exercise.id}
                            >

                                {exercise.name}

                            </option>

                        )
                    )}

                </select>


                {selectedExercise && (

                    <>

                        <p>
                            {
                                exercises.find(
                                    exercise =>
                                        exercise.id ===
                                        selectedExercise
                                )?.name
                            }
                        </p>


                        <h2>
                            {angle}°
                        </h2>


                        <h2
                            style={{
                                color: scoreColor
                            }}
                        >
                            {score}
                        </h2>


                        <p>
                            Repetitions: {repCount}
                        </p>


                        {repCount > 0 && (

                            <>

                                <p>
                                    Last Rep Angle:
                                    {" "}
                                    {repAngle}°
                                </p>


                                <h2
                                    style={{
                                        color:
                                            repScoreColor
                                    }}
                                >
                                    {repScore}
                                </h2>

                            </>

                        )}

                    </>

                )}


                {showSummary &&
                    sessionSummary && (

                    <div className="session-summary">

                        <h3>
                            Session Summary
                        </h3>


                        <p>
                            Total Repetitions:
                            {" "}
                            {sessionSummary.totalReps}
                        </p>


                        <p>
                            Good:
                            {" "}
                            {sessionSummary.good}
                        </p>


                        <p>
                            Medium:
                            {" "}
                            {sessionSummary.medium}
                        </p>


                        <p>
                            Low:
                            {" "}
                            {sessionSummary.low}
                        </p>


                        <p>
                            Best Stretch:
                            {" "}
                            {sessionSummary.bestStretch.toFixed(1)}°
                        </p>


                        <h2>
                            Overall Score:
                            {" "}
                            {sessionSummary.overallScore}
                        </h2>

                    </div>

                )}


                <button
                    className="tracking-btn"
                    onClick={toggleTracking}
                    disabled={!selectedExercise}
                >

                    {isTracking
                        ? "Stop Tracking"
                        : "Start Tracking"
                    }

                </button>

            </div>

        </div>

    );

}


export default TrackPage;