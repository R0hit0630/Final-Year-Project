import jwt from "jsonwebtoken";

// [FLOW FEATURE: AUTH - TOKEN GENERATION]
// Signs a JWT containing the user's MongoDB _id, valid for 30 days
// The secret is read from the environment variable JWT_SECRET to keep it out of source code
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};