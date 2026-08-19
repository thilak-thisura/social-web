const express = require("express");

const router = express.Router();

const db = require("../db");

const authMiddleware = require("../middleware/authMiddleware");



router.post(
    "/",
    authMiddleware,
    (req, res) => {

        const senderId =
            Number(req.user.id);

        const receiverId =
            Number(req.body.receiver_id);

        const message =
            req.body.message;


        if (!senderId) {

            return res.status(401).json({
                message:
                    "Unauthorized user"
            });

        }


        if (!receiverId) {

            return res.status(400).json({
                message:
                    "Receiver ID is required"
            });

        }


        if (
            !message ||
            message.trim() === ""
        ) {

            return res.status(400).json({
                message:
                    "Message cannot be empty"
            });

        }


        if (
            senderId === receiverId
        ) {

            return res.status(400).json({
                message:
                    "You cannot send a message to yourself"
            });

        }


        const sql = `
            INSERT INTO messages
            (
                sender_id,
                receiver_id,
                message
            )
            VALUES (?, ?, ?)
        `;


        db.query(
            sql,
            [
                senderId,
                receiverId,
                message.trim()
            ],
            (err, result) => {

                if (err) {

                    console.error(
                        "Send message error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to send message"
                    });

                }


                const newMessage = {

                    id: result.insertId,

                    sender_id:
                        senderId,

                    receiver_id:
                        receiverId,

                    message:
                        message.trim(),

                    created_at:
                        new Date()

                };


                // Get Socket.IO
                const io =
                    req.app.get("io");


                // Send only to receiver
                io.to(
                    `user_${receiverId}`
                ).emit(
                    "receive_message",
                    newMessage
                );

                // Notify receiver that
                // unread message count may have changed
                io.to(
                    `user_${receiverId}`
                ).emit(
                    "new_message_notification"
                );


                res.status(201).json({

                    message:
                        "Message sent successfully",

                    data:
                        newMessage

                });

            }
        );

    }
);


// ==========================================
// GET CHAT LIST
// ==========================================

router.get(
    "/chats",
    authMiddleware,
    (req, res) => {

        const loggedInUserId =
            Number(req.user.id);


        if (!loggedInUserId) {

            return res.status(401).json({
                message: "Unauthorized user"
            });

        }


        const sql = `
            SELECT
                u.id,
                u.name,
                u.profile_picture,

                MAX(m.created_at) AS last_message_time

            FROM users u

            INNER JOIN messages m
                ON (
                    (
                        m.sender_id = ?
                        AND
                        m.receiver_id = u.id
                    )
                    OR
                    (
                        m.receiver_id = ?
                        AND
                        m.sender_id = u.id
                    )
                )

            WHERE u.id != ?

            GROUP BY
                u.id,
                u.name,
                u.profile_picture

            ORDER BY
                last_message_time DESC
        `;


        db.query(
            sql,
            [
                loggedInUserId,
                loggedInUserId,
                loggedInUserId
            ],
            (err, results) => {

                if (err) {

                    console.error(
                        "Get chat list error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to load chat list"
                    });

                }


                res.json(results);

            }
        );

    }
);


router.get(
    "/unread-count",
    authMiddleware,
    (req, res) => {

        const loggedInUserId =
            Number(req.user.id);


        if (!loggedInUserId) {

            return res.status(401).json({
                message:
                    "Unauthorized user"
            });

        }


        const sql = `
            SELECT COUNT(DISTINCT sender_id) AS unreadCount
            FROM messages
            WHERE receiver_id = ?
            AND is_read = FALSE
        `;


        db.query(
            sql,
            [loggedInUserId],
            (err, results) => {

                if (err) {

                    return res.status(500).json({
                        message:
                            "Failed to get unread message count"
                    });

                }


                res.json({
                    unreadCount:
                        results[0].unreadCount
                });

            }
        );

    }
);


// ==========================================
// MARK CHAT MESSAGES AS READ
// ==========================================

router.put(
    "/read/:otherUserId",
    authMiddleware,
    (req, res) => {

        const loggedInUserId =
            Number(req.user.id);

        const otherUserId =
            Number(req.params.otherUserId);


        if (
            !loggedInUserId ||
            !otherUserId
        ) {

            return res.status(400).json({
                message:
                    "Invalid user ID"
            });

        }


        if (
            loggedInUserId === otherUserId
        ) {

            return res.status(400).json({
                message:
                    "You cannot mark your own messages as read"
            });

        }


        const sql = `
            UPDATE messages

            SET is_read = TRUE

            WHERE sender_id = ?
            AND receiver_id = ?
            AND is_read = FALSE
        `;


        db.query(
            sql,
            [
                otherUserId,
                loggedInUserId
            ],
            (err, result) => {

                if (err) {

                    console.error(
                        "Mark messages as read error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to mark messages as read"
                    });

                }


                res.json({

                    message:
                        "Messages marked as read",

                    updatedCount:
                        result.affectedRows

                });

            }
        );

    }
);


router.get(
    "/:otherUserId",
    authMiddleware,
    (req, res) => {

        const loggedInUserId =
            Number(req.user.id);

        const otherUserId =
            Number(req.params.otherUserId);


        if (
            !loggedInUserId ||
            !otherUserId
        ) {

            return res.status(400).json({
                message: "Invalid user ID"
            });

        }


        const sql = `
            SELECT
                m.id,
                m.sender_id,
                m.receiver_id,
                m.message,
                m.created_at

            FROM messages m

            LEFT JOIN chat_clears cc
                ON cc.user_id = ?
                AND cc.other_user_id = ?

            WHERE

                (
                    (
                        m.sender_id = ?
                        AND
                        m.receiver_id = ?
                    )

                    OR

                    (
                        m.sender_id = ?
                        AND
                        m.receiver_id = ?
                    )
                )

                AND

                (
                    cc.cleared_at IS NULL
                    OR
                    m.created_at > cc.cleared_at
                )

            ORDER BY m.created_at ASC
        `;


        db.query(
            sql,
            [
                loggedInUserId,
                otherUserId,

                loggedInUserId,
                otherUserId,

                otherUserId,
                loggedInUserId
            ],
            (err, results) => {

                if (err) {

                    console.error(
                        "Get messages error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to load messages"
                    });

                }


                res.json(results);

            }
        );

    }
);


router.delete(
    "/chat/:otherUserId",
    authMiddleware,
    (req, res) => {

        const loggedInUserId =
            Number(req.user.id);

        const otherUserId =
            Number(req.params.otherUserId);


        if (!loggedInUserId || !otherUserId) {

            return res.status(400).json({
                message:
                    "Invalid user ID"
            });

        }


        if (
            loggedInUserId === otherUserId
        ) {

            return res.status(400).json({
                message:
                    "You cannot clear a chat with yourself"
            });

        }


        const sql = `
            INSERT INTO chat_clears
            (
                user_id,
                other_user_id,
                cleared_at
            )
            VALUES (?, ?, NOW())

            ON DUPLICATE KEY UPDATE
                cleared_at = NOW()
        `;


        db.query(
            sql,
            [
                loggedInUserId,
                otherUserId
            ],
            (err, result) => {

                if (err) {

                    console.error(
                        "Clear chat error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to clear chat"
                    });

                }


                res.json({

                    message:
                        "Chat cleared successfully"

                });

            }
        );

    }
);


module.exports = router;