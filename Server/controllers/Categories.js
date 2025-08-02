const Category = require("../models/Category")
const { Mongoose } = require("mongoose");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

// tag handler
exports.createCategories = async (req, res) => {
    try{

        // fetch the data
        const {name, description} = req.body;

        // validate the data
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // create entry in db
        const addCategory = await Category.create({
            name: name,
            description: description,
        })

        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        })        

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// getAllCategories handler

exports.showAllCategories = async (req, res) => {
    try{
        let allCategories = await Category.find({})
        // Deduplicate categories by name (case-insensitive)
        const seen = new Set();
        allCategories = allCategories.filter(cat => {
            const name = cat.name.trim().toLowerCase();
            if (seen.has(name)) return false;
            seen.add(name);
            return true;
        });
        return res.status(200).json({
            success: true,
            message: "Recevied all Categories",
            data: allCategories,
        }) 
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// categoryPageDetails handler

exports.categoryPageDetails = async (req, res) => {
    try{
        // get courseId
        const {categoryId} = req.body;
        //get all courses of this category
        console.log("categoryId received:", categoryId);
        const selectedCategory = await Category.findById(categoryId)
                                .populate({
                                    path: "courses",
                                    match: { status: "Published" },
                                    populate: [
                                        "ratingAndReviews",
                                        {
                                            path: "instructor",
                                            select: "firstName lastName email image"
                                        }
                                    ],
                                })
                                .exec();
        // validate the data
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }
        // If no courses found in category.courses array, try to find courses by category field
        let courses = selectedCategory.courses;
        if (courses.length === 0) {
            // Find courses that have this category as their category field
            const Course = require('../models/Course');
            const coursesByCategory = await Course.find({
                category: categoryId,
                status: "Published"
            }).populate([
                "ratingAndReviews",
                {
                    path: "instructor",
                    select: "firstName lastName email image"
                }
            ]);
            courses = coursesByCategory;
        }
        // Deduplicate courses by _id
        const uniqueCoursesMap = new Map();
        for (const course of courses) {
            uniqueCoursesMap.set(String(course._id), course);
        }
        const uniqueCourses = Array.from(uniqueCoursesMap.values());
        // Handle the case when there are no courses - return 200 with empty array
        if (uniqueCourses.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(200).json({
                success: true,
                message: "Category details fetched successfully",
                selectedCategory: {
                    ...selectedCategory.toObject(),
                    courses: []
                },
                differentCategory: null,
                mostSellingCourses: []
            })
        }
        // Update selectedCategory with the found unique courses
        selectedCategory.courses = uniqueCourses;

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })

        let differentCategory = null;
        if (categoriesExceptSelected.length > 0) {
            differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
              ._id
        )
        .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
                path: "instructor",
                select: "firstName lastName email image"
            }
        })
        .exec()
        }

        // Get top-selling courses across all categories
        const allCategories = await Category.find()
        .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
            path: "instructor",
        },
        })
        .exec()

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 10)

        // return res
        return res.status(200).json({
            success: true,
            message: "Category details fetched successfully",
            selectedCategory,
            differentCategory,
            mostSellingCourses
        })
                    
    }catch(error){
        console.error("Category page details error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}