import { Request, Response } from "express";
import Order from "../models/orderModel";
import Cart from "../models/cartModel";
import resError from "../tools/resError";
import resSuccess from "../tools/resSuccess";

const catchAsyncError = require("../middleware/catchAsyncError");

// Create Order
export const createOrder = catchAsyncError(
  async (req: Request, res: Response) => {
    req.body.user = req.user?.id;
    const cart = await Cart.findOne({ user: req.user?.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    req.body.orderItems = cart.cartItems;
    const order = await Order.create(req.body);

    return res.status(201).json({
      success: true,
      order,
    });
  }
);

// Get My Orders
export const getMyOrders = catchAsyncError(
  async (req: Request, res: Response) => {
    const orders = await Order.find({ user: req.user?.id });

    if (!orders) {
      return resError(404, "Orders not found", res);
    }

    res.status(200).json({
      success: true,
      orders,
    });
  }
);

// (ADMIN)
// Get All Orders
export const getAllOrders = catchAsyncError(
  async (req: Request, res: Response) => {
    const orders = await Order.find().populate("user", "name email");
    res.status(200).json({
      success: true,
      orders,
    });
  }
);

// Get Single Order
export const getSingleOrder = catchAsyncError(
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price images");

    if (!order) {
      return resError(404, "Order not found", res);
    }

    return res.status(200).json({
      success: true,
      order,
    });
  }
);

// Update Order
export const updateOrder = catchAsyncError(
  async (req: Request, res: Response) => {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return resError(404, "Order not found", res);
    }
    if (req.body.orderStatus === "Delivered") {
      order.deliveredAt = new Date();
      await order.save({ validateBeforeSave: false });
      return resSuccess(200, "Status updated to Delievered", res);
    }
    resSuccess(200, "Order Updated", res);
  }
);

// Delete Order
export const delOrder = catchAsyncError(async (req: Request, res: Response) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return resError(404, "Order not found", res);
  }
  resSuccess(200, "Order deleted successfully", res);
});
