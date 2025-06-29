
const Profile = require('../models/Profile');
const User = require('../models/User')
const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const mongoose = require('mongoose');
const {imageUploadToCloudinary} = require('../utils/imageUploader');
const {convertSecondsToDuration} = require('../utils/secToDuration');

exports.updateProfile = async (req, res) => {
    try{
        // get data & user id
        const {
            dateOfBirth, 
            about, 
            gender, 
            contactNumber
        } = req.body; 
        const id = req.existingUser.id;

        // validate data
        if(!gender || !contactNumber){
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            })
        }

        // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        // const profileDetails = await Profile.findById(profileId);

        const user = await Profile.findByIdAndUpdate(profileId, {
            dateOfBirth,
            gender,
            about,
            contactNumber
          },{new: true})
          // await user.save()

        // update profile
        // profileDetails.dateOfBirth = dateOfBirth;
        // profileDetails.about = about;
        // profileDetails.gender = gender;
        // profileDetails.contactNumber = contactNumber;
        // await profileDetails.save()

        // Find the updated user details
        const updatedUserDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec()

        // return res
        return res.status(200).json({
          success: true,
          message: 'Profile updated successfully',
          updatedUserDetails,
        })

    }catch(error){
        return res.status(500).json({
            message: error.message,
            success: false,
            // message: 'Something went wrong cannot update profile'
        })
    }
}


// delete profile
// Explore: how can we schedule this delete operation
exports.deleteProfile = async (req, res) => {
    try{
        // get user id
        const id = req.existingUser.id;
        const userDetails = await User.findById({_id: id})
        .populate({
          path: "courses",
          populate:{
            path: "instructor",
            path: "category",
          },
        }).exec()
        
        // validate
        if(!userDetails){
          console.log("UserDetails: ", userDetails)
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

      console.log(userDetails)

        //delete profile
        const deletedProfile = await Profile.findByIdAndDelete({_id: new mongoose.Types.ObjectId(userDetails.additionalDetails)});

        // TODO HW: unenroll student from all enrolled courses
        for (const courseId of userDetails.courses) {
            await Course.findByIdAndUpdate(
              courseId,
              { $pull: { studentsEnrolled: id } },
              { new: true }
            )
        }

        // delete user
        const deletedUser = await User.findByIdAndDelete({_id: id});

        // return response
        return res.status(200).json({
            success: true,
            message: 'Account deleted successfully',
            deletedProfile,
            deletedUser
        })

    }catch(error){
      console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong cannot delete account'
        })
    }
}

// get all user details

exports.getAllUserDetails = async (req, res) => {
    try{
        // get user id
        const id = req.existingUser.id;
        const userDetails = await User.findById(id).populate('additionalDetails').exec();

        // validate
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: 'Cannot get userDetails'
            })
        }

        console.log("User all info: ", userDetails);

        // return res
        return res.status(200).json({
          success: true,
          message: "All details of user got...",
          userDetails
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while getting all user details'
        })
    }
}

// update display picture
exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.existingUser.id
        const image = await imageUploadToCloudinary(
          displayPicture,
          process.env.FOLDER_NAME,
          1000,
          1000
        )
        console.log(image)
        const updatedProfile = await User.findByIdAndUpdate(
          { _id: userId },
          { image: image.secure_url },
          { new: true }
        )
        res.send({
          success: true,
          message: `Image Updated successfully`,
          data: updatedProfile,
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        })
      }

}

// get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.existingUser.id
        let userDetails = await User.findOne({
          _id: userId,
        })
          .populate({
            path: "courses",
            populate: {
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            },
          })
          .exec()
        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
          let totalDurationInSeconds = 0
          SubsectionLength = 0
          for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
              j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
              totalDurationInSeconds
            )
            SubsectionLength +=
              userDetails.courses[i].courseContent[j].subSection.length
          }
          let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
          })
          courseProgressCount = courseProgressCount?.completedVideos.length
          if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
              Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
              ) / multiplier
          }
        }
    
        if (!userDetails) {
          return res.status(400).json({
            success: false,
            message: `Could not find user with id: ${userDetails}`,
          })
        }
        return res.status(200).json({
          success: true,
          data: userDetails.courses,
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        })
      }
}

// instructor dashboard
exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructor: req.existingUser.id })
  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }