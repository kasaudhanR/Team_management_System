import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // ✅ 2. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // ✅ 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 4. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // ✅ 5. Remove password from response
    const { password: _, ...userData } = user._doc;

    // ✅ 6. Send response
    res.status(201).json({
      msg: "User registered successfully",
      user: userData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // ✅ 2. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" }); // generic message for security
    }

    // ✅ 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ✅ 4. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ 5. Remove password from response
    const { password: _, ...userData } = user._doc;

    // ✅ 6. Send response
    res.status(200).json({
      msg: "Login successful",
      token,
      user: userData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};