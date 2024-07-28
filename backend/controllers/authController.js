const bcrypt = require('bcryptjs');
const db = require('../config/db'); 


exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
        if (rows.length > 0) {
            return res.status(400).send('User with this email or username already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.promise().query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};


exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(400).send('Invalid username.');
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password.');
        }

        return user; 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};
