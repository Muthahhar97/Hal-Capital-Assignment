import { Request, Response, NextFunction } from "express";
import Ajv, { ValidateFunction } from "ajv";
import updateSchema from "../schemas/updateUser.schema.json";

const ajv = new Ajv();

const validateRequest = (schema: object): ValidateFunction => {
  return ajv.compile(schema);
};

export const updateRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = validateRequest(updateSchema);
  const isValid = validate(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ error: "Invalid request body", errors: validate.errors });
  }
  next();
};
