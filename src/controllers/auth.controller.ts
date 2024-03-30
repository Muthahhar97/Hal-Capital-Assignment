import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user.model";
import { StatusCodes } from "http-status-codes";
import { ERROR_MESSAGES } from "../libs/constants/responses.const";

/**
 * This method will be used to authenticate against a valid username and a password
 * @param req {express.Request} which uses to accept the request from origin
 * @param res {express.Response} which uses for sending the response back to request origin
 * @returns Express response object
 * @author Mohommed Muthahhar
 */
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};
