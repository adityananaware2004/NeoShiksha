const express = require('express');
const router = express.Router();

// import the course controllers
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getTopSellingCourses,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
} = require('../controllers/Course')

// import the category controllers

const {
    createCategories, 
    showAllCategories,
    categoryPageDetails,
} = require('../controllers/Categories')

// import the section controllers
const {
    createSection,
    updateSection,
    deleteSection,
} = require('../controllers/Section')

// import the subSection controllers
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require('../controllers/SubSection')

// import the rating controllers
const {
    createRating,
    getAverageRating,
    getAllRatingAndReview,
} = require('../controllers/RatingAndReview')


// importing the middleware
const {authenticate, isAdmin, isInstructor, isStudent} = require('../middlewares/auth')

// ******************************************************************************
//                     Course routes
// ******************************************************************************


router.post("/getFullCourseDetails", authenticate, getFullCourseDetails);
router.get("/getInstructorCourses", authenticate, isInstructor, getInstructorCourses);
router.delete("/deleteCourse", deleteCourse);
// router.get("/getTopSellingCourses", getTopSellingCourses);

// route for creating a course, can only be created by an instructor
router.post('/createCourse', authenticate, isInstructor, createCourse);

// route to edit course
router.post("/editCourse", authenticate, isInstructor, editCourse);

// route for add section to course
router.post('/addSection', authenticate, isInstructor, createSection);

// update section
router.post('/updateSection', authenticate, isInstructor, updateSection);

// delete section
router.post('/deleteSection', authenticate, isInstructor, deleteSection);

// route for add subsection to section
router.post('/addSubSection', authenticate, isInstructor, createSubSection);

// update subsection
router.post('/updateSubSection', authenticate, isInstructor, updateSubSection);

// delete subsection
router.post('/deleteSubSection', authenticate, isInstructor, deleteSubSection);

// get all registered courses
router.get('/getAllCourses', getAllCourses);

// get course details
router.post('/getCourseDetails', getCourseDetails);

// ************************************************************************************
//                        Categories routes
// ************************************************************************************
// category can only be created by admin

// route for creating a category
router.post('/createCategory', authenticate, isAdmin, createCategories);

// get all categories
router.get('/showAllCategories', showAllCategories);

// get category page details
router.post('/getCategoryPageDetails', categoryPageDetails);


// ******************************************************************************
//                     Rating and review routes
// ******************************************************************************

// route for creating a rating and review
router.post('/createRating', authenticate, isStudent, createRating);

// get average rating of a course
router.get('/getAverageRating', getAverageRating);

// get all rating and reviews of a course
router.get('/getReviews', getAllRatingAndReview);

module.exports = router;
