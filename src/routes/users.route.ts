import express from "express";
import {
  createUser,
  updateUser,
  getCreditScore,
  deleteUser,
  getUser,
  getAllUsers,
} from "../controllers/user.controller";
import verifyToken from "../middlewares/auth.middleware";
import { login } from "../controllers/auth.controller";
import { validateRequestBody } from "../middlewares/request-validate.middleware";

const router = express.Router();

/**
 * Private Endpoints for demo purposes only
 */
router.get("/", verifyToken, getAllUsers);
router.patch("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", verifyToken, getUser);

/**
 * Public Endpoints for demo purposes only
 */
router.post("/login", login);
router.post("/", validateRequestBody, createUser);
router.get("/credit-score/:id", getCreditScore);

export default router;
