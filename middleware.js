

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Store the URL they are trying to access
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
};

// In a middleware file, e.g., middleware.js

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectURL = req.session.redirectUrl;
    } else {
        // If there's no redirectUrl, set a default
        res.locals.redirectURL = "/listings"; 
    }
    next();
};