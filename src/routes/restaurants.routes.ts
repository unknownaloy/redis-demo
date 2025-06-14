import express from "express";
import { validateMiddleware } from "middlewares/validate.ts";
import { Restaurant, RestaurantSchema } from "schemas/restaurant.ts";
import { responseHandler } from "utils/response.ts";

const restaurantRouter = express.Router();

restaurantRouter.post(
  "/",
  validateMiddleware(RestaurantSchema),
  async (req, res) => {
    const data = req.body as Restaurant;
    // responseHandler(res, 200, true, "success", { result: "Ellis" });

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
