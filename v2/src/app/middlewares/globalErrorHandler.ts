import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import config from "../config";
import AppError from "../errors/AppError";
import handleDuplicateError from "../errors/handleDuplicateError";
import handleZodError from "../errors/handleZodError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages = [{ path: "", message: "Something went wrong!" }];

  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }
  return res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.node_env === "development" ? err?.stack : null,
    err,
  });
};

export default globalErrorHandler;
