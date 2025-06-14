import type { Request, Response, NextFunction } from "express";
import { responseHandler } from "utils/response.ts";
import { ZodSchema } from "zod";

export const validateMiddleware =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      responseHandler({
        res,
        statusCode: 400,
        success: false,
        message: result.error.errors,
      });
      return;
    }

    next();
  };
