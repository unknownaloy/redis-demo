import { nanoid } from "nanoid";
import { type Request, Response, NextFunction } from "express";

import { initializeRedisClient } from "utils/client.ts";
import { restaurantKeyById } from "utils/keys.ts";
import { responseHandler } from "utils/response.ts";

export const createRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;

  try {
    const client = await initializeRedisClient();

    const id = nanoid();

    const restaurantKey = restaurantKeyById(id);

    const hashData = { id, name: data.name, location: data.location };

    const addResult = await client.hSet(restaurantKey, hashData);

    console.log("createRestaurant - addResult --", addResult);

    responseHandler({
      res: res,
      success: true,
      message: "Added new restaurant",
      data: hashData,
    });
    return;
  } catch (err) {
    next(err);
  }
};

export const getRestaurant = async (
  req: Request<{ restaurantId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;

  try {
    const client = await initializeRedisClient();

    const restaurantKey = restaurantKeyById(restaurantId);

    const [_, restaurant] = await Promise.all([
      client.hIncrBy(restaurantKey, "viewCount", 1),
      client.hGetAll(restaurantKey),
    ]);

    responseHandler({
      res,
      success: true,
      message: "Fetched restaurant details",
      data: restaurant,
    });

    return;
  } catch (err) {
    next(err);
  }
};
