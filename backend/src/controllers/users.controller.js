import { getUsers, getUsersById, createUser, updateUser, deleteUser } from '../models/users.js';
import { hashPassword } from '../utils/index.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await getUsersById(parseInt(req.params.id));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const createNewUser = async (req, res, next) => {
  try {
    // Assuming 'image' is the key used for file uploads
    const image = req.file;
    const { phone, ...restOfBody } = req.body;
    const dataUser = {
      ...restOfBody,
      image_path: image ? image.path : null,
      phone_number: phone ? phone : null,
    };

    // Hash the password here before passing to createUser (e.g., with bcryptjs or argon2)
    dataUser.hashed_password = await hashPassword(dataUser.password); // Assuming password is passed in req.body

    const newUser = await createUser(dataUser);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const updateExistingUser = async (req, res, next) => {
  try {
    const image = req.file; // Get the uploaded image file (if any)
    const dataUser = {
      ...req.body,
      image_path: image ? image.path : req.body.image_path || null, // Update image path if new file is uploaded
    };

    const updatedUser = await updateUser(parseInt(req.params.id), dataUser);

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const removeUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const deletedUserCount = await deleteUser(userId);

    if (deletedUserCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).end(); // No content for successful deletion
  } catch (error) {
    next(error);
  }
};