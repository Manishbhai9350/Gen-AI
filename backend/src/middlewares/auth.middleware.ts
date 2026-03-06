import type { NextFunction, Request, Response } from "express";
import { DecodeToken } from "../utils/jwt.js";
import { AppError } from "./error.middleware.js";
import { UserModel } from "../models/user/user.model.js";
import { BlackListModel } from "../models/blacklist/blacklist.model.js";
export const AuthMiddleware = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["auth_token"] || null;

    if (!token) {
      return res.status(200).json({
        message: "Please Loggin",
        success: true,
        isLoggedIn: false,
      });
    }

    const decoded = DecodeToken(token);

    if (!decoded) {
      return res.status(200).json({
        message: "Please Loggin",
        success: true,
        isLoggedIn: false,
      });
    }

    const user = await UserModel.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(200).json({
        message: "Please Loggin",
        success: true,
        isLoggedIn: false,
      });
    }

    req.user = user;

    next();
  } catch (error: any) {
    // Forward to centralized error handler
    next(
      error instanceof AppError
        ? error
        : new AppError(error.message || "Server Error", 500),
    );
  }
};

export const BlackListMiddleware = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["auth_token"] || req.headers?.authorization;

    if (!token) {
      return res.status(200).json({
        message: "Please Loggin",
        success: true,
        isLoggedIn: false,
      });
    }

    const blackListedToken = await BlackListModel.findOne({
      token,
    });

    if (blackListedToken) {
      return res.status(400).cookie("auth_token", "").json({
        message: "Error Blacklisted Token, Loggin Again",
        success: false,
        isLoggedIn: false,
      });
    }

    next();
  } catch (error: any) {
    // Forward to centralized error handler
    next(
      error instanceof AppError
        ? error
        : new AppError(error.message || "Server Error", 500),
    );
  }
};
