const express = require('express');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000;


app.use(session({
    secret: 'secret-key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../src/public')));


app.use((req, res, next) => {
    console.log('Middleware - isAuthenticated:', req.session.isAuthenticated); 
    res.locals.isAuthenticated = req.session.isAuthenticated || false;
    next();
});


app.set('views', path.join(__dirname, '../src/views'));
app.set('view engine', 'ejs');


app.use('/auth', authRoutes);
app.use('/user', userRoutes);


app.get('/', (req, res) => {
    console.log('Root route - isAuthenticated:', res.locals.isAuthenticated); 
    res.render('index');
});


app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/campaigns', (req, res) => {
    res.render('campaigns');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/contact', (req, res) => {
    res.send('Contact form submitted');
});

app.get('/privacy', (req, res) => {
    res.render('privacy');
});

app.get('/terms', (req, res) => {
    res.render('terms');
});

app.get('/reset_password', (req, res) => {
    res.render('reset_password');
});


app.use((req, res, next) => {
    res.status(404).render('404');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: err });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
