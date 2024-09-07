"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductDetails = exports.getAllProducts = exports.createProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const resError_1 = __importDefault(require("../tools/resError"));
const resSuccess_1 = __importDefault(require("../tools/resSuccess"));
const catchAsyncError = require("../middleware/catchAsyncError");
exports.createProduct = catchAsyncError(async (req, res) => {
    req.body.user = req.user?.id;
    const product = await productModel_1.default.create(req.body);
    return res.status(201).json({
        success: true,
        product,
    });
});
exports.getAllProducts = catchAsyncError(async (req, res) => {
    const products = await productModel_1.default.find();
    res.status(200).json({
        status: true,
        products,
    });
});
exports.getProductDetails = catchAsyncError(async (req, res) => {
    const product = await productModel_1.default.findById(req.params.id);
    if (!product)
        return (0, resError_1.default)(404, "Product not found with this id", res);
    res.status(200).json({
        success: true,
        product,
    });
});
exports.updateProduct = catchAsyncError(async (req, res) => {
    let product = await productModel_1.default.findById(req.params.id);
    if (!product)
        return (0, resError_1.default)(404, "Product not found", res);
    const user = req.user;
    if (user?.role !== "admin" || user.id !== product.user.toString()) {
        return (0, resError_1.default)(401, "Unauthorized", res);
    }
    product = await productModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindandModify: false,
    });
    res.status(200).json({
        success: true,
        product,
    });
});
exports.deleteProduct = catchAsyncError(async (req, res) => {
    const product = await productModel_1.default.findById(req.params.id);
    if (!product)
        return (0, resError_1.default)(404, "Product not found", res);
    const user = req.user;
    if (user?.role !== "admin" || user.id !== product.user.toString()) {
        return (0, resError_1.default)(401, "Unauthorized", res);
    }
    await product.deleteOne();
    return (0, resSuccess_1.default)(200, "Product deleted successfully", res);
});
