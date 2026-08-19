const bcrypt = require('bcrypt');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');

const express = require('express');
const router = express.Router();
const db = require('../db');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const uploadPath = 'uploads/profile';

        if (!fs.existsSync(uploadPath)) {

            fs.mkdirSync(uploadPath, {
                recursive: true
            });

        }

        cb(null, uploadPath);

    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname);

        const filename =
            `profile-${req.user.id}-${Date.now()}${extension}`;

        cb(null, filename);

    }

});


const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error('Only image files are allowed'), false);

    }

};


const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});

router.post('/', verifyToken, verifyAdmin, async (req, res) => {

    try {

        const {
            name,
            role,
            designation,
            email,
            password,
            location,
            profile_picture,
        } = req.body;

        const checkSql = `
            SELECT *
            FROM users
            WHERE email = ?
        `;

        db.query(checkSql, [email], async (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length > 0) {

                return res.status(400).json({
                    message: 'Email already exists',
                });

            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const insertSql = `
                INSERT INTO users
                (
                    name,
                    role,
                    designation,
                    email,
                    password,
                    location,
                    profile_picture,
                    role_type
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [
                    name,
                    role,
                    designation,
                    email,
                    hashedPassword,
                    location,
                    profile_picture,
                    'user'
                ],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.status(201).json({
                        message: 'User Registered Successfully',
                    });

                }
            );

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error',
        });

    }

});


router.get(
    '/',
    verifyToken,
    verifyAdmin,
    (req, res) => {

        const sql = `
            SELECT
                id,
                name,
                role,
                designation,
                email,
                location,
                profile_picture,
                role_type
            FROM users
            ORDER BY id DESC
        `;

        db.query(sql, (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: 'Database Error'
                });
            }

            res.json(results);

        });

    }
);

router.get('/:loggedInUserId', (req, res) => {

    const loggedInUserId = Number(req.params.loggedInUserId);

    const userQuery = `
        SELECT
            id,
            name,
            role,
            designation,
            profile_picture,
            location,
            about,
            education,
            email
        FROM users
        WHERE id != ?
    `;

    db.query(userQuery, [loggedInUserId], (err, users) => {

        if (err) {
            return res.status(500).json(err);
        }

        const skillQuery = `
            SELECT *
            FROM skills
        `;

        db.query(skillQuery, (err, skills) => {

            if (err) {
                return res.status(500).json(err);
            }

            const experienceQuery = `
                SELECT *
                FROM experience
            `;

            db.query(experienceQuery, (err, experiences) => {

                if (err) {
                    return res.status(500).json(err);
                }

                const followerQuery = `
                    SELECT *
                    FROM followers
                `;

                db.query(followerQuery, (err, followers) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    const finalUsers = users.map(user => {

                        const followerCount = followers.filter(
                            follower => follower.following_id === user.id
                        ).length;

                        const followingCount = followers.filter(
                            follower => follower.follower_id === user.id
                        ).length;

                        const isFollowing = followers.some(
                            follower =>
                                follower.follower_id === loggedInUserId &&
                                follower.following_id === user.id
                        );

                        return {

                            ...user,

                            followers: followerCount,

                            following: followingCount,

                            isFollowing,

                            skills: skills
                                .filter(skill => skill.user_id === user.id)
                                .map(skill => skill.skill_name),

                            experience: experiences
                                .filter(exp => exp.user_id === user.id)
                                .map(exp => ({
                                    company: exp.company,
                                    role: exp.role,
                                    duration: exp.duration,
                                }))

                        };

                    });

                    res.json(finalUsers);

                });

            });

        });

    });

});


router.put(
    '/profile-picture',
    verifyToken,
    (req, res) => {

        upload.single('profile_picture')(
            req,
            res,
            (err) => {

                if (err) {
                    return res.status(400).json({
                        message: err.message
                    });
                }

                try {

                    if (!req.file) {
                        return res.status(400).json({
                            message: "Profile image is required"
                        });
                    }

                    const userId = req.user.id;

                    const imageUrl =
                        `/uploads/profile/${req.file.filename}`;

                    const sql = `
                        UPDATE users
                        SET profile_picture = ?
                        WHERE id = ?
                    `;

                    db.query(
                        sql,
                        [
                            imageUrl,
                            userId
                        ],
                        (err, result) => {

                            if (err) {
                                return res.status(500).json({
                                    message: "Database error"
                                });
                            }

                            return res.status(200).json({
                                message:
                                    "Profile picture updated successfully",

                                profile_picture:
                                    imageUrl
                            });

                        }
                    );

                } catch (error) {

                    return res.status(500).json({
                        message: error.message
                    });

                }

            }
        );

    }
);


router.put('/:id', verifyToken, (req, res) => {

    const userId = Number(req.params.id);
    const loggedInUserId = req.user.id;

    if (loggedInUserId !== userId) {
        return res.status(403).json({
            message: 'You are not authorized to update this profile'
        });
    }

    const {
        about,
        education,
        skills = [],
        experience = []
    } = req.body;

    const updateUserSql = `
        UPDATE users
        SET
            about = ?,
            education = ?
        WHERE id = ?
    `;

    db.query(
        updateUserSql,
        [about, education, userId],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            db.query(
                'DELETE FROM skills WHERE user_id = ?',
                [userId],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    const insertSkills = (callback) => {

                        if (skills.length === 0) {
                            return callback();
                        }

                        const skillValues = skills.map(skill => [
                            userId,
                            skill
                        ]);

                        db.query(
                            `
                            INSERT INTO skills
                            (
                                user_id,
                                skill_name
                            )
                            VALUES ?
                            `,
                            [skillValues],
                            (err) => {

                                if (err) {
                                    return res.status(500).json(err);
                                }

                                callback();

                            }
                        );

                    };

                    insertSkills(() => {

                        db.query(
                            'DELETE FROM experience WHERE user_id = ?',
                            [userId],
                            (err) => {

                                if (err) {
                                    return res.status(500).json(err);
                                }

                                if (experience.length === 0) {

                                    return res.json({
                                        message: 'Profile updated successfully'
                                    });

                                }

                                const experienceValues = experience.map(exp => [
                                    userId,
                                    exp.company,
                                    exp.role,
                                    exp.duration
                                ]);

                                db.query(
                                    `
                                    INSERT INTO experience
                                    (
                                        user_id,
                                        company,
                                        role,
                                        duration
                                    )
                                    VALUES ?
                                    `,
                                    [experienceValues],
                                    (err) => {

                                        if (err) {
                                            return res.status(500).json(err);
                                        }

                                        res.json({
                                            message: 'Profile updated successfully'
                                        });

                                    }
                                );

                            }
                        );

                    });

                }
            );

        }
    );

});

module.exports = router;