const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError=require("./utils/expressError");
const {listingSchema,reviewSchema} = require("./schema");


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



module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Cannot find that review!");
        return res.redirect("/listings");
    }
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//serverside validate schema error for Listing
module.exports.validateListing = (req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};

//serverside validate schema error for Reviews
module.exports.validateReview = (req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
};

