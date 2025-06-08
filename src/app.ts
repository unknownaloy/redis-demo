import { PORT } from "config/env.ts";
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
}).on("error", (error) => {
    console.log("app.js - error --", error);
    throw new Error(error.message);
});