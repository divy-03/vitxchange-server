"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decreaseQuant = exports.removeFromCart = exports.getCartItems = exports.addToCart = void 0;
const cartModel_1 = __importDefault(require("../models/cartModel"));
const resSuccess_1 = __importDefault(require("../tools/resSuccess"));
const resError_1 = __importDefault(require("../tools/resError"));
const catchAsyncError = require("../middleware/catchAsyncError");
// Add to Cart and Increase Quantity
exports.addToCart = catchAsyncError(async (req, res) => {
    const user = req.user?.id;
    const { pid } = req.body;
    let cart = await cartModel_1.default.findOne({ user });
    if (!cart) {
        cart = new cartModel_1.default({ user, products: [] });
    }
    const productIndex = cart.cartItems.findIndex((p) => p.pid.toString() === pid);
    if (productIndex > -1) {
        cart.cartItems[productIndex].quantity += 1;
    }
    else {
        cart.cartItems.push({ pid, quantity: 1 });
    }
    await cart.save();
    (0, resSuccess_1.default)(201, "Item Added", res);
});
// Get Cart Items
exports.getCartItems = catchAsyncError(async (req, res) => {
    const user = req.user?.id;
    const cart = await cartModel_1.default.findOne({ user }).populate({
        path: "cartItems.pid",
        select: "name price images",
    });
    res.status(200).json({
        success: true,
        cartItems: (cart) ? cart?.cartItems : [],
    });
});
// Remove from Cart
exports.removeFromCart = catchAsyncError(async (req, res) => {
    const user = req.user?.id;
    const { pid } = req.body;
    const cart = await cartModel_1.default.findOne({ user });
    if (!cart) {
        return (0, resError_1.default)(404, "Cart not found", res);
    }
    const productIndex = cart.cartItems.findIndex((p) => p.pid.toString() === pid);
    if (productIndex > -1) {
        cart.cartItems.splice(productIndex, 1);
        await cart.save();
        (0, resSuccess_1.default)(200, "Product removed from cart", res);
    }
    else {
        (0, resError_1.default)(404, "Product not found in cart", res);
    }
});
// Decrease Quantity
exports.decreaseQuant = catchAsyncError(async (req, res) => {
    const user = req.user?.id;
    const { pid } = req.body;
    const cart = await cartModel_1.default.findOne({ user });
    if (!cart) {
        return (0, resError_1.default)(404, "Cart not found", res);
    }
    const productIndex = cart.cartItems.findIndex((p) => p.pid.toString() === pid);
    if (productIndex > -1) {
        if (cart.cartItems[productIndex].quantity === 1) {
            cart.cartItems.splice(productIndex, 1);
        }
        else {
            cart.cartItems[productIndex].quantity--;
        }
        await cart.save();
        (0, resSuccess_1.default)(200, "Item Removed", res);
    }
    else {
        (0, resError_1.default)(404, `Product not found with id: ${pid}`, res);
    }
});
