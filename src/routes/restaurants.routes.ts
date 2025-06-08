import express from "express";

const restaurantRouter = express.Router();

restaurantRouter.get("/", async (req, res) => {
    res.send({ title: "Hello friend" })
})


export default restaurantRouter;