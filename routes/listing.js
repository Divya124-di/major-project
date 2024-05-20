if(process.env.NODE_ENV !== 'production') {
require("dotenv").config();
}
//console.log(process.env);

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware.js");
const multer = require( "multer" );
const {storage} = require("../cluoudConfig.js");  //cloudinary storage setup
const upload = multer({storage});

const ListingController = require("../controllers/listings.js");

//Index route
router.get("/", wrapAsync(ListingController.index));

//create and new route
router.get("/new",isLoggedIn, ListingController.renderNewForm);

//show route
router.get("/:id", wrapAsync(ListingController.showListing));

//create route
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(ListingController.createListing)
);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.renderEditForm)
);

//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(ListingController.updateListing)
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(ListingController.destroyListing)
);
module.exports = router;






    // if(!req.body.listing){
    //     throw new ExpressError(400 , "Invalid listings data");
    // }
    //    let result = listingSchema.validate(req.body);
    //    if(result.error){
    //     throw new ExpressError(404, "");
    //    }


      //  if (!newListing.description) {
    //    throw new ExpressError(400, "Invalid desc data");
    //  }
    //   if (!newListing.price) {
    //     throw new ExpressError(400, "Invalid price data");
    //   }


    // app.get("/listTesting", async (req, res)=> {
//     let sampleListing = new Listing({
//         title:"sample title",//this creates new document in database
//         description : "this is a description" ,
//         price : 345689, 
//        location: "odisha",
//        country: "India"                                                
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })