const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register-admin', async (req, res) => {

    try {

        const {
            name,
            email,
            password,
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
                    email,
                    password,
                    role_type
                )
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [
                    name,
                    email,
                    hashedPassword,
                    'admin'
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


router.post('/login', (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {

            return res.status(400).json({
                message: 'User Not Found'
            });

        }

        const user = result[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: 'Incorrect Password'
            });

        }

        const token = jwt.sign(

            {
                id: user.id,
                email: user.email,
                role_type: user.role_type
            },

            process.env.JWT_SECRET,

            {
                expiresIn: '7d',
            }

        );

        delete user.password;

        res.json({

            message: 'Login Successful',

            token,

            user,

        });

    });

});

module.exports = router;
