app.use((req, res, next) => {
    console.log('Middleware - isAuthenticated:', req.session.isAuthenticated); 
    res.locals.isAuthenticated = req.session.isAuthenticated || false;
    next();
});
