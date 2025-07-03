const express = require('express');
const router = express.Router();

const {authenticate} = require('../middlewares/auth')
const {
    updateProfile,
    deleteProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
} = require('../controllers/Profile')

// ******************************************************************************
//                     Profile routes
// ******************************************************************************

// route for updating user profile
router.put('/updateProfile', authenticate ,updateProfile);

// route for deleting user profile
router.delete('/deleteProfile', authenticate, deleteProfile);

// route for getting all user details
router.get('/getUserDetails', authenticate, getAllUserDetails);

// get enrolled courses
router.get('/getEnrolledCourses', authenticate, getEnrolledCourses);

// route for updating display picture
router.put('/updateDisplayPicture', authenticate, updateDisplayPicture);

// export the router
module.exports = router;