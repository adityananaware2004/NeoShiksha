const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// resetPasswordToken (sends the mail)

exports.resetPasswordToken = async (req, res) => {
    try{
        // fetch the email
        const email = req.body.email;
        // validate email
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
            })
        }
        // generate token
        const token = crypto.randomBytes(20).toString("hex");

        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email: email},
                                {
                                    token,
                                    resetPasswordExpires: Date.now() + 5*60*1000,
                                },
                                {new: true},
                            );

        // create url
        const url = `http://localhost:3000/update-password/${token}`

        // send mail containing url
        await mailSender(email, "Password Reset",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        )

        // return response
        return res.status(200).json({
            success: true,
            message: 'Email sent successfully, please check email and change password'
        })
    }catch(error){
        return res.status(500).json({
            error: error.message,
            success: false,
            message: 'Something went wrong'
        })
    }
}

// resetPassword
//(new password created in DB)

exports.resetPassword = async (req, res) => {
    try{
        // fetch the details
        const {password, confirmPassword, token} = req.body;

        // validate details
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: 'Password do not match',
            })
        }

        // get user details from db using token
        const userDetails = await User.findOne({token: token});

        // if no entry means invalid token
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: 'Invalid Token',
            })
        }

        // check token time expired or not 
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                success: false,
                message: 'Token is Expired, Please Regenerate Your Token',
            })
        }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // password update
        await User.findOneAndUpdate(
            {token: token},
            {password: hashPassword},
            {new: true}
        )

        // return response
        return res.status(200).json({
            success: true,
            message: 'Password reset successful'
        })

    }catch(error){
        return res.status(500).json({
            error: error.message,
            success: false,
            message: 'Something went wrong, please try again later'
        })
    }
}