import express from 'express';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth.js';
const router = express.Router();


//register
router.post("/register", async (req, res) => {
  const { username, email, nationality, password, role } = req.body;

  try {
    if (!username || !email || !nationality || !password) {
      return res.status(400).json({ message: "please fill all the field" });
    }

    // ✅ Proper duplicate check (email OR username)
    const userExist = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExist) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const user = await User.create({
      username,
      email,
      nationality,
      password,
      role: role === "agency" ? "agency" : "user",
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    // ✅ Duplicate key error from Mongo indexes
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    // ✅ Validation error
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message || "server error" });
  }
});


//login
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({ message: "please fill all the field" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "server error" });
  }
});


//me
router.get("/me",protect, async (req, res)=>{
    res.status(200).json(req.user);
});

//Generate JWT
const generateToken =(id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: "30d"})
}

router.get("/debug/find/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).select("username email role createdAt");
  res.json({ found: !!user, user });
});


export default router;