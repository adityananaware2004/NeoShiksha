const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({

    // few changes made in the code are:
    instructions: {
        // type: String,
        type: [String],

    },

    status: {
        type: String,
        enum: ["Draft", "Published"]
    },
    ///////////////////////////////////////
    
    courseName: {
        type: String,
        required: true,
    },
    courseDescription: {
        type: String,
        required: true,
        trim: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: "User",
    },
    whatYouWillLearn: {
        type: String,
    },
    // section ID is stored here
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview",
        }
    ],
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    tag: {
        type: [String],
        required: true,
    },
    studentsEnrolled: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    sold: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }


})

module.exports = mongoose.model('Course', courseSchema)