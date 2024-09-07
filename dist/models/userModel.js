"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter an Email"],
        validate: [validator_1.default.isEmail],
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
    const resetToken = crypto_1.default.randomBytes(20).toString("hex");
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
