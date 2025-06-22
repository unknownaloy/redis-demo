import { nanoid } from "nanoid";
import { type Request, Response, NextFunction } from "express";

import { initializeRedisClient } from "utils/client.ts";
import {
  restaurantKeyById,
  reviewDetailsKeyById,
  reviewKeyById,
} from "utils/keys.ts";
import { responseHandler } from "utils/response.ts";
import { Review } from "schemas/review.ts";

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

export const createReview = async (
  req: Request<{ restaurantId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;
  const data = req.body as Review;

  try {
    const client = await initializeRedisClient();

    const reviewId = nanoid();

    const reviewKey = reviewKeyById(restaurantId);

    const reviewDetailsKey = reviewDetailsKeyById(reviewId);

    const reviewData = { id: reviewId, ...data, restaurantId };

    await Promise.all([
      client.lPush(reviewKey, reviewId),
      client.hSet(reviewDetailsKey, reviewData),
    ]);

    responseHandler({
      res,
      success: true,
      message: "Review added",
      data: reviewData,
    });

    return;
  } catch (err) {
    next(err);
  }
};

export const getRestaurantReview = async (
  req: Request<{ restaurantId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId } = req.params;

  const { page = 1, limit = 10 } = req.query;

  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit) - 1;

  try {
    const client = await initializeRedisClient();

    const reviewKey = reviewKeyById(restaurantId);

    const reviewIds = await client.lRange(reviewKey, start, end);

    if (reviewIds.length === 0) {
      responseHandler({
        res,
        success: true,
        message: "No reviews found for this restaurant",
        data: [],
      });

      return;
    }

    const reviews = await Promise.all(
      reviewIds.map((id) => client.hGetAll(reviewDetailsKeyById(id)))
    );

    responseHandler({
      res,
      success: true,
      message: "Fetched reviews for restaurant",
      data: reviews,
    });

    return;
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (
  req: Request<{ restaurantId: string; reviewId: string }>,
  res: Response,
  next: NextFunction
) => {
  const { restaurantId, reviewId } = req.params;

  try {
    const client = await initializeRedisClient();

    const reviewKey = reviewKeyById(restaurantId);
    const reviewDetailsKey = reviewDetailsKeyById(reviewId);

    const [removeResult, deleteResult] = await Promise.all([
      client.lRem(reviewKey, 0, reviewId),
      client.del(reviewDetailsKey),
    ]);

    if (removeResult === 0 && deleteResult === 0) {
      responseHandler({
        res,
        success: false,
        statusCode: 404,
        message: "Review not found",
      });

      return;
    }

    responseHandler({
      res,
      success: true,
      message: "Review deleted",
      data: reviewId,
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
