import { getUserByUsername, getUsersById } from "../models/users.js";
import { comparePasswords } from "../utils/index.js";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    console.log("data", req.body);

    const user = await getUserByUsername(identifier);
    console.log("user", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches
    const isPasswordValid = await comparePasswords(
      password,
      user.hashed_password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.name },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" }
    );

    const expire = "2d";

    // Set the token as an HTTP-only cookie (to prevent JavaScript access)
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      expire,
      userId: user.id,
      username: user.name,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res, next) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};
