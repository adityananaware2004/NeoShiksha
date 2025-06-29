const SubSection = require('../models/SubSection')
const Section = require('../models/Section');
const {imageUploadToCloudinary} = require('../utils/imageUploader');
const express = require('express');

exports.createSubSection = async (req, res) => {
    try{
        // fetch data 
        const {sectionId, title, description, timeDuration} = req.body;

        // fetch video file
        const video = req.files.videoFile;
        // console.log(video)
        // validate the data
        if(!sectionId || !title || !description || !timeDuration || !video){
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // upload file to cloudinary
        // console.log(process.env.FOLDER_NAME)
        const uploadDetails = await imageUploadToCloudinary(video, process.env.FOLDER_NAME);
      
        if(!uploadDetails){
            return res.status(400).json({
                success: false,
                message: 'Cannot upload video'
            })
        }

        // create subSection
        const sub_section = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.timeDuration}`,
            description: description, 
            videoUrl: uploadDetails.secure_url,
        })

        // update section with sub-section ID
        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $push: {
                    subSection: sub_section._id
                }   
            },
            {new: true},
        ).populate('subSection').exec();
        // HW: log updated section here, after adding populate query

        return res.status(200).json({
            success: true,
            message: 'Sub-section created successfully',
            data: updatedSection
        })

    }catch(error){
      console.error(error)
      return res.status(500).json({
          error: error.message,
          success: false,
          // message: 'Something went wrong while creating the sub-section'
      })
    }
}


// HW: update sub-section

exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)
    
        if (!subSection) {
          return res.status(404).json({
            success: false,
            message: "SubSection not found",
          })
        }
    
        if (title !== undefined) {
          subSection.title = title
        }
    
        if (description !== undefined) {
          subSection.description = description
        }
        if (req.files && req.files.videoFile !== undefined) {
          const video = req.files.videoFile
          const uploadDetails = await imageUploadToCloudinary(
            video,
            process.env.FOLDER_NAME
          )
          subSection.videoUrl = uploadDetails.secure_url
          subSection.timeDuration = `${uploadDetails.duration}`
        }
    
        await subSection.save()
    
        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
          "subSection"
        )
    
        console.log("updated section", updatedSection)
    
        return res.status(200).json({
          success: true,
          message: "Section updated successfully",
          data: updatedSection,
        })
      } catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "An error occurred while updating the section",
        })
      }
}

// HW: delete sub-section
exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
          { _id: sectionId },
          {
            $pull: {
              subSection: subSectionId,
            },
          }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
    
        if (!subSection) {
          return res
            .status(404)
            .json({ success: false, message: "SubSection not found" })
        }
    
        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
          "subSection"
        )
    
        return res.json({
          success: true,
          message: "SubSection deleted successfully",
          data: updatedSection,
        })
      } catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "An error occurred while deleting the SubSection",
        })
      }
}