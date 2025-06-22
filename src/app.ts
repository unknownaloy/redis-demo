import { PORT } from "config/env.ts";
import express from "express";
import { errorMiddleware } from "middlewares/error.middleware.ts";
import restaurantRouter from "routes/restaurant.routes.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/restaurants", restaurantRouter);

app.use(errorMiddleware);

app
  .listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    console.log("app.js - error --", error);
    throw new Error(error.message);
  });
