import { Request, Response } from "express";
import UserModel from "../models/user.model";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getCreditScore,
  getUser,
  updateUser,
} from "./user.controller";
import { MongooseError } from "mongoose";
import request from "supertest";

jest.mock("../models/user.model");

describe("User Controller - createUser", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        name: "Test User",
        age: 25,
        salary: 50000,
        username: "testuser",
        password: "password",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return success response when user is created successfully", async () => {
    const saveMock = jest.fn().mockResolvedValueOnce({ _id: "userid" });
    jest.spyOn(UserModel.prototype, "save").mockImplementation(saveMock);

    await createUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User created successfully",
      data: { _id: "userid" },
    });
  });

  it("should return failure response when user creation fails", async () => {
    const saveMock = jest
      .fn()
      .mockRejectedValueOnce(new MongooseError("Database error"));
    jest.spyOn(UserModel.prototype, "save").mockImplementation(saveMock);

    await createUser(req as Request, res as Response);

    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "User Creation Failed",
    });
  });

  it("should return success response with user list when users are found", async () => {
    const users = [
      { _id: "userid1", name: "User 1" },
      { _id: "userid2", name: "User 2" },
    ];
    jest.spyOn(UserModel, "find").mockResolvedValueOnce(users);

    await getAllUsers(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User list fetched successfully",
      data: users,
    });
  });

  it("should return error response when an error occurs", async () => {
    jest
      .spyOn(UserModel, "find")
      .mockRejectedValueOnce(new MongooseError("Database error"));

    await getAllUsers(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });

  it("should update a user successfully", async () => {
    const req = {
      params: { id: "someUserId" },
      body: {
        name: "Updated Name",
        age: 30,
        salary: 50000,
        username: "updatedusername",
        password: "updatedpassword",
      },
    };

    const mockUpdatedUser = {
      _id: "someUserId",
      name: "Updated Name",
      age: 30,
      salary: 50000,
      username: "updatedusername",
      password: "updatedpassword",
    };

    // Mock the implementation of findByIdAndUpdate to return the updated user
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
      mockUpdatedUser
    );

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateUser(req as any, res as any);

    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "someUserId",
      {
        name: "Updated Name",
        age: 30,
        salary: 50000,
        username: "updatedusername",
        password: "updatedpassword",
      },
      { new: true }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User updated successfully",
      data: mockUpdatedUser,
    });
  });

  it("should handle update failure", async () => {
    const req = {
      params: { id: "someUserId" },
      body: {
        name: "Updated Name",
        age: 30,
        salary: 50000,
        username: "updatedusername",
        password: "updatedpassword",
      },
    };

    // Mock the implementation of findByIdAndUpdate to throw an error
    (UserModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(
      new Error("Update failed")
    );

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateUser(req as any, res as any);

    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "someUserId",
      {
        name: "Updated Name",
        age: 30,
        salary: 50000,
        username: "updatedusername",
        password: "updatedpassword",
      },
      { new: true }
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User update Failed",
    });
  });

  it("should return user if found", async () => {
    const mockUser = {
      _id: "someUserId",
      name: "Test User",
      age: 25,
      salary: 50000,
      username: "testuser",
      password: "testpassword",
    };

    // Mock the implementation of findById to return the user
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const req = {
      params: { id: "someUserId" },
    };

    const res = {
      send: jest.fn(),
    };

    await getUser(req as any, res as any);

    expect(UserModel.findById).toHaveBeenCalledWith("someUserId");
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      message: "User Found successfully",
      data: mockUser,
    });
  });

  it("should return error message if user not found", async () => {
    // Mock the implementation of findById to return null
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    const req = {
      params: { id: "nonExistingUserId" },
    };

    const res = {
      send: jest.fn(),
    };

    await getUser(req as any, res as any);

    expect(UserModel.findById).toHaveBeenCalledWith("nonExistingUserId");
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "User Search Failed",
    });
  });

  it("should handle server error", async () => {
    // Mock the implementation of findById to throw an error
    (UserModel.findById as jest.Mock).mockRejectedValue(
      new Error("Server Error")
    );

    const req = {
      params: { id: "someUserId" },
    };

    const res = {
      send: jest.fn(),
    };

    await getUser(req as any, res as any);

    expect(UserModel.findById).toHaveBeenCalledWith("someUserId");
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "Server Error",
    });
  });

  it("should delete user successfully", async () => {
    const mockUser = {
      _id: "someUserId",
      name: "Test User",
      age: 25,
      salary: 50000,
      username: "testuser",
      password: "testpassword",
    };

    // Mock the implementation of findByIdAndDelete to return the user
    (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);

    const req = {
      params: { id: "someUserId" },
    };

    const res = {
      send: jest.fn(),
    };

    await deleteUser(req as any, res as any);

    expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith("someUserId");
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      message: "User Deleted successfully",
      data: mockUser,
    });
  });

  it("should handle user not found", async () => {
    // Mock the implementation of findByIdAndDelete to return null
    (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const req = {
      params: { id: "nonExistingUserId" },
    };

    const res = {
      send: jest.fn(),
    };

    await deleteUser(req as any, res as any);

    expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(
      "nonExistingUserId"
    );
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "User Deletion Failed",
    });
  });

  it("should handle server error", async () => {
    // Mock the implementation of findByIdAndDelete to throw an error
    (UserModel.findByIdAndDelete as jest.Mock).mockRejectedValue(
      new Error("Server Error")
    );

    const req = {
      params: { id: "someUserId" },
    };

    const res = {
      send: jest.fn(),
    };

    await deleteUser(req as any, res as any);

    expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith("someUserId");
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: "Server Error",
    });
  });

  it("should return credit score based on user age and salary age > 30 and salary > 10000", async () => {
    const mockUser = {
      _id: "someUserId",
      name: "Test User",
      age: 35,
      salary: 15000,
      username: "testuser",
      password: "testpassword",
    };

    // Mock the implementation of findById to return the user
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const req = {
      params: { id: "someUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCreditScore(req as any, res as any);

    expect(UserModel.findById).toHaveBeenCalledWith("someUserId");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ creditScore: 20 }); // Age > 30 && Salary > 10000
  });

  it("should return credit score based on user age and salary age < 30 and salary > 10000", async () => {
    const mockUser = {
      _id: "someUserId",
      name: "Test User",
      age: 28,
      salary: 15000,
      username: "testuser",
      password: "testpassword",
    };

    // Mock the implementation of findById to return the user
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const req = {
      params: { id: "someUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCreditScore(req as any, res as any);

    expect(UserModel.findById).toHaveBeenCalledWith("someUserId");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ creditScore: 30 }); // Age < 30 && Salary > 10000
  });

  it("should return credit score based on user age and salary age > 30 and salary < 10000", async () => {
    const mockUser = {
      _id: "someUserId",
      name: "Test User",
      age: 35,
      salary: 5000,
      username: "testuser",
      password: "testpassword",
    };

    // Mock the implementation of findById to return the user
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const req = {
      params: { id: "someUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCreditScore(req as any, res as any);

    expect(UserModel.findById).toHaveBeenCalledWith("someUserId");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ creditScore: 10 }); // Age > 30 && Salary < 10000
  });

  it("should return credit score based on user age and salary age < 30 and salary < 10000", async () => {
    const mockUser = {
      _id: "someUserId",
      name: "Test User",
      age: 28,
      salary: 5000,
      username: "testuser",
      password: "testpassword",
    };

    // Mock the implementation of findById to return the user
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const req = {
      params: { id: "someUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCreditScore(req as any, res as any);

    expect(UserModel.findById).toHaveBeenCalledWith("someUserId");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ creditScore: 20 }); // Age < 30 && Salary < 10000
  });

  it("should handle user not found", async () => {
    // Mock the implementation of findById to return null
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    const req = {
      params: { id: "nonExistingUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCreditScore(req as any, res as any);

    expect(UserModel.findById).toHaveBeenCalledWith("nonExistingUserId");

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should handle server error", async () => {
    // Mock the implementation of findById to throw an error
    (UserModel.findById as jest.Mock).mockRejectedValue(
      new Error("Server Error")
    );

    const req = {
      params: { id: "someUserId" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCreditScore(req as any, res as any);

    expect(UserModel.findById).toHaveBeenCalledWith("someUserId");

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});
