import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
const router = express.Router();

router.post(
  "/signup",
  validateRequest(AuthValidation.useSignUpValidationSchema),
  AuthController.userSignUp
);
router.post(
  "/login",
  validateRequest(AuthValidation.useLoginValidationSchema),
  AuthController.userLogin
);

export const AuthRouter = router;
