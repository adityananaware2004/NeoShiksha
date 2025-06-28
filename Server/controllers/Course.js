const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const { imageUploadToCloudinary } = require("../utils/imageUploader")







exports.createCourse = async (req, res) => {
  try {
    const{courseName, courseDescription, whatYouWillLearn, price, category,tag, status, instructions} = req.body;

    const thumbnail = req.files.thumbnailImage;
    console.log("Thumbnail in course creation is", thumbnail)
    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !status || !instructions) {
        return res.status(400).json({
            success:false,
            message:'All fields are required',
        });
    }

    const instructorId = req.existingUser.id;

    const categoryDetails = await Category.findById(category);
    if(!categoryDetails) {
        return res.status(404).json({
            success:false,
            message:'Category Details not found',
        });
    }

    const thumbnailImage = await imageUploadToCloudinary(thumbnail,process.env.FOLDER_NAME);

    const newCourse = await Course.create({
        courseName,
        courseDescription:courseDescription,
        whatYouWillLearn,
        price,
        thumbnail:thumbnailImage.secure_url,
        category,
        instructor:instructorId,
        tag,
        status,
        instructions
    })

    await Category.findByIdAndUpdate(category,
        {
            $push: {
                courses: newCourse._id
            }
        })

    await User.findByIdAndUpdate(instructorId, {
        $push: {
            courses: newCourse._id
        }})
        
    return res.status(200).json({
        success:true,
        message:'Course created successfully',
        data: newCourse
    })    
} catch (error) {
    console.error(error);
    return res.status(500).json({
        success:false,
        message:'Failed to create Course',
        error: error.message,
    })
}
}

// get all courses

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}