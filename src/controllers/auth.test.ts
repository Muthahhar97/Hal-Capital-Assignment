import { Request, Response } from "express";
import { login } from "../controllers/auth.controller";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../libs/constants/responses.const";

jest.mock("../models/user.model");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller - login", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: { username: "testuser", password: "password" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if user does not exist", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce(null);

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: ERROR_MESSAGES.INVALID_CREDENTIALS,
    });
  });

  it("should return 401 if password is incorrect", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce({
      username: "testuser",
      password: "hashedPassword",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: ERROR_MESSAGES.INVALID_CREDENTIALS,
    });
  });

  it("should return token if credentials are valid", async () => {
    const user = {
      _id: "userid",
      username: "testuser",
      password: "hashedPassword",
    };
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce(user);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    (jwt.sign as jest.Mock).mockReturnValueOnce("token");

    await login(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({ token: "token" });
  });

  it("should return 500 if an error occurs", async () => {
    (UserModel.findOne as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    await login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  });
});
