import bcrypt from "bcryptjs";
import { apiResponse, errorResponse } from "../utils/response.js";
import { PrismaClient } from "@prisma/client";
import { encodeToken } from "../middleware/jwtToken.js";
import { generateOtp } from "../utils/functions.js";
import { sendEmail } from "../utils/sendEmail.js";
const prisma = new PrismaClient();
const signup = async (req, res) => {
  try {
    const { name, email, phone, password, userRole } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      apiResponse(401, "User already exists", null, res);
    } else {
      console.log("hash password", password);

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("hash password -> done -> start transaction", hashedPassword);
      await prisma.$transaction(async (prisma) => {
        console.log(
          "hash password -> done -> start transaction -> crate user",
          hashedPassword
        );
        // Create the user
        const user = await prisma.user.create({
          data: {
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword,
            userRole,
          },
        });
        console.log(
          "hash password -> done -> start transaction -> crate user -> craete ho gaya hai",
          user
        );

        // Generate OTP
        let otp = generateOtp();
        console.log(
          "hash password -> done -> start transaction -> crate user -> craete ho gaya hai -> generate otp _> send email",
          otp
        );
        let data = await sendEmail("otp verification", otp, email);
        console.log(
          "hash password -> done -> start transaction -> crate user -> craete ho gaya hai -> generate otp _> send email -> done",
          otp,
          data
        );

        if (!data) {
          throw new Error("Failed to send OTP email");
        }

        console.log(
          "hash password -> done -> start transaction -> crate user -> craete ho gaya hai -> generate otp _> send email -> done ->update user",
          otp,
          data
        );
        // Update user with OTP and OTP expiration
        const newUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            otp: otp.toString(),
            otpExpire: new Date(Date.now() + 10 * 60000).toISOString(), // Add minutes to current date
          },
        });
        console.log(
          "hash password -> done -> start transaction -> crate user -> craete ho gaya hai -> generate otp _> send email -> done ->update ho gaya hai",
          newUser
        );
        const resData = {
          user: newUser,
          api_token: encodeToken({
            id: user.id,
            userRole: user.userRole,
            email: user.email,
            isVerified: user.isVerified,
          }),
        };
        // Send the success response
        apiResponse(200, "User created successfully", resData, res);
      });
    }
  } catch (error) {
    console.log("error ", error);

    errorResponse(500, error, res);
  }
};

const checkTimePassed = (otpDate) => {
  const storedTime = new Date(otpDate).getTime();
  const tenMinutesInMilliseconds = 10 * 60 * 1000; // 10 minutes in milliseconds
  const currentTime = Date.now(); // Get the current time in milliseconds
  let time = currentTime - storedTime >= tenMinutesInMilliseconds;
  if (time) {
    console.error("Error: 10 minutes have passed.");
    return -1;
  } else {
    console.log("10 minutes have not yet passed.");
    return time;
  }
};
const verifyUser = async (req, res) => {
  try {
    const { otp } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    if (!user) {
      apiResponse(401, "Not found", null, res);
    } else {
      console.log("time", checkTimePassed(user.otpExpire));

      if (checkTimePassed(user.otpExpire) < 0) {
        apiResponse(401, "Otp expire", {}, res);
      } else {
        if (otp !== user.otp) {
          apiResponse(500, "Invalid otp", {}, res);
        } else {
          const newUser = await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              isVerified: true,
            },
          });
          const resData = {
            user: newUser,
            api_token: encodeToken({
              id: user.id,
              userRole: user.userRole,
              email: user.email,
              isVerified: user.isVerified,
            }),
          };
          apiResponse(200, "User signin", resData, res);
        }
      }
    }
  } catch (error) {
    errorResponse(500, error, res);
  }
};
const resendToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    if (!user) {
      apiResponse(401, "Not found", null, res);
    } else {
      let otp = generateOtp();
      console.log(
        "hash password -> done -> start transaction -> crate user -> craete ho gaya hai -> generate otp _> send email",
        otp
      );
      let data = await sendEmail("otp verification", otp, email);
      console.log(
        "hash password -> done -> start transaction -> crate user -> craete ho gaya hai -> generate otp _> send email -> done",
        otp,
        data
      );

      if (!data) {
        apiResponse(400, "InvalidEmail", {}, res);
      } else {
        const newUser = await prisma.user.update({
          where: {
            id: req.user.id,
          },
          data: {
            otp: otp.toString(),
            otpExpire: new Date(Date.now() + 10 * 60000).toISOString(), // Add minutes to current date
          },
        });
        apiResponse(200, "Send the new otp pelase check the email", {}, res);
      }
    }
  } catch (error) {
    console.log("error in the resend the otp", error);

    errorResponse(500, error, res);
  }
};
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return apiResponse(401, "Invalid credientials", null, res);
    } else {
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (!verifyPassword) {
        return apiResponse(404, "Invalid credientials", {}, res);
      } else {
        const data = {
          user,
          api_token: encodeToken({
            id: user.id,
            userRole: user.userRole,
            email: user.email,
            isVerified: user.isVerified,
          }),
        };
        return apiResponse(200, "User found successfully", data, res);
      }
    }
  } catch (error) {
    errorResponse(500, error, res);
  }
};
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      apiResponse(401, "Not found", null, res);
    } else {
      let otp = generateOtp();
      console.log(
        "hash password -> done -> start transaction -> crate user -> craete ho gaya hai -> generate otp _> send email",
        otp
      );
      let data = await sendEmail("Password reset", otp, email);
      console.log(
        "hash password -> done -> start transaction -> crate user -> craete ho gaya hai -> generate otp _> send email -> done",
        otp,
        data
      );
      if (!data) {
        apiResponse(400, "InvalidEmail", {}, res);
      } else {
        const newUser = await prisma.user.update({
          where: {
            email: email,
          },
          data: {
            otp: otp.toString(),
            otpExpire: new Date(Date.now() + 10 * 60000).toISOString(),
          },
        });
        apiResponse(200, "Please check the email", {}, res);
      }
    }
  } catch (error) {
    console.log("error in the resend the otp", error);

    errorResponse(500, error, res);
  }
};
const resetPassword = async (req, res) => {
  try {
    const { otp, email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      apiResponse(401, "Not found", null, res);
    } else {
      console.log(otp, user.otp);

      if (otp !== user.otp) {
        apiResponse(401, "Invalid Otp", null, res);
      } else {
        console.log(
          "hash password -> done -> start transaction -> crate user -> craete ho gaya hai -> generate otp _> send email",
          otp
        );
        if (checkTimePassed(user.otpExpire) < 0) {
          return apiResponse(401, "Otp expire", null, res);
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await prisma.user.update({
            where: {
              email: email,
            },
            data: {
              password: hashedPassword,
              otpExpire: new Date().toISOString(),
            },
          });
          console.log(user.otpExpire, new Date().toISOString());

          apiResponse(200, "password udpate successfully", {}, res);
        }
      }
    }
  } catch (error) {
    console.log("error in the resend the otp", error);

    errorResponse(500, error, res);
  }
};
export {
  signup,
  signin,
  verifyUser,
  resendToken,
  forgetPassword,
  resetPassword,
};
