import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { StatusCodes } from "http-status-codes";
import {
  ERROR_MESSAGES,
  SUCCESS_RESPONSES,
} from "../libs/constants/responses.const";

/**
 * This method will be used to create a user
 * @param req {express.Request} which uses to accept the request from origin
 * @param res {express.Response} which uses for sending the response back to request origin
 * @returns Express response object
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, age, salary, username, password } = req.body;
    const user = new UserModel({ name, age, salary, username, password });
    const response = await user.save();

    const data = {
      name: response.name,
      age: response.age,
      salary: response.salary,
      username: response.username,
    };

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: SUCCESS_RESPONSES.CREATED_SUCCESSFULLY,
      data: data,
    });
  } catch (err) {
    res.send({
      success: false,
      message: ERROR_MESSAGES.CREATED_FAILED,
    });
  }
};

/**
 * This method will be used to get all the users
 * @param req {express.Request} which uses to accept the request from origin
 * @param res {express.Response} which uses for sending the response back to request origin
 * @returns Express response object
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().select("-password");
    return res.status(StatusCodes.OK).json({
      success: true,
      message: SUCCESS_RESPONSES.RETRIEVED_SUCCESSFULLY,
      data: users,
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

/**
 * This method will be used to update a user using user's id
 * @param req {express.Request} which uses to accept the request from origin
 * @param res {express.Response} which uses for sending the response back to request origin
 * @returns Express response object
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, age, salary, username, password } = req.body;
    const user = (await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        age,
        salary,
        username,
        password,
      },
      { new: true }
    )) as any;

    const data = {
      name: user.name,
      age: user.age,
      salary: user.salary,
      username: user.username,
    };

    res.status(StatusCodes.OK).json({
      success: true,
      message: SUCCESS_RESPONSES.UPDATED_SUCCESSFULLY,
      data: data,
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

/**
 * This method will be used to get a user using user's id
 * @param req {express.Request} which uses to accept the request from origin
 * @param res {express.Response} which uses for sending the response back to request origin
 * @returns Express response object
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = (await UserModel.findById(req.params.id)) as any;
    if (user) {
      const data = {
        name: user.name,
        age: user.age,
        salary: user.salary,
        username: user.username,
      };
      res.send({
        success: true,
        message: SUCCESS_RESPONSES.RETRIEVED_SUCCESSFULLY,
        data: data,
      });
    } else {
      res.send({
        success: false,
        message: ERROR_MESSAGES.NOT_FOUND,
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * This method will be used to delete a user using user's id
 * @param req {express.Request} which uses to accept the request from origin
 * @param res {express.Response} which uses for sending the response back to request origin
 * @returns Express response object
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = (await UserModel.findByIdAndDelete(req.params.id)) as any;
    if (user) {
      delete user.password;
      res.send({
        success: true,
        message: SUCCESS_RESPONSES.DELETED_SUCCESSFULLY,
        data: user,
      });
    } else {
      res.send({
        success: false,
        message: ERROR_MESSAGES.DELETION_FAILED,
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * This method will be used to get the credit score of a  user using user's id
 * @param req {express.Request} which uses to accept the request from origin
 * @param res {express.Response} which uses for sending the response back to request origin
 * @returns Express response object
 */
export const getCreditScore = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.NOT_FOUND });

    let score = 0;
    if (user.age > 30 && user.salary > 10000) {
      score = 20;
    } else if (user.age < 30 && user.salary > 10000) {
      score = 30;
    } else if (user.age > 30 && user.salary < 10000) {
      score = 10;
    } else if (user.age < 30 && user.salary < 10000) {
      score = 20;
    }

    res.status(StatusCodes.OK).json({ creditScore: score });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};
