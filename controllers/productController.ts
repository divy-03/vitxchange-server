import { Request, Response } from "express";
import Product, { IProduct } from "../models/productModel";
import { NewProductRequestBody } from "../types/types";
import resError from "../tools/resError";
import resSuccess from "../tools/resSuccess";
const catchAsyncError = require("../middleware/catchAsyncError");

export const createProduct = catchAsyncError(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response) => {
    req.body.user = req.user?.id;
    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      product,
    });
  }
);

export const getAllProducts = catchAsyncError(
  async (req: Request, res: Response) => {
    const products = await Product.find();

    res.status(200).json({
      status: true,
      products,
    });
  }
);

export const getProductDetails = catchAsyncError(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) return resError(404, "Product not found with this id", res);

    res.status(200).json({
      success: true,
      product,
    });
  }
);

export const updateProduct = catchAsyncError(
  async (req: Request, res: Response) => {
    let product = await Product.findById(req.params.id);
    if (!product) return resError(404, "Product not found", res);

    const user = req.user;
    if (user?.role !== "admin" || user.id !== product.user.toString()) {
      return resError(401, "Unauthorized", res);
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindandModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  }
);

export const deleteProduct = catchAsyncError(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (!product) return resError(404, "Product not found", res);

    const user = req.user;
    if (user?.role !== "admin" || user.id !== product.user.toString()) {
      return resError(401, "Unauthorized", res);
    }
    await product.deleteOne();

    return resSuccess(200, "Product deleted successfully", res);
  }
);
