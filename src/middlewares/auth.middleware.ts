import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.body.userId = decoded.id;
    next();
  });
};

export default verifyToken;