import { StatusCodes } from "http-status-codes";

export class NotFoundException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundException";
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
