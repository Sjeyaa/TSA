const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAuthenticatedUser = catchAsyncError( async (req,res,next) =>{
    const { token } = req.cookies;

    if( !token ){
        return res.status(401).json({message: "Login first to handle the resource"})
    }

    const decoded = jwt.verify(token,"123456");
    req.user = await User.findById(decoded.id)
    next();
})

exports.authorizeRoles = (...roles) =>{
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return res.status(401).json({message:`Role ${req.user.role} is not allowed`})
        }
        next();
    }
}