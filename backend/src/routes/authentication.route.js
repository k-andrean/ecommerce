import express from "express";
import { loginUser, logoutUser } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/login", loginUser);
authRoutes.get("/logout", logoutUser);

export default authRoutes;
