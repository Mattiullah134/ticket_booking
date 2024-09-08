import crypto from "crypto";
const generateOtp = () => {
  const otp = crypto.randomInt(100000, 999999); // generates a 6-digit OTP
  return otp;
};
export { generateOtp };
