// middlewares/admin.js
import User from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
  try {
    // Assuming `req.user` is populated from the authentication middleware
    const userId = req.user._id;

    // Fetch the user from the database using the userId
    const user = await User.findById(userId).select("-password");

    // If the user doesn't exist or isn't an admin, deny access
    if (!user || !user.isAdmin) {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export { isAdmin };