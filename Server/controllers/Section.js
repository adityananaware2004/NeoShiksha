const Course = require('../models/Course');
const Section = require('../models/Section');
const SubSection = require('../models/SubSection');


// create section

exports.createSection = async (req, res) => {
    try{
        // fetch the details
        const {sectionName, courseId} = req.body;

        // validate data
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // create section
        const newSection = await Section.create({sectionName});

        // update course with section id 
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                        courseId,
                                        {
                                            $push: {
                                                courseContent: newSection._id
                                            }
                                        },
                                        {new: true},
                                    )
        // HW: is to use populate the section & subSection details in the same updatedCourseDetails
                                    .populate({
                                        path: "courseContent",
                                        populate: {
                                            path: "subSection",
                                        },
                                    })
                                    .exec();

        // return res
        return res.status(200).json({
            success: true,
            message: 'Section created successfully',
            data: updatedCourseDetails,
            // updatedCourseDetails,
        })

    }catch(error){
        return res.status(500).json({
            error: error.message,
            success: false,
            message: 'Something went wrong while creating the section'
        })
    }
}


// update section

exports.updateSection = async (req, res) => {
    try{
        // fetch the details
        const {sectionName, sectionId, courseId} = req.body;

        // validate data
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new: true});

        const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

        // return res
        return res.status(200).json({
            success: true,
            message: 'Section updated successfully',
            data: course,
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while updating the section'
        })
    }
}

// delete section

// exports.deleteSection = async (req, res) => {
//     try{
//         // fetch the details
//         const {sectionId, courseId} = req.body;

//         //validate data
//         if(!sectionId || !courseId){
//             return res.status(400).json({
//                 success: false,
//                 message: 'Cannot fetch section ID',
//             })
//         }

//         const section = await Section.findById(sectionId);
// 		console.log(sectionId, courseId);

// 		if(!section) {
// 			return res.status(404).json({
// 				success:false,
// 				message:"Section not Found",
// 			})
// 		}

//         //delete sub section
// 		await SubSection.deleteMany({_id: {$in: section.subSection}});

// 		await Section.findByIdAndDelete(sectionId);
//         await Course.findByIdAndUpdate(courseId,
//             {$pull: {courseContent: sectionId}},
//             {new: true},
//         )
//         //find the updated course and return 
// 		const course = await Course.findById(courseId).populate({
// 			path:"courseContent",
// 			populate: {
// 				path: "subSection"
// 			}
// 		})
// 		.exec();

//         // TODO: do we need to delete it from the course schema
//         // await Course.findByIdAndDelete(courseId, 
//         //     {
//         //         $pull: {
//         //             courseContent: deleteSection._id
//         //         }
//         //     }
//         // )

//         // return res
//         return res.status(200).json({
//             success: true,
//             message: 'Section deleted successfully',
//         })

//     }catch(error){
//         return res.status(500).json({
//             error: error.message,
//             success: false,
//             message: 'Something went wrong while deleting the section'
//         })
//     }
// }


exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   