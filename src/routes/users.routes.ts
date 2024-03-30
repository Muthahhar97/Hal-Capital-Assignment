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
import { validateRequestBody } from "../middlewares/request-validate.middleware";
import { updateRequestBody } from "../middlewares/update-validate.middleware";

const router = express.Router();

/**
 * Private Endpoints for demo purposes only
 */
router.get("/", verifyToken, getAllUsers);
router.patch("/:id", verifyToken, updateRequestBody, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", verifyToken, getUser);
router.get("/:id/credit-score", verifyToken, getCreditScore);

/**
 * Public Endpoints for demo purposes only
 */
router.post("/", validateRequestBody, createUser);

export default router;
