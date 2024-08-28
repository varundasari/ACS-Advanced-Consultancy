const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./config/db');
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
    res.locals.isAuthenticated = req.session.user ? true : false;
    res.locals.userRole = req.session.user ? req.session.user.role : null; 
    next();
});

app.set('views', path.join(__dirname, '../src/views'));
app.set('view engine', 'ejs');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/campaigns', async (req, res) => {
    try {
        
        const [dynamicCampaigns] = await db.query('SELECT * FROM campaigns WHERE approved = 1');

        res.render('campaigns', { campaigns: dynamicCampaigns, isAuthenticated: req.isAuthenticated });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: err });
    }
});


app.get('/admin_approval', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/auth/login'); 
    }

    db.query('SELECT * FROM campaigns WHERE approved = 0')
        .then(([rows]) => {
            res.render('admin_approval', { campaigns: rows, isAuthenticated: true });
        })
        .catch(error => {
            console.error('Error fetching campaigns:', error);
            res.status(500).render('error', { error });
        });
});


app.post('/approve_campaign/:id', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/auth/login'); 
    }

    const campaignId = req.params.id;
    db.query('UPDATE campaigns SET approved = 1 WHERE id = ?', [campaignId])
        .then(() => {
            res.redirect('/admin_approval');
        })
        .catch(err => {
            console.error('Error approving campaign:', err);
            res.status(500).render('error', { error: err });
        });
});


app.post('/reject_campaign/:id', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/auth/login'); 
    }

    const campaignId = req.params.id;
    db.query('DELETE FROM campaigns WHERE id = ?', [campaignId])
        .then(() => {
            res.redirect('/admin_approval');
        })
        .catch(err => {
            console.error('Error rejecting campaign:', err);
            res.status(500).render('error', { error: err });
        });
});


app.get('/post_campaign', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login'); 
    }
    res.render('post_campaign');
});


app.post('/post_campaign', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login'); 
    }

    const { title, description, business } = req.body;

    try {
        const sql = 'INSERT INTO campaigns (title, description, business) VALUES (?, ?, ?)';
        await db.query(sql, [title, description, business]);
        res.redirect('/campaigns');
    } catch (err) {
        console.error('Error inserting campaign data:', err);
        res.status(500).render('error', { error: err });
    }
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


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).render('error', { error: err });
        }
        res.redirect('/');
    });
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
