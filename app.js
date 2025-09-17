if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expressError.js");

const listingRoute = require("./routes/listings.js");
const reviewRoute = require("./routes/reviews.js");
const userRoute = require("./routes/users.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const atlasURL = process.env.ATLAS_DB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(atlasURL);
}

app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));


const sessionOption = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 1000*60*60*24*7,
    maxAge: 1000*60*60*24*7,
    httpOnly: true,
  },
};



//using session ad flash
app.use(session(sessionOption));
app.use(flash());

//use for initializing and session
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware for Flash
app.use((req,res,next)=>{
  res.locals.success= req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser=req.user;
  next();
});


//Routes
app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",userRoute);


// All routes Expect created routes
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//Middleware
app.use((err,req,res,next)=>{
  let {statusCode= 500 ,message ="something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
});

//Starting Server
app.listen(4444, () => {
  console.log("server is listening to port 4444");
});