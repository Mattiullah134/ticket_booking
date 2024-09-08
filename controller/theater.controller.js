import prisma from "../utils/dbClient";
import { apiResponse, errorResponse } from "../utils/response";
import bcrypt from "bcryptjs";
const theaterRegister = async (req, res) => {
  try {
    const { email, address, city, state, pincode, name, phone, password } =
      req.body;
    const theater = await prisma.theater.findUnique({
      where: {
        email: email,
      },
    });
    if (theater) {
      apiResponse(401, "already exists", null, res);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const theater = await prisma.theater.create({
        data: {
          email: email,
          address: address,
          city: city,
          state: state,
          pincode: pincode,
          name: name,
          phone: phone,
          password: hashedPassword,
        },
      });
      apiResponse(200, "Theater created successfully", theater, res);
    }
  } catch (error) {
    errorResponse(500, error, res);
  }
};
const theaterSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.theater.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      apiResponse(401, "Invalid credientials", null, res);
    } else {
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (!verifyPassword) {
        apiResponse(404, "Invalid credientials", user, res);
      } else {
        const data = {
          user,
          api_token: encodeToken({ id: user.id, email: user.email }),
        };
        apiResponse(200, "User found successfully", data, res);
      }
    }
  } catch (error) {
    errorResponse(500, error, res);
  }
};
const createService = async (req, res) => {
  try {
    const { movie, cast, showTimings } = req.body;
    let newMovie = await prisma.movie.create({
      data: {
        ...movie,
      },
    });

    const newCast = await prisma.cast.createMany({
      data: cast.map((d) => ({
        name: d.name,
        movie: {
          connect: {
            id: newMovie.id,
          },
        },
      })),
    });
  } catch (error) {
    errorResponse(500, error, res);
  }
};
