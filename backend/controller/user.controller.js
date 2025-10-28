import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  signinValidationSchema,
  userValidationSchema,
} from "../utils/userValidator.js";

const signupHandler = async (req, res) => {
  try {
    const body = req.body;

    if (!body) {
      return res.status(401).json({
        message: "Invalid request",
      });
    }

    const validatorSchema = userValidationSchema.safeParse(body);

    const { success, error } = validatorSchema;

    if (!success) {
      return res.status(401).json({
        message: error.issues[0].message || "Parse the all request fields",
      });
    }

    const {
      firstname,
      lastname,
      email,
      mobilenumber,
      skypeID,
      password,
      
    } = validatorSchema.data;

    //   If user already exists then login

    const userExist = await User.findOne({
      email,
      mobilenumber,
    });

    if (userExist) {
      return res.status(200).json({
        message: "User already exists",
      });
    }

    console.log("control reached here : 2\n");

    const user = await User.create({
      firstname,
      lastname,
      email,
      mobilenumber,
      skypeID,
      password,
    });

    console.log("control reached here : 3\n");

    if (!user) {
      return res.status(401).json({
        message: "User creation failed",
      });
    }

    console.log("control reached here : 4\n");

    return res.status(200).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "User creation failed",
    });
  }
};

const loginHandler = async (req, res) => {
  // Email and password are required

  const signinValidator = signinValidationSchema.safeParse(req.body);

  const { success } = signinValidator;

  if (!success) {
    return res.status(401).json({
      message: "Parse all required fields",
    });
  }

  const { username, password } = signinValidator.data;

  if (!username || !password) {
    return res.status(403).json({
      message: "email or password is required",
    });
  }

  const user = await User.findOne({
    $or: [
      {
        email: username,
      },
      {
        mobilenumber: username,
      },
    ],
  });

  if (!user) {
    return res.status(403).json({
      message: "user not found",
    });
  }

  //   Now checked the password

  if (!(user && (await user.matchPassword(password)))) {
    return res.status(403).json({
      message: "Invalid password",
    });
  }

  const token = await jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET
  );


  if (!token) {
    return res.status(401).json({ message: "Token creation failed" });
  }

  return res.status(200).json({
    message: "User find successfully",
    token,
  });
};

const meHandler = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "first signup or signin" });
  }

  return res.status(200).json({
    status: true,
    user,
  });
};

const getAllUsers = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "User is not logged in",
      });
    }

    // const allUsers = await User.find({
    //   isAdmin: false,
    // });

    if (!allUsers) {
      return res.status(401).json({
        message: "Cant get all users from the database",
      });
    }

    return res.status(200).json({
      message: "All users gettes successfully",
      allUsers,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Intrenal server error",
    });
  }
};

export { signupHandler, loginHandler, meHandler, getAllUsers };
