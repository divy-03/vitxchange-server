import { Response } from "express";
import { ValidationError } from "express-validator";

const resError = (
  statusCode: number,
  error: string | ValidationError[],
  res: Response
) => {
  res.status(statusCode).json({
    success: false,
    error: error,
  });
};

export default resError;
