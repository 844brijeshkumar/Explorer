const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js")
const MONGO_URL = "mongodb://127.0.0.1:27017/Explorer";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


//root Route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

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
  console.log("server is listening to port 8080");
});