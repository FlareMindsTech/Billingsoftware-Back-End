import jwt from "jsonwebtoken";
import UserSchema from "../models/User.js";

// Middleware for owner-only access
export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT);
      req.user = await UserSchema.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (req.user.role.toLowerCase() !== "owner") {
        return res.status(403).json({ message: "Access denied: Owners only" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalid or expired" });
    }
  } else {
    return res.status(401).json({ message: "Authorization token required" });
  }
};

// Middleware for both admin and owner
export const Auth = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT);
      req.user = await UserSchema.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalid or expired" });
    }
  } else {
    return res.status(401).json({ message: "Authorization token required" });
  }
};
