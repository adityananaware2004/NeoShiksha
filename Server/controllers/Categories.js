const Category = require("../models/Category")
const { Mongoose } = require("mongoose");



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
