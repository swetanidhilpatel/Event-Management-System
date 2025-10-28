import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const auth = async (req, res, next) => {
  try {
    const header = req.get("Authorization");

    if (!header) {
      return res.status(401).json({
        message: "Token is required",
      });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token is required",
      });
    }

    const userPayload = await jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    if (!userPayload) {
      return res.status(403).json({
        message: "Invalid credentials",
      });
    }


    const { userId } = userPayload;

    const user = await User.findOne({
      _id: userId,
    }).select("-password");


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(404).json({
      message: error.message || "wrong credentials",
    });
  }
};

export { auth };
