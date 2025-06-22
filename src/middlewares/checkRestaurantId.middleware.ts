import type { NextFunction, Request, Response } from "express";

import { initializeRedisClient } from "utils/client.ts";
import { restaurantKeyById } from "utils/keys.ts";
import { responseHandler } from "utils/response.ts";

export const checkRestaurantExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    responseHandler({
      res,
      success: false,
      statusCode: 400,
      message: "Restaurant ID is required",
    });

    return;
  }

  const client = await initializeRedisClient();
  const restaurantKey = restaurantKeyById(restaurantId);
  const exists = await client.exists(restaurantKey);

  if (!exists) {
    responseHandler({
      res,
      success: false,
      statusCode: 404,
      message: "Restaurant not found",
    });

    return;
  }

  next();
};
