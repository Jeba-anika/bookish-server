import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const userSignUp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.userSignUp(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User signed up successfully!",
    data: result,
  });
});

export const AuthController = { userSignUp };
