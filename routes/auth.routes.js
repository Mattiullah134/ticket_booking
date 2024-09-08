import { Router } from "express";
import {
  signup,
  verifyUser,
  resendToken,
  forgetPassword,
  resetPassword,
  signin,
} from "../controller/auth.controller.js";
import { authorize } from "../middleware/authorize.js";

const userAuthRouter = Router();

userAuthRouter.post("/register", signup);
userAuthRouter.post("/signin", signin);
userAuthRouter.post(
  "/verify",
  authorize(["ADMIN", "STAFF", "CUSTOMER"], "verify"),
  verifyUser
);
userAuthRouter.post(
  "/resend_otp",
  authorize(["ADMIN", "STAFF", "CUSTOMER"], "resend_otp"),
  resendToken
);
userAuthRouter.post("/forgot_password", forgetPassword);
userAuthRouter.post("/reset_password", resetPassword);
export default userAuthRouter;
