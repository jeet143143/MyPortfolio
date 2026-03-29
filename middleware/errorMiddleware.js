const errorHandler = (err, req, res, next) => {
    console.error("SERVER ERROR:", err.stack);
    const status = err.status || 500;
    
    if(req.originalUrl.startsWith('/api')) {
        res.status(status).json({ success: false, error: err.message || 'Server Error' });
    } else {
        res.status(status).render('404', { title: 'Server Error', message: 'Internal logic disruption detected.' });
    }
};

module.exports = errorHandler;
