const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const { index, newForm, showListing, createListing, editForm, update, destroy } = require("../controllers/listings.js");


//Index Route & Create Route 
router.route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn, validateListing, wrapAsync(createListing));

//New Route
router.get("/new", isLoggedIn, newForm);

//Show Route & Update Route & Delete Route
router.route("/:id")
    .get(wrapAsync(showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(update))
    .delete(isLoggedIn, isOwner, wrapAsync(destroy));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, validateListing, wrapAsync(editForm));

module.exports = router;