const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",
    wrapAsync(async(req,res,next)=>{
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
            console.log(registerUser);
        })
    }catch (e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
})
);

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {failureRedirect: "/login" , failureFlash: true }),
    async(req,res)=>{
        req.flash("success","Welcome to Explorer");
        let redirectUrl = res.locals.redirectURL || "/listings";
        delete req.session.redirectUrl; // Clean up the session variable
        res.redirect(redirectUrl);

});

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
});


module.exports=router;