import express from "express";
import { fallback, healthCheck } from "../controllers/common.controller";

const commonRouter = express.Router();
commonRouter.get("/", healthCheck);
commonRouter.all("*", fallback);

export default commonRouter;
