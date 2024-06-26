import { Request, Response, NextFunction } from "express";
import Ajv, { ValidateFunction } from "ajv";
import loginSchema from "../schemas/loginUser.schema.json";

const ajv = new Ajv();

const validateRequest = (schema: object): ValidateFunction => {
  return ajv.compile(schema);
};

export const loginValidateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = validateRequest(loginSchema);
  const isValid = validate(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ error: "Invalid request body", errors: validate.errors });
  }
  next();
};
