import { Response } from "express";
import { ValidationError } from "express-validator";

const resSuccess = (
  statusCode: number,
  message: string | ValidationError[],
  res: Response
) => {
  res.status(statusCode).json({
    success: true,
    message: message,
  });
};

export default resSuccess;
