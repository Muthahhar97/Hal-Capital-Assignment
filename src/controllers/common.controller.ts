import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { NotFoundException } from "../exceptions/not-found.exception";

export const healthCheck = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: "healthy connection",
  });
};

export const fallback = (req: Request, res: Response, next: NextFunction) => {
  res.send({ success: false, message: "Route Not Found" });
};
