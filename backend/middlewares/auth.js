const catchAsyncErrors = require('./catchAsyncErrors')
const ErrorHandler = require("../utils/errorHandler")
const User = require('../models/User')
const jwt = require('jsonwebtoken')

//Check if user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    console.log(req.cookies)
    const token = req.cookies.token;
    if (!token) {
        return next(new ErrorHandler('Login first to access this resource', 401))
    }
    //const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.find({
        "id": req.cookies.user_id
    })

    //req.user = await User.findById(decoded.id)


    console.log('The', req.user[0].role, req.user[0].email, 'is sending a request')
    next()

})

//Handling user's roles
exports.authorizeRole = (...roles) => {

    return (req, res, next) => {
      //  console.log('inside authorised role', res)
        if (!roles.includes(req.user[0].role)) {
            return next(
                new ErrorHandler(`Role (${req.user[0].role}) is not allowed to access this resource`,
                    403))
        }
        next()
    }
}


