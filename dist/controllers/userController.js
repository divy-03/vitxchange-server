"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.editUserRole = exports.getUser = exports.getAllUsers = exports.updateProfile = exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.getUserProfile = exports.getCookieToken = exports.logOutUser = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const sendToken_1 = __importDefault(require("../utils/sendToken"));
const bcrypt = require("bcryptjs");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const express_validator_1 = require("express-validator");
const resError_1 = __importDefault(require("../tools/resError"));
const resSuccess_1 = __importDefault(require("../tools/resSuccess"));
const crypto_1 = __importDefault(require("crypto"));
const cloudinary_1 = require("cloudinary");
const catchAsyncError = require("../middleware/catchAsyncError");
const mapUserDocumentToUser = (userDoc) => {
    const userObj = userDoc.toObject();
    return {
        id: userObj._id.toString(),
        name: userObj.name,
        email: userObj.email,
        password: userObj.password,
        role: userObj.role,
        avatar: {
            public_id: userObj.avatar.public_id,
            url: userObj.avatar.url,
        },
    };
};
exports.registerUser = catchAsyncError(async (req, res) => {
    const { name, email, password, avatar } = req.body;
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    // Usually this error is handled by 1100 in async errors but hardcoding here, bcoz not working now!
    // const already = await User.findOne({ email: email });
    // if (already) {
    //   return resError(403, "User already exist", res);
    // }
    const avt = await cloudinary_1.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 300,
        crop: "scale",
    });
    const userDoc = await userModel_1.default.create({
        name,
        email,
        password: secPass,
        avatar: {
            public_id: avt.public_id,
            url: avt.secure_url,
        },
    });
    const user = mapUserDocumentToUser(userDoc);
    return (0, sendToken_1.default)(user, 201, res);
});
exports.loginUser = catchAsyncError(async (req, res) => {
    const { email, password } = req.body;
    await (0, express_validator_1.check)("email", "Please enter a valid email").isEmail().run(req);
    await (0, express_validator_1.check)("password", "Please enter a password").notEmpty().run(req);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return (0, resError_1.default)(400, errors.array(), res);
    }
    else {
        const userDoc = await userModel_1.default.findOne({ email }).select("+password");
        if (!userDoc) {
            return (0, resError_1.default)(401, "Invalid email or password", res);
        }
        const savedPassword = userDoc.password;
        const passwordCompare = await bcrypt.compareSync(password, savedPassword);
        if (!passwordCompare) {
            return (0, resError_1.default)(401, "Password not matched", res);
        }
        else {
            const user = mapUserDocumentToUser(userDoc);
            return (0, sendToken_1.default)(user, 200, res);
        }
    }
});
exports.logOutUser = catchAsyncError(async (req, res) => {
    res.cookie("xToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    (0, resSuccess_1.default)(200, "Logged out Successfully", res);
});
exports.getCookieToken = catchAsyncError(async (req, res) => {
    const token = req.cookies.xToken;
    (0, resSuccess_1.default)(200, token, res);
});
exports.getUserProfile = catchAsyncError(async (req, res) => {
    const filter = req.user ? { _id: req.user._id } : {};
    if (!filter)
        return (0, resError_1.default)(401, "Unauthorized", res);
    const user = await userModel_1.default.findOne(filter);
    if (!user)
        return (0, resError_1.default)(404, "User not found", res);
    return res.status(200).json({
        success: true,
        user,
    });
});
exports.forgotPassword = catchAsyncError(async (req, res) => {
    const { email } = req.body;
    const user = await userModel_1.default.findOne({ email });
    if (!user) {
        return (0, resError_1.default)(404, "User not found", res);
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${process.env.CLIENT_BASE_URL}/reset/${resetToken}`;
    // return resSuccess(200, resetPasswordUrl, res);
    const message = `Your password reset link is => \n\n ${resetPasswordUrl} \n\nIf you have not requested to reset password then please ignore this mail`;
    try {
        await (0, sendEmail_1.default)({
            email: user.email,
            subject: "VitXchange Password Recovery",
            message: message,
            html: `<div style="background-image: linear-gradient(to right bottom, #ae95ffab 40%, rgb(210, 103, 117, 0.4)); margin:0;">
          <h1 style="color: #333; margin-left: 10px;">Password Reset Link</h1>
          <p style="font-size: 16px; margin-left:20px;">Click this link below to reset your password of VitXchange Website</p>
          <a href="${resetPasswordUrl}" style="text-decoration: none; background: black; color: white; border-radius: 8px; padding: 10px; text-align: center; width: 80px; margin-left: 50px; transition: background 0.3s;" onmouseover="this.style.background='rgb(45 45 45)'"
          onmouseout="this.style.background='black'">Click Here!</a>
          <p style="font-size: 16px; margin-left:20px;">If you didn't requested to reset password then please ignore this mail</p>
    </div>`,
        });
        (0, resSuccess_1.default)(200, `Email sent to ${user.email}`, res);
    }
    catch (error) {
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save({ validateBeforeSave: false });
        return (0, resError_1.default)(500, "Error Occured while sending Mail", res);
    }
});
exports.resetPassword = catchAsyncError(async (req, res) => {
    const resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = await userModel_1.default.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return (0, resError_1.default)(400, "Reset password link is invalid or expired", res);
    }
    if (req.body.password !== req.body.confirmPassword) {
        return (0, resError_1.default)(400, "Password doesn't match", res);
    }
    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hashSync(req.body.password, salt);
    user.password = secPass;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    const userObj = mapUserDocumentToUser(user);
    (0, sendToken_1.default)(userObj, 200, res);
});
exports.updatePassword = catchAsyncError(async (req, res) => {
    const user = await userModel_1.default.findById(req.user?._id).select("+password");
    const passswordCompare = await bcrypt.compareSync(req.body.oldPassword, user?.password);
    if (!passswordCompare) {
        return (0, resError_1.default)(401, "Password not matched", res);
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return (0, resError_1.default)(401, "New password not matched", res);
    }
    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hashSync(req.body.newPassword, salt);
    if (user) {
        user.password = secPass;
    }
    await user?.save();
    if (user)
        return (0, resSuccess_1.default)(200, "Password Changed Successfully", res);
});
exports.updateProfile = catchAsyncError(async (req, res) => {
    const userId = req.user?._id;
    const user = await userModel_1.default.findById(userId);
    if (user?.avatar.public_id) {
        await cloudinary_1.v2.uploader.destroy(user.avatar.public_id);
    }
    let avt = null;
    if (req.body.avatar !== "noImg") {
        avt = await cloudinary_1.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 300,
            crop: "scale",
        });
    }
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    if (avt) {
        newUserData.avatar = {
            public_id: avt.public_id,
            url: avt.url,
        };
    }
    await userModel_1.default.findByIdAndUpdate(userId, newUserData, {
        new: true,
        runValidators: true,
    });
    (0, resSuccess_1.default)(200, "Profile updated successfully", res);
});
exports.getAllUsers = catchAsyncError(async (req, res) => {
    const users = await userModel_1.default.find({});
    return res.status(200).json({
        success: true,
        usersCount: users.length,
        users,
    });
});
exports.getUser = catchAsyncError(async (req, res) => {
    const user = await userModel_1.default.findById(req.params.id);
    if (!user) {
        return (0, resError_1.default)(404, "User not found", res);
    }
    return res.status(200).json({
        success: true,
        user,
    });
});
exports.editUserRole = catchAsyncError(async (req, res) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    const user = await userModel_1.default.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userModifyAndModify: false,
    });
    if (!user) {
        return (0, resError_1.default)(404, "User not found", res);
    }
    return res.status(200).json({
        success: true,
        user,
    });
});
exports.deleteUser = catchAsyncError(async (req, res) => {
    const user = await userModel_1.default.findById(req.params.id);
    // TODO: remove cloudinary later
    if (user === null) {
        return (0, resError_1.default)(404, "User not found", res);
    }
    if (user.role == "owner") {
        return (0, resError_1.default)(400, "You can't delete Owner", res);
    }
    await userModel_1.default.deleteOne();
    return (0, resSuccess_1.default)(200, "User deleted successfully", res);
});
