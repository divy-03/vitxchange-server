"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delOrder = exports.updateOrder = exports.getSingleOrder = exports.getAllOrders = exports.getMyOrders = exports.createOrder = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const resError_1 = __importDefault(require("../tools/resError"));
const resSuccess_1 = __importDefault(require("../tools/resSuccess"));
const catchAsyncError = require("../middleware/catchAsyncError");
// Create Order
exports.createOrder = catchAsyncError(async (req, res) => {
    req.body.user = req.user?.id;
    const cart = await cartModel_1.default.findOne({ user: req.user?.id });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }
    req.body.orderItems = cart.cartItems;
    const order = await orderModel_1.default.create(req.body);
    return res.status(201).json({
        success: true,
        order,
    });
});
// Get My Orders
exports.getMyOrders = catchAsyncError(async (req, res) => {
    const orders = await orderModel_1.default.find({ user: req.user?.id });
    if (!orders) {
        return (0, resError_1.default)(404, "Orders not found", res);
    }
    res.status(200).json({
        success: true,
        orders,
    });
});
// (ADMIN)
// Get All Orders
exports.getAllOrders = catchAsyncError(async (req, res) => {
    const orders = await orderModel_1.default.find().populate("user", "name email");
    res.status(200).json({
        success: true,
        orders,
    });
});
// Get Single Order
exports.getSingleOrder = catchAsyncError(async (req, res) => {
    const order = await orderModel_1.default.findById(req.params.id)
        .populate("user", "name email")
        .populate("orderItems.product", "name price images");
    if (!order) {
        return (0, resError_1.default)(404, "Order not found", res);
    }
    return res.status(200).json({
        success: true,
        order,
    });
});
// Update Order
exports.updateOrder = catchAsyncError(async (req, res) => {
    const order = await orderModel_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
    if (!order) {
        return (0, resError_1.default)(404, "Order not found", res);
    }
    if (req.body.orderStatus === "Delivered") {
        order.deliveredAt = new Date();
        await order.save({ validateBeforeSave: false });
        return (0, resSuccess_1.default)(200, "Status updated to Delievered", res);
    }
    (0, resSuccess_1.default)(200, "Order Updated", res);
});
// Delete Order
exports.delOrder = catchAsyncError(async (req, res) => {
    const order = await orderModel_1.default.findByIdAndDelete(req.params.id);
    if (!order) {
        return (0, resError_1.default)(404, "Order not found", res);
    }
    (0, resSuccess_1.default)(200, "Order deleted successfully", res);
});
