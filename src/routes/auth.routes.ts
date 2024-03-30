import express from "express";
import { login } from "../controllers/auth.controller";
import { loginValidateMiddleware } from "../middlewares/login-validate.middleware";

const router = express.Router();

router.post("/", loginValidateMiddleware, login);

export default router;
