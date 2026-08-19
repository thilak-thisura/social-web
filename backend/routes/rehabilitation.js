const express = require("express");

const router = express.Router();

const db = require("../db");

const jwt = require("jsonwebtoken");

const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');

router.post("/sessions", async (req, res) => {

    try {

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({
                message: "Authorization token required"
            });

        }


        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({
                message: "Invalid authorization token"
            });

        }


        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        const userId =
            decoded.id;


        const {
            exerciseId,
            exerciseName,
            totalReps,
            goodReps,
            mediumReps,
            lowReps,
            bestAngle,
            overallScore,
            durationSeconds
        } = req.body;


        if (!exerciseId || !exerciseName) {

            return res.status(400).json({
                message: "Exercise information is required"
            });

        }


        const query = `
            INSERT INTO rehabilitation_sessions
            (
                user_id,
                exercise_id,
                exercise_name,
                total_reps,
                good_reps,
                medium_reps,
                low_reps,
                best_angle,
                overall_score,
                duration_seconds
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;


        const values = [

            userId,

            exerciseId,

            exerciseName,

            totalReps || 0,

            goodReps || 0,

            mediumReps || 0,

            lowReps || 0,

            bestAngle || null,

            overallScore || null,

            durationSeconds || 0

        ];


        const [result] =
            await db.execute(
                query,
                values
            );


        res.status(201).json({

            message:
                "Rehabilitation session saved successfully",

            sessionId:
                result.insertId

        });

    }
    catch (error) {

        console.error(
            "Save rehabilitation session error:",
            error
        );


        if (
            error.name ===
            "JsonWebTokenError"
        ) {

            return res.status(401).json({
                message: "Invalid token"
            });

        }


        if (
            error.name ===
            "TokenExpiredError"
        ) {

            return res.status(401).json({
                message: "Token expired"
            });

        }


        res.status(500).json({

            message:
                "Failed to save rehabilitation session"

        });

    }

});

router.get(
    "/user/:userId",
    verifyToken,
    verifyAdmin,
    (req, res) => {

        const userId =
            Number(req.params.userId);

        if (!userId) {

            return res.status(400).json({
                message: "Invalid user ID"
            });

        }

        const sql = `
            SELECT
                id,
                user_id,
                exercise_id,
                exercise_name,
                total_reps,
                good_reps,
                medium_reps,
                low_reps,
                best_angle,
                overall_score,
                duration_seconds,
                created_at
            FROM rehabilitation_sessions
            WHERE user_id = ?
            ORDER BY created_at DESC
        `;

        db.query(
            sql,
            [userId],
            (err, results) => {

                if (err) {

                    console.error(
                        "Database error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to get rehabilitation history"
                    });

                }

                res.json(results);

            }
        );

    }
);

module.exports = router;