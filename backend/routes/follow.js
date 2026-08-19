const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/', (req, res) => {

    const { followerId, followingId } = req.body;

    if (followerId == followingId) {
        return res.status(400).json({
            message: 'You cannot follow yourself'
        });
    }

    const checkSql = `
        SELECT *
        FROM followers
        WHERE follower_id = ?
        AND following_id = ?
    `;

    db.query(
        checkSql,
        [followerId, followingId],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: 'Already following this user'
                });
            }

            const insertSql = `
                INSERT INTO followers
                (
                    follower_id,
                    following_id
                )
                VALUES (?, ?)
            `;

            db.query(
                insertSql,
                [followerId, followingId],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.status(201).json({
                        message: 'Followed successfully',
                        isFollowing: true
                    });

                }
            );

        }
    );

});



router.delete('/', (req, res) => {

    const { followerId, followingId } = req.body;

    const deleteSql = `
        DELETE FROM followers
        WHERE follower_id = ?
        AND following_id = ?
    `;

    db.query(
        deleteSql,
        [followerId, followingId],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Follow relationship not found'
                });
            }

            res.json({
                message: 'Unfollowed successfully',
                isFollowing: false
            });

        }
    );

});


module.exports = router;