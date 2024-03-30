import { Request, Response, NextFunction } from "express";
import Ajv, { ValidateFunction } from "ajv";
import requestSchema from "../schemas/requestUser.schema.json";

const ajv = new Ajv();

const validateRequest = (schema: object): ValidateFunction => {
  return ajv.compile(schema);
};

export const validateRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = validateRequest(requestSchema);
  const isValid = validate(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ error: "Invalid request body", errors: validate.errors });
  }
  next();
};
