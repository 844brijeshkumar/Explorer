const User = require("../models/user.js");

module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        let registerUser =await User.register(newUser,password);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Explorer!");
            res.redirect("/listings");
        })
    }catch (e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to Explorer");
    let redirectUrl = res.locals.redirectURL || "/listings";
    delete req.session.redirectUrl; // Clean up the session variable
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
};