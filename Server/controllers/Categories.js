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

        const allCategories = await Category.find({})
        console.log("All Categories: ", allCategories);

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
                                populate: "ratingAndReviews",
                            })
                            .exec();
        
        // validate the data
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "Data not found"
            })
        }

        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
            })
        }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
              ._id
        )
        .populate({
            path: "courses",
            match: { status: "Published" },
        })
        .exec()

           //console.log("Different COURSE", differentCategory)
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
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)

        // return res
        return res.status(200).json({
            success: true,
            message: "Category details fetched successfully",
            selectedCategory,
            differentCategory,
            mostSellingCourses
        })
                    
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error,
        })
    }
}