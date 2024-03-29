import express from "express";
import {
  createUser,
  updateUser,
  getCreditScore,
} from "../controllers/user.controller";
import verifyToken from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", createUser);
router.put("/:id", verifyToken, updateUser);
router.get("/credit-score/:id", verifyToken, getCreditScore);

export default router;
