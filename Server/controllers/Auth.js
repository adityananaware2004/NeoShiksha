const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mailSender = require('../utils/mailSender')
const {passwordUpdated} = require('../mail/templates/passwordUpdate')
const Profile = require('../models/Profile')
const otpTemplate = require('../mail/templates/emailVerificationTemplate')


// sendOTP

exports.sendOTP = async (req, res) => {
    try{
        // fetch the email from user body
        const {email} = req.body;

        // check the email in DB whether it already exists!
        const checkUserPresent = await User.findOne({email});

        // if user exists then return response
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: 'User already registered',
            })
        }

        // generate OTP
        var otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

       

        // check whether it is unique OTP
        let otpInDB = await OTP.findOne({otp: otp});

        while(otpInDB){
            otp = otpGenerator.generate(6, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            });

            otpInDB = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        // **Call the mailSender function**
        const emailResponse = await mailSender(
            email,
            "OTP Verification",
            otpTemplate(otp)
        );
        // console.log("Email sent response:", emailResponse);

        // create the entry in DB for OTP, so when user enter the otp we need to verify that otp is correct or not
        const otpBody = await OTP.create(otpPayload)
        console.log('Otp Body: ', otpBody);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        })


    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



// sign up

exports.signUp = async (req, res) => {
    try{
        // fetch the data from req body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            additionalDetails,
            courses,
            image,
            courseProgress,
            contactNumber,
            otp
        } = req.body;

        // Convert email to lowercase for consistent storage & retrieval
        const lowerCaseEmail = email.toLowerCase();

        // validate the data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "All fields are required!"
            })
        }

        // check user exists or not
        const existingUser = await User.findOne({email: lowerCaseEmail});
        
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User is Already registered"
            })
        }

        // match the 2 passwords

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            })
        }

        // find the most recent otp from DB
        // const recentOtp = await OTP.find({email: lowerCaseEmail}).sort({createdAt:-1}).limit(1);
        // console.log("recent otp: ", recentOtp);

        // // validate otp
        // if(recentOtp.length === 0){
        //     // Otp not found
        //     return res.status(400).json({
        //         success: false,
        //         message: "OTP not found"
        //     })
        // }else if(otp !== recentOtp[0].otp){
        //     // invalid otp
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Invalid OTP',
        //     })
        // }

        // find the most recent otp from DB
        const recentOtp = await OTP.findOne({ email: lowerCaseEmail }).sort({ createdAt: -1 });

        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        } else if (otp.toString() !== recentOtp.otp.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }


        // hash the password
        const hashPassword = await bcrypt.hash(password, 10);
       

        // create entry in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            accountType,
            additionalDetails: profileDetails._id,
            courses,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            courseProgress,
            contactNumber,
            otp
        })

        return res.status(200).json({
            success: true,
            message: 'User Registered Successfully',
            user,
        })


    }catch(error){
        return res.status(500).json({
            message: error.message,
            success: false,
            // message: 'User cannot be registered, please try again later'
        })
    }
}


// login

exports.login = async (req, res) => {
    try{
        // fetch the data
        const {email, password} = req.body;

        // validate the data
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // user already exists or not
        const existingUser = await User.findOne({email}).populate('additionalDetails').exec();
        if(!existingUser){
            return res.status(401).json({
                success: false,
                message: 'Not a valid gmail'
            })
        }

        // match the password and generate token
        if(await bcrypt.compare(password,existingUser.password)){
            const payload = {
                email: existingUser.email,
                id: existingUser._id,
                accountType: existingUser.accountType
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h'
            })

            existingUser.token = token;
            existingUser.password = undefined

            // create cookie and send res
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                existingUser,
                message: "Logged In Successfully"
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Incorrect Password!"
            })
        }


    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Login Failure, please try again"
        })
    }
}



// changepassword

exports.changePassword = async(req, res) => {
    try{
        // fetch the data
        const {email, oldPassword, newPassword, confirmPassword} = req.body;

        const userDetails = await User.findById(req.body.id);

        // validate data
        if(!oldPassword || !newPassword || !confirmPassword){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check the old password is correct or not
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )

          if (!isPasswordMatch) {
            // If old password does not match, return a 401 (Unauthorized) error
            return res
              .status(401)
              .json({ success: false, message: "The password is incorrect" })
          }

        //check the 2 password are same
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: 'Password do not match',
            })
        }

        // const existingUser = await User.findOne({email});

        // if(!existingUser){
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Incorrect email',
        //     })
        // }

        // if(bcrypt.compare(oldPassword, existingUser.password)){
        //     const hashPassword = await bcrypt.hash(newPassword, 10);

        //     // create the entry in DB
        //     existingUser.password= hashPassword;
        // }
        // else{
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Wrong Password'
        //     })
        // }

         // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUserDetails = await User.findByIdAndUpdate(
        req.existingUser.id,
        { password: encryptedPassword },
        { new: true }
        )

        // // create the entry in DB
        // // const user = await User.create({
        // //     password: hashPassword,
        // // })
        

        // // send mail
        // await mailSender(email, "Password changed", "changed password successfully")

        // // return res
        // return res.status(200).json({
        //     success: true,
        //     message: 'Password changed successfully'
        // })


        // Send notification email
        try {
            const emailResponse = await mailSender(
            updatedUserDetails.email,
            "Password for your account has been updated",
            passwordUpdated(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
            )
            console.log("Email sent successfully:", emailResponse.response)
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
            success: false,
            message: "Error occurred while sending email",
            error: error.message,
            })
        }
    
        // Return success response
        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully" })
     

    }catch(error){
         // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while updating password:", error)
        return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
        })
    }
}