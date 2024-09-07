import { Request, Response } from "express";
import User from "../models/userModel";
import sendToken from "../utils/sendToken";
import { Document } from "mongoose";
import {
  LoginUserRequestBody,
  MessageRespondBody,
  NewUserRequestBody,
  ResetPasswordRequestBody,
  UpdatePasswordRequestBody,
  UpdateProfileRequestBody,
} from "../types/types";
const bcrypt = require("bcryptjs");
import sendEmail from "../utils/sendEmail";
import { check, validationResult } from "express-validator";
import resError from "../tools/resError";
import resSuccess from "../tools/resSuccess";
import crypto, { publicDecrypt } from "crypto";
import { v2 } from "cloudinary";
const catchAsyncError = require("../middleware/catchAsyncError");

const mapUserDocumentToUser = (userDoc: Document) => {
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

export const registerUser = catchAsyncError(
  async (req: Request<{}, {}, NewUserRequestBody>, res: Response) => {
    const { name, email, password, avatar } = req.body;
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    // Usually this error is handled by 1100 in async errors but hardcoding here, bcoz not working now!
    // const already = await User.findOne({ email: email });
    // if (already) {
    //   return resError(403, "User already exist", res);
    // }

    const avt = await v2.uploader.upload(avatar, {
      folder: "avatars",
      width: 300,
      crop: "scale",
    });

    const userDoc = await User.create({
      name,
      email,
      password: secPass,
      avatar: {
        public_id: avt.public_id,
        url: avt.secure_url,
      },
    });

    const user = mapUserDocumentToUser(userDoc);

    return sendToken(user, 201, res);
  }
);

export const loginUser = catchAsyncError(
  async (req: Request<{}, {}, LoginUserRequestBody>, res: Response) => {
    const { email, password } = req.body;
    await check("email", "Please enter a valid email").isEmail().run(req);
    await check("password", "Please enter a password").notEmpty().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return resError(400, errors.array(), res);
    } else {
      const userDoc = await User.findOne({ email }).select("+password");

      if (!userDoc) {
        return resError(401, "Invalid email or password", res);
      }
      const savedPassword = userDoc.password;
      const passwordCompare = await bcrypt.compareSync(password, savedPassword);

      if (!passwordCompare) {
        return resError(401, "Password not matched", res);
      } else {
        const user = mapUserDocumentToUser(userDoc);
        return sendToken(user, 200, res);
      }
    }
  }
);

export const logOutUser = catchAsyncError(
  async (req: Request, res: Response<MessageRespondBody>) => {
    res.cookie("xToken", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    resSuccess(200, "Logged out Successfully", res);
  }
);

export const getCookieToken = catchAsyncError(
  async (req: Request, res: Response) => {
    const token = req.cookies.xToken;
    resSuccess(200, token, res);
  }
);

export const getUserProfile = catchAsyncError(
  async (req: Request, res: Response) => {
    const filter = req.user ? { _id: req.user._id } : {};
    if (!filter) return resError(401, "Unauthorized", res);

    const user = await User.findOne(filter);
    if (!user) return resError(404, "User not found", res);

    return res.status(200).json({
      success: true,
      user,
    });
  }
);

export const forgotPassword = catchAsyncError(
  async (req: Request<{}, {}, { email: string }>, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return resError(404, "User not found", res);
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.CLIENT_BASE_URL}/reset/${resetToken}`;
    // return resSuccess(200, resetPasswordUrl, res);

    const message = `Your password reset link is => \n\n ${resetPasswordUrl} \n\nIf you have not requested to reset password then please ignore this mail`;
    try {
      await sendEmail({
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

      resSuccess(200, `Email sent to ${user.email}`, res);
    } catch (error) {
      user.resetPasswordExpire = undefined;
      user.resetPasswordToken = undefined;

      await user.save({ validateBeforeSave: false });

      return resError(500, "Error Occured while sending Mail", res);
    }
  }
);

export const resetPassword = catchAsyncError(
  async (
    req: Request<{ token: string }, {}, ResetPasswordRequestBody>,
    res: Response
  ) => {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return resError(400, "Reset password link is invalid or expired", res);
    }
    if (req.body.password !== req.body.confirmPassword) {
      return resError(400, "Password doesn't match", res);
    }

    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hashSync(req.body.password, salt);

    user.password = secPass;

    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    const userObj = mapUserDocumentToUser(user);
    sendToken(userObj, 200, res);
  }
);

export const updatePassword = catchAsyncError(
  async (
    req: Request<{}, {}, UpdatePasswordRequestBody>,
    res: Response<MessageRespondBody>
  ) => {
    const user = await User.findById(req.user?._id).select("+password");

    const passswordCompare = await bcrypt.compareSync(
      req.body.oldPassword,
      user?.password
    );

    if (!passswordCompare) {
      return resError(401, "Password not matched", res);
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return resError(401, "New password not matched", res);
    }

    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hashSync(req.body.newPassword, salt);

    if (user) {
      user.password = secPass;
    }

    await user?.save();

    if (user) return resSuccess(200, "Password Changed Successfully", res);
  }
);

export const updateProfile = catchAsyncError(
  async (
    req: Request<{}, {}, UpdateProfileRequestBody>,
    res: Response<MessageRespondBody>
  ) => {
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if (user?.avatar.public_id) {
      await v2.uploader.destroy(user.avatar.public_id);
    }

    let avt = null;
    if (req.body.avatar !== "noImg") {
      avt = await v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 300,
        crop: "scale",
      });
    }

    const newUserData: any = {
      name: req.body.name,
      email: req.body.email,
    };

    if (avt) {
      newUserData.avatar = {
        public_id: avt.public_id,
        url: avt.url,
      };
    }

    await User.findByIdAndUpdate(userId, newUserData, {
      new: true,
      runValidators: true,
    });

    resSuccess(200, "Profile updated successfully", res);
  }
);

export const getAllUsers = catchAsyncError(async (req: Request, res: Response) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    usersCount: users.length,
    users,
  });
});

export const getUser = catchAsyncError(
  async (req: Request<{ id: string }>, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return resError(404, "User not found", res);
    }
    return res.status(200).json({
      success: true,
      user,
    });
  }
);

export const editUserRole = catchAsyncError(
  async (
    req: Request<{ id: string }, {}, NewUserRequestBody>,
    res: Response
  ) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      userModifyAndModify: false,
    });

    if (!user) {
      return resError(404, "User not found", res);
    }

    return res.status(200).json({
      success: true,
      user,
    });
  }
);

export const deleteUser = catchAsyncError(
  async (req: Request<{ id: string }>, res: Response<MessageRespondBody>) => {
    const user = await User.findById(req.params.id);

    // TODO: remove cloudinary later

    if (user === null) {
      return resError(404, "User not found", res);
    }

    if (user.role == "owner") {
      return resError(400, "You can't delete Owner", res);
    }

    await User.deleteOne();

    return resSuccess(200, "User deleted successfully", res);
  }
);
