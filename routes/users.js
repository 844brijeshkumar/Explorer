const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const { signupForm, signup, loginForm, login } = require("../controllers/users.js");

//signup and signup form route
router.route("/signup")
    .get(signupForm)
    .post(wrapAsync(signup));

//login and login form route
router.route("/login")
    .get(loginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login" , failureFlash: true }), login);

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