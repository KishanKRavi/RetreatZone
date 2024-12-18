const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = new Schema ({
    comment: String,
    ratings: {
        type: Number,
        min: 0,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref:"user",
    }
});

    module.exports = mongoose.model("Review", reviewSchema);