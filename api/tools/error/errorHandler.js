import { AppError } from "./AppError.js";

export function errorHandler(error, req, res) {
  console.log(error);

  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ errorCode: error.errorCode, errorMessage: error.message });
  }

  return res.status(500).send(error.message);
}
