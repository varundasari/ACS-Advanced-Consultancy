const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User with this email or username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        
        return res.status(201).json({ message: 'User registered successfully. Please log in.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};


exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return { error: 'Invalid username.' };
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { error: 'Invalid password.' };
        }

        req.session.user = user;  
        return { user };
    } catch (error) {
        console.error(error);
        return { error: 'Server error.' };
    }
};
