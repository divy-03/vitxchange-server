import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export interface MessageRespondBody {
  message: string;
  error: string;
}

export interface NewUserRequestBody {
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: "user" | "admin" | "owner";
}

export interface LoginUserRequestBody {
  email: string;
  password: string;
}

export interface ResetPasswordRequestBody {
  password: string;
  confirmPassword: string;
}

export interface UpdatePasswordRequestBody {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequestBody {
  name: string;
  email: string;
  avatar: string;
}

export interface NewProductRequestBody {
  name: string;
  price: number;
  description: string;
  images: { public_id: string; url: string }[];
  user: mongoose.Schema.Types.ObjectId;
  category: string;
  stock: number;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;
