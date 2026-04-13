import User from "../models/user.js";
import jwt from "jsonwebtoken";

//  Protect routes (requires valid token)
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // password is select:false -> not returned
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Account disabled" });
    }

    req.user = user;
    return next();
  } catch (err) {
    console.error("token verification failed:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

//  Restrict by roles: authorize("admin") or authorize("agency","admin")
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: ${req.user.role} cannot access this route`,
      });
    }

    next();
  };
};