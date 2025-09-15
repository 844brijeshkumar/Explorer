const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const { signupForm, signup, loginForm, login, logout } = require("../controllers/users.js");

//signup and signup form route
router.route("/signup")
    .get(signupForm)
    .post(wrapAsync(signup));

//login and login form route
router.route("/login")
    .get(loginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login" , failureFlash: true }), login);

//logout route
router.get("/logout",logout);

module.exports=router;