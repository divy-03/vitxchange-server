import { NextFunction, Request, Response } from "express";
import resError from "../tools/resError";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  path?: string;
}

const error = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  if (err.name === "CastError") {
    const message = `Resource not found, invalid: ${err.path}`;
    resError(400, message, res);
  }
  if (err.code === 11000) {
    resError(403, "User already exists", res);
  }

  return resError(err.statusCode, err.message, res);
};

export default error;
