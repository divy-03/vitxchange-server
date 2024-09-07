import mongoose, { Document, Model, Types } from "mongoose";
import validator from "validator";
import crypto from "crypto";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "user" | "admin" | "owner";
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  resetPasswordToken?: string | undefined;
  resetPasswordExpire?: Date | undefined;
  getResetPasswordToken(): string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please Enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an Email"],
    validate: [validator.isEmail],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minLength: [8, "Password should have more than 8 characters"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  avatar: {
    public_id: String,
    url: String,
  },
  resetPasswordToken: {
    type: String,
    default: undefined,
  },
  resetPasswordExpire: {
    type: Date,
    default: undefined,
  },
});

userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
