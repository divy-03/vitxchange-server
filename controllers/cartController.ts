import { Request, Response } from "express";
import Cart from "../models/cartModel";
import resSuccess from "../tools/resSuccess";
import resError from "../tools/resError";
const catchAsyncError = require("../middleware/catchAsyncError");

// Add to Cart and Increase Quantity
export const addToCart = catchAsyncError(
  async (req: Request, res: Response) => {
    const user = req.user?.id;
    const { pid } = req.body;

    let cart = await Cart.findOne({ user });
    if (!cart) {
      cart = new Cart({ user, products: [] });
    }
    const productIndex = cart.cartItems.findIndex(
      (p) => p.pid.toString() === pid
    );

    if (productIndex > -1) {
      cart.cartItems[productIndex].quantity += 1;
    } else {
      cart.cartItems.push({ pid, quantity: 1 });
    }

    await cart.save();
    resSuccess(201, "Item Added", res);
  }
);

// Get Cart Items
export const getCartItems = catchAsyncError(
  async (req: Request, res: Response) => {
    const user = req.user?.id;
    const cart = await Cart.findOne({ user }).populate({
      path: "cartItems.pid",
      select: "name price images",
    });
    res.status(200).json({
      success: true,
      cartItems: (cart) ? cart?.cartItems : [],
    });
  }
);

// Remove from Cart
export const removeFromCart = catchAsyncError(
  async (req: Request, res: Response) => {
    const user = req.user?.id;
    const { pid } = req.body;
    const cart = await Cart.findOne({ user });

    if (!cart) {
      return resError(404, "Cart not found", res);
    }

    const productIndex = cart.cartItems.findIndex(
      (p) => p.pid.toString() === pid
    );

    if (productIndex > -1) {
      cart.cartItems.splice(productIndex, 1);
      await cart.save();
      resSuccess(200, "Product removed from cart", res);
    } else {
      resError(404, "Product not found in cart", res);
    }
  }
);

// Decrease Quantity
export const decreaseQuant = catchAsyncError(
  async (req: Request, res: Response) => {
    const user = req.user?.id;
    const { pid } = req.body;
    const cart = await Cart.findOne({ user });
    if (!cart) {
      return resError(404, "Cart not found", res);
    }
    const productIndex = cart.cartItems.findIndex(
      (p) => p.pid.toString() === pid
    );

    if (productIndex > -1) {
      if (cart.cartItems[productIndex].quantity === 1) {
        cart.cartItems.splice(productIndex, 1);
      } else {
        cart.cartItems[productIndex].quantity--;
      }
      await cart.save();
      resSuccess(200, "Item Removed", res);
    } else {
      resError(404, `Product not found with id: ${pid}`, res);
    }
  }
);
