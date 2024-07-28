const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for GET /auth/register
router.get('/register', (req, res) => {
    res.render('register'); // Ensure 'register.ejs' exists in the views directory
});

// Route for POST /auth/register
router.post('/register', authController.registerUser); // Ensure 'registerUser' function is defined in authController

// Route for GET /auth/login
router.get('/login', (req, res) => {
    res.render('login'); // Ensure 'login.ejs' exists in the views directory
});

// Route for POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const user = await authController.loginUser(req, res);
        if (user) {
            req.session.isAuthenticated = true;
            req.session.user = user;
            return res.redirect('/');
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('login', { error: 'Login failed. Please try again.' });
    }
});

// Route for GET /auth/logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Logout failed.');
        }
        res.redirect('/');
    });
});

module.exports = router;
