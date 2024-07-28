// Middleware to set authentication status
app.use((req, res, next) => {
    console.log('Middleware - isAuthenticated:', req.session.isAuthenticated); // Debugging log
    res.locals.isAuthenticated = req.session.isAuthenticated || false;
    next();
});
