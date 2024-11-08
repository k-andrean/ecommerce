import { getUserByUsername, getUsersById } from '../models/users.js';
import { comparePasswords } from '../utils/index.js'; // Function to compare passwords using bcrypt
import jwt from 'jsonwebtoken';

// Controller for login
export const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // 'identifier' could be username or email
    console.log('data', req.body);

    const user = await getUserByUsername(identifier);
    console.log('user', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password matches
    const isPasswordValid = await comparePasswords(password, user.hashed_password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.name }, // Payload data
      process.env.JWT_SECRET_KEY, // Secret key
      { expiresIn: '2d' } // Token expiration time
    );

    const expire = '2d'

    // Set the token as an HTTP-only cookie (to prevent JavaScript access)
    res.cookie('authToken', token, {
      httpOnly: true, // HTTP-only so it's not accessible by JavaScript
      secure: process.env.NODE_ENV === 'production', // Only use cookies over HTTPS in production
      sameSite: 'Strict', // To protect against CSRF attacks
      maxAge: 3600000, // 1 hour
    });


    res.status(200).json({ 
      message: 'Login successful', 
      token,
      expire, 
      userId: user.id, 
      username: user.name 
    });
  } catch (error) {
    next(error); // Forward error to error handling middleware
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