const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = {...err};

        error.message = err.message;

        //Wrong mongoose object id error
        console.log(err)
        if (err.name === 'CastError') {
            const message = `Resource was not found. Invalid: ${err.path}`;
            error = new ErrorHandler(message, 400);
        }

        //Handling mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);

        }

        //Handling duplicated user registration
        if (err.code === 11000) {
            const message = `User ${err.keyValue.email} is already registered`;
            error = new ErrorHandler(message, 400);
        }

        //Handling Wrong JWT error
        if (err.code === 'JsonWebTokenError') {
            const message = "JSON Web Token is Invalid. Try again.";
            error = new ErrorHandler(message, 400);
        }


        //Handling JWT expired
        if (err.code === 'TokenExpiredError') {
            const message = "JSON Web Token is Expired. Try again.";
            error = new ErrorHandler(message, 400);
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })
    }

    /*
     err.message = err.message || 'Internal Server Error';

     res.status (err.statusCode).json({
         success:false,
         error:err.stack
     })*/

}

