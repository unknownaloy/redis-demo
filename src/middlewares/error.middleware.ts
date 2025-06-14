import type { Request, Response, NextFunction } from "express";
import { responseHandler } from "utils/response.ts";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error = { ...err };

    error.message = err.message;

    console.error(`errorMiddleware - err -- ${err}`);
    console.error(`errorMiddleware - req -- ${req}`);

    if (err.name === "CastError") {
      const message = "Resource not found";

      error = new Error(message);
      error.statusCode = 404;
    }

    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 400;
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => {
        if (typeof val === "object" && val !== null && "message" in val) {
          return val.message as string;
        }
        return "Unknown error";
      });
      error = new Error(messages.join(", "));
      error.statusCode = 400;
    }

    responseHandler({
      res,
      statusCode: 500,
      success: false,
      message: error.message || "Server error",
    });
    return;
  } catch (err) {
    next(err);
  }
};
