import express from "express";

import {
  createRestaurant,
  getRestaurant,
} from "controllers/restaurant.controller.ts";
import { checkRestaurantExists } from "middlewares/checkRestaurantId.middleware.ts";
import { validateMiddleware } from "middlewares/validate.ts";
import { RestaurantSchema } from "schemas/restaurant.ts";

const restaurantRouter = express.Router();

restaurantRouter.post(
  "/",
  validateMiddleware(RestaurantSchema),
  createRestaurant
);

restaurantRouter.get("/:restaurantId", checkRestaurantExists, getRestaurant);

export default restaurantRouter;
