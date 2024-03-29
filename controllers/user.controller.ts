import { Request, Response } from "express";
import UserModel from "../models/user.model";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, age, salary } = req.body;
    const user = new UserModel({ name, age, salary });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, age, salary } = req.body;
    await UserModel.findByIdAndUpdate(req.params.id, { name, age, salary });
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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
