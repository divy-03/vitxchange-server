"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
    },
    description: {
        type: String,
        required: [true, "Please enter product description"],
    },
    rating: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please enter product category"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter no of stocks"],
        maxlength: [6, "Stock cannot exceed 6 figure"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose_1.default.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                max: [5, "rating cannot exceed 5"],
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    price: {
        type: Number,
        required: [true, "Please enter product price"],
    },
    user: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
        required: [true, "User not logged in"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
