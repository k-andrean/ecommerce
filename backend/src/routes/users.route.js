import express from "express";
import {
  getAllUsers,
  getUser,
  createNewUser,
  updateExistingUser,
  removeUser,
} from "../controllers/users.controller.js";
import multer from "multer";

const usersRoutes = express.Router();

const uploadUser = multer({ dest: "uploads/users/" }); // Specify the directory for uploads

usersRoutes.get("/", getAllUsers);
usersRoutes.get("/:id", getUser);
usersRoutes.post("/", uploadUser.single("userImage"), createNewUser); // Use multer middleware for image upload
usersRoutes.put("/:id", uploadUser.single("userImage"), updateExistingUser); // Use multer middleware for image upload
usersRoutes.delete("/:id", removeUser);

export default usersRoutes;
