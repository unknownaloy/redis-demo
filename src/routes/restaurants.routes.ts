import express from "express";
import { validateMiddleware } from "middlewares/validate.ts";
import { Restaurant, RestaurantSchema } from "schemas/restaurant.ts";
import { initializeRedisClient } from "utils/client.ts";
import { responseHandler } from "utils/response.ts";

const restaurantRouter = express.Router();

restaurantRouter.post(
  "/",
  validateMiddleware(RestaurantSchema),
  async (req, res) => {
    const data = req.body as Restaurant;

    const client = await initializeRedisClient();

    responseHandler({
      res: res,
      success: true,
      message: "success",
      data: { result: "Chisom" },
    });
    return;
  }
);

export default restaurantRouter;
