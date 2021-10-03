//Create and send token and save as cookie
const sendToken = (user, statusCode, res) =>{
    //create Jwt token
    const token = {
        token:user.getJwtToken(),
        user_id:user._id,

    };

    //Options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true,
        user
    }

    res.status(statusCode).cookie('token',token,options,user.password).json({
        success:true,
        user,
        token
    })
}
module.exports = sendToken