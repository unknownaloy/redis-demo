import express from "express";

import {
  createRestaurant,
  createReview,
  deleteReview,
  getRestaurant,
  getRestaurantReview,
} from "controllers/restaurant.controller.ts";
import { checkRestaurantExists } from "middlewares/checkRestaurantId.middleware.ts";
import { validateMiddleware } from "middlewares/validate.ts";
import { RestaurantSchema } from "schemas/restaurant.ts";
import { ReviewSchema } from "schemas/review.ts";

const restaurantRouter = express.Router();

restaurantRouter.post(
  "/",
  validateMiddleware(RestaurantSchema),
  createRestaurant
);

restaurantRouter.post(
  "/:restaurantId/reviews",
  validateMiddleware(ReviewSchema),
  createReview
);

restaurantRouter.get(
  "/:restaurantId/reviews",
  checkRestaurantExists,
  getRestaurantReview
);

restaurantRouter.delete(
  "/:restaurantId/reviews/:reviewId",
  checkRestaurantExists,
  deleteReview,
);

restaurantRouter.get("/:restaurantId", checkRestaurantExists, getRestaurant);

export default restaurantRouter;
