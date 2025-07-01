const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');

// createReating
exports.createRating = async (req, res) => {
    try{
        // get userId
        const {userId} = req.existingUser.id;
        // get courseId, rating, review
        const {courseId, rating, review} = req.body;

        // check if user is enrolled in the course or not
        const courseDetails = await Course.findOne(
            {_id: courseId, studentsEnrolled: {$elemMatch: {$eq: userId}}}
        )

        // if not enrolled
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: "You are not enrolled in this course"
            })
        }

        // check user is not already rated
        const alreadyRated = await RatingAndReview.findOne(
            {courseId, userId}
        )

        // if already rated
        if(alreadyRated){
            return res.status(400).json({
                success: false,
                message: "You have already rated this course"
            })
        }

        // create rating and review
        const ratingAndReview = await RatingAndReview.create({
            course: courseId,
            user: userId,
            rating,
            review
        })

        // add rating and review to course
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {$push: {ratingAndReviews: ratingAndReview._id}},
            {new: true}
        )

        console.log(updatedCourseDetails)

        // return res
        return res.status(200).json({
            success: true,
            message: "Rating and review added successfully",
            ratingAndReview
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to add rating and review",
            error: error.message
        })
    }
}

// getAverageRating
exports.getAverageRating = async (req, res) => {
    try{
        // get courseId
        const {courseId} = req.body.courseId;
        
        // get average rating
        const averageRating = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId)
                },
            },
            {
                $group:{
                    _id: null,
                    averageRating: {$avg: "$rating"}
                }
            }
        ])

        // if rating review exists
        if(averageRating.length > 0){
            return res.status(200).json({
                success: true,
                message: "Average rating fetched successfully",
                averageRating: averageRating[0].averageRating
            })
        }

        // if rating review does not exists
        return res.status(200).json({
            success: true,
            message: "No rating and review found",
            averageRating: 0
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to get average rating",
            error: error.message
        })
    }
}


// getAllRatingAndReview
exports.getAllRatingAndReview = async (req, res) => {
    try{
        const allReviews = await RatingAndReview.find({})
                            .sort({rating: "desc"}) 
                            .populate({
                                path: "user",
                                select: "firstName lastName email image"
                            })  
                            .populate({
                                path: "course",
                                select: "courseName"
                            }) 
                            .exec();
        
        // return res
        return res.status(200).json({
            success: true,
            message: "All rating and review fetched successfully",
            data: allReviews
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to get all rating and review",
            error: error.message
        })
    }
}