import { Request, Response } from "express";
import UserModel from "../models/user.model";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, age, salary, username, password } = req.body;
    const user = new UserModel({ name, age, salary, username, password });
    const response = await user.save();
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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();

    if (users) {
      res.status(201).json({
        success: true,
        message: "User list fetched successfully",
        data: users,
      });
    } else {
      res.send({
        success: true,
        message: "Request Failed",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, age, salary, username, password } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        age,
        salary,
        username,
        password,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "User update Failed" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (user) {
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (user) {
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
