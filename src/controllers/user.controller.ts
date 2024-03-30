import { Request, Response } from "express";
import UserModel from "../models/user.model";

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
    const response = (await user.save()) as any;
    if (response.password) {
      delete response.password;
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: response,
    });
  } catch (err) {
    res.send({
      success: false,
      message: "User Creation Failed",
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
    const users = await UserModel.find();
    return res.status(201).json({
      success: true,
      message: "User list fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
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

    delete user.password;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "User update Failed" });
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
      delete user.password;
      res.send({
        success: true,
        message: "User Found successfully",
        data: user,
      });
    } else {
      res.send({
        success: false,
        message: "User Search Failed",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: "Server Error",
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
        message: "User Deleted successfully",
        data: user,
      });
    } else {
      res.send({
        success: false,
        message: "User Deletion Failed",
      });
    }
  } catch (err) {
    res.send({
      success: false,
      message: "Server Error",
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
    if (!user) return res.status(404).json({ message: "User not found" });

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

    res.status(200).json({ creditScore: score });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
