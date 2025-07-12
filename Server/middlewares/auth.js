const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User')
// auth
exports.authenticate = async (req, res, next) => {
    try{
        // fetch the token 
        const authHeader = req.header("Authorization");
        const token = req.cookies.token 
            || (authHeader ? authHeader.replace("Bearer ", "") : null)
            || req.body.token;

        // check the token
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Token is missing'
            })
        }
         console.log("Token received:", token);

        // verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode);
            req.existingUser = decode;
 
            // return res.status(200).json({
            //     success: true,
            //     message: 'Token Verified'
            // })

        }catch(error){
            console.error(error)
            return res.status(401).json({
                success: false,
                message: 'Invalid Token'
            })
        }

        next();

    }catch(error){
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again later.'
        })
    }
}

// isStudent
exports.isStudent = async(req, res, next) => {
    try{
        if(req.existingUser.accountType !== 'Student'){
            return res.status(401).json({
                success: false,
                message: 'This is a protected routed for Students only '
            })
        }
        next();

    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again later '
        })
    }
}

// isAdmin
exports.isAdmin = async(req, res, next) => {
    try{
        if(req.existingUser.accountType !== 'Admin'){
            return res.status(401).json({
                success: false,
                message: 'This is a protected routed for Admin only '
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again later '
        })
    }
}

// isInstructor
exports.isInstructor = async(req, res, next) => {
    try{
        if(req.existingUser.accountType !== 'Instructor'){
            return res.status(401).json({
                success: false,
                message: 'This is a protected routed for Instructor only '
            })
        }
        next();

    }catch(error){
        console.error(error)
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again later '
        })
    }
}