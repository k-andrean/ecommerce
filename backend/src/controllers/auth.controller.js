import jwt from 'jsonwebtoken';
import { getUsersById, createUser, checkExistingUser } from '../models/users.js';
import bcrypt from 'bcrypt'; 

export const registerUser = async (req, res, next) => {
    try {
      const { name, email, username, password, phone_number } = req.body; // Include phone_number
  
      // Check if the user already exists by email or username
      const existingUser = await checkExistingUser(email, username);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email or username already exists' });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the new user
      const newUser = await createUser({
        ...req.body,
        password: hashedPassword,  // Use the hashed password
        phone_number: phone_number || null, // Make phone_number nullable if not provided
      });
  
      // Generate a JWT token and set it as a cookie
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, username: newUser.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );
  
      res.cookie('token', token, { httpOnly: true });
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      next(error);
    }
  };

  export const loginUser = async (req, res, next) => {
    try {
      const { username, password } = req.body;
  
      // Check if user exists by username
      const user = await checkExistingUser(null, username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT token and set it as a cookie
      const token = jwt.sign(
        { userId: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );
  
      res.cookie('token', token, { httpOnly: true });
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      next(error);
    }
  };
  
  // Logout a user (clear the cookie)
  export const logoutUser = (req, res, next) => {
    try {
      // Clear the token cookie
      res.clearCookie('token');
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  };