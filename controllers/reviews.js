const Review = require("../models/review");
const Listing = require("../models/listing"); 

module.exports.createReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    console.log(newReview+"this is the review")
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();

    await req.flash("success", "Your Review Created!");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}})  
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review got deleted successfully");
    res.redirect(`/listings/${id}`);
};