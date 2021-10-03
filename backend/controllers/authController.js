const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

//Register a user => api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: '',
            url: ''
        }
    })

    sendToken(user, 200, res)
    const token = user.getJwtToken();
    //console.log(token)

})

// Login user => /api/v1/login

exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const {email, password} = req.body;

    // Check if email and password is entered by the user
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400))
    }

    //Finding user in database
    const user = await User.findOne({email}).select('+password')
    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    //Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);
    //console.log(password)
    if (!isPasswordMatched) {
        //return next(new ErrorHandler(('Invalid Email or Password', 401)))
        return (
            res.status(401).json({
                success: false,
                msg: 'Wrong Password'
            }))
    }
    sendToken(user, 200, res)

})

//Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logged out"
    })
})

//Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    console.log('Forgot was successfully sent to:', req.body.email)
    const user = await User.findOne({
        email: req.body.email
    })
    if (!user) {
        return next(new ErrorHandler('No user was found with this email', 404))
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();
    console.log('new reseted token:', resetToken)

    await user.save({validateBeforeSave: false})

    //Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is:\n\n${resetUrl}\n\nIf you have not request reset your password, please ignore this email`


    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIt Password Recovery',
            message
        })
        res.status(200).json({
            success: true,
            message: `Email was sent to ${user.email}`
        })

    } catch (error) {
        await User.updateMany(
            {email: user.email},
            {
                $set:
                    {
                        resetPasswordToken: resetToken,
                        resetPasswordExpire: Date.now() + (1000 * 60 * 270)
                        // ResetPasswordExpire: Date.now() + 1000 * 60 * 30
                    }
            }
        );

        /*await User.updateOne(
            {email: user.email},
            {
                $set:
                    {//resetPasswordToken: resetToken,
                        resetPasswordExpire: Date.now() + 1000 * 60 * 30
                    }
            }
        );*/


        /* user.resetPasswordToken = undefined;
           user.getResetPasswordExpire = undefined;*/
        console.log(user)

        await user.save({validateBeforeSave: false})
        return next(new ErrorHandler('email was not sent', 500))

    }

})


//Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken: req.params.token
    })


    /* console.log("user.resetPasswordExpire", user.resetPasswordExpire)
     const d = Date.now()
     console.log("Date.now()", Date(d).toString())*/

    if (!user || user.resetPasswordExpire < Date.now()) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }
    if (req.body.password !== req.body.confirmedPassword) {
        return next(new ErrorHandler('Passwords do not match', 400))
    }

    //Setup new password
    if (user) {
        await User.updateMany(
            {
                password: await bcrypt.hash(req.body.password, 10),
                resetPasswordToken: undefined,
                resetPasswordExpire: undefined
            }
        )
        return (
            res.status(200).json({
                success: true,
                msg: `Paassword for ${user.email} was successfully updated`
            })
        )
    }


})

//Get current logged in user's details => /v1/api/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(
        req.cookies.token.user_id
    );

    res.status(200).json({
        success: true,
        user
    })

})

//Update / change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { oldPassword } = req.body
    const user = await User.findById(req.cookies.token.user_id);
    console.log(user)
    const isMatched = await bcrypt.compare(oldPassword, user.passwordRep)


    if (!isMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400))
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)

})

