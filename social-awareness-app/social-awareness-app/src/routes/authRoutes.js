const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.get('/register', (req, res) => {
    res.render('register'); 
});


router.post('/register', authController.registerUser); 


router.get('/login', (req, res) => {
    res.render('login'); 
});


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


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Logout failed.');
        }
        res.redirect('/');
    });
});

module.exports = router;
