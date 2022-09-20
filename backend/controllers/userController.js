const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken"); 
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register a user 
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password}= req.body;

    const user = await User.create({
        name, 
        email,
        password,
        avatar:{
            public_id:"this is sample id",
            url:"profilepicUrl",
        },
    });

    sendToken(user,201,res);
});


//Login USer
exports.loginUser = catchAsyncErrors(async(req,res,next) =>{
    const {email,password} = req.body;

    //cheacking if user has given both password and email
    if(!email || !password){
        return next(new ErrorHandler("Enter Email & Password", 400));

    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(user,200,res);

});

//Logout User
exports.logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token", null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success : true,
        message: "User Logged Out",
    });
});


//Forgot Password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found",404));

    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    // generating url for reseting password
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is:\n\n\n ${resetPasswordUrl}\n\n\n If you not reqested this email
    then, ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject:`IndieCraft Password Recovery`,
            message,
        });

        res.status(200).json({
            sucess: true,
            message: `Email sent to ${user.email} successfully`,
        });
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next (new ErrorHandler(error.message,500));
    }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{

    //creating  Token Hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    });
    if(!user){
        return next(new ErrorHandler("Reset Password Token is Invalid or Has Been Expired",404));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match with password",404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); 

    sendToken(user,200,res);

});


// Get User Detail
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// Update USer Password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incoorect",400));
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match with new password",400));
    }

    user.password = req.body.newPassword

    await user.save();

   sendToken(user,200,res);
}); 

// Update USer Profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }

    // we will add cloudinary later for avatar

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

   res.status(200).json({
    success: true,
   })
}); 

// get all users (Admin)
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{

    const users = await User.find();
    
    res.status(200).json({
        success : true,
        users,
    });
});

// get single user (Admin)
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }
    
    res.status(200).json({
        success : true,
        user,
    });
});

// Update USer Role --Admin
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role: req.body.role,
    }

    

     await User.findByIdAndUpdate(req.params.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    // if(!user){
    //     return next(
    //         new ErrorHandler(`User does not exist with Id: ${req.params.id}`,400)
    //     );
    // }

   res.status(200).json({
    success: true,
   })
}); 

// Delete USer --Admin
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    
    // we will remove cloudinary later for avatar

    if(!user){
        return next(
            new ErrorHandler(`User does not exist with Id: ${req.params.id}`,400)
        );
    }

    await user.remove();

    
   res.status(200).json({
    success: true,
    message: "User Deleted Successfully"
   });
}); 