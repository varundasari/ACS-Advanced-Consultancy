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
        const { user, error } = await authController.loginUser(req, res);

        if (error) {
            return res.status(400).render('login', { error });
        }

        req.session.isAuthenticated = true;
        req.session.user = user;
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).render('login', { error: 'Login failed. Please try again.' });
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
