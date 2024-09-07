import { Request, NextFunction, Response } from "express";
import userModel, { IUser } from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import resError from "../tools/resError";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const fetchUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.cookies.xToken as string; // Assert as string if confident

  if (!authToken) {
    return resError(401, "Unauthorized", res);
  }

  try {
    const data = jwt.verify(authToken, String(process.env.JWT_SECRET));
    const decodedData = data as JwtPayload; // Assert data as JwtPayload
    const userId = decodedData.user.id;

    const user = await userModel.findById(userId); // Store result in a variable

    if (!user) {
      return resError(401, "Unauthorized", res);
    }

    req.user = user; // typescript error
    next();
  } catch (error) {
    return resError(401, "Unauthorized", res);
  }
};

export const authRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return resError(403, "You are not allowed to access this resource", res);
    }
    next();
  };
};
