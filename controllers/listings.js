const Listing = require("../models/listing.js"); 
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.index = async (req, res) => { 
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ 
            path: "review", 
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "The listing you requested does not exist.");
        return res.redirect("/listings");
    }

    const axios = require('axios');
    require("dotenv").config();

    const getCoordinatesFromAddress = async (address) => {
        const apiKey = 'tG7FJD4ql58zMQTe51Gc1CeG0c49LPS8'; 
        const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${apiKey}`;
    
        try {
            const response = await axios.get(url);
            if (response.data.results && response.data.results.length > 0) {
                const location = response.data.results[0].position;
                return location; // Returns { lat: xx.xxxxx, lon: yy.yyyyy }
            } else {
                console.log("No results found for this address.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error.message);
            return null;
        }
    };


    // Wait for coordinates to be retrieved before rendering
    let coordinates = await getCoordinatesFromAddress(listing.location,listing.country);
    coordinates = `${coordinates.lon},${coordinates.lat}`;

    console.log(coordinates)
    // Ensure that the coordinates are passed to the template
    res.render("listings/show.ejs", { listing, coordinates });
};


module.exports.createListing = (async (req, res, next) => {
    let url, filename;
    if (req.file) {
        url = req.file.path;
        filename = req.file.filename;
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };    
    await newListing.save();
    req.flash("success", "Successfully Created ,scroll to see !!");
    res.redirect("/listings");
});

module.exports.renderEditForm = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "The listing does not exist.");
        return res.redirect("/listings"); // Add `return` to stop further execution
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
});

module.exports.updateListing = (async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        let url = req.file.path; 
        let filename = req.file.filename;  
        listing.image = { url, filename };
        await listing.save();    
    }

    req.flash("success", "Update was Successfull !!");
    res.redirect(`/listings/${id}`);
});

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted !");
    res.redirect("/listings");
};
