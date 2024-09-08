import { PrismaClient } from "@prisma/client";
import { decodeToken } from "./jwtToken.js";
import { errorResponse } from "../utils/response.js";
const prisma = new PrismaClient();
const reqType = ["verify", "resend_otp"];
const authorize = (role = [], type = "") => {
  return async (req, res, next) => {
    try {
      console.log("take header");

      const authHeader = req.headers["authorization"];
      console.log("take header -> done ", authHeader);
      const token = authHeader.split(" ")[1];
      console.log("take header -> done -> extract token", token);
      let decodedTokon = decodeToken(token);
      console.log(
        "take header -> done -> extract token -> decode token",
        decodeToken
      );
      if (!decodedTokon) {
        return res
          .status(401)
          .json({ message: "invalid token", success: false });
      } else {
        console.log(
          "take header -> done -> extract token -> decode token -> find user",
          decodedTokon
        );
        let user = await prisma.user.findUnique({
          where: {
            email: decodedTokon.email,
          },
        });
        console.log(
          "take header -> done -> extract token -> decode token -> find user , user hai",
          decodedTokon
        );
        if (!user) {
          return res
            .status(500)
            .json({ message: "Invalid credientials", success: false });
        }
        if (!role.includes(user.userRole)) {
          return res
            .status(500)
            .json({ message: "Not Allowed", success: false });
        } else {
          if (reqType.includes(type)) {
            req.user = user;
            next();
          } else {
            if (user.isVerified) {
              req.user = user;
              next();
            } else {
              return res
                .status(500)
                .json({ message: "Please verified the email", success: false });
            }
          }
        }
      }
    } catch (error) {
      console.log("error i nthe verify", error);
      errorResponse(500, "something went wrong", res);
    }
  };
};
export { authorize };
