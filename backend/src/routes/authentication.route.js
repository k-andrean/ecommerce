import express from 'express';
import { loginUser, logoutUser } from '../controllers/auth.controller.js';

// Initialize the express Router
const authRoutes = express.Router();

// Define the routes
authRoutes.post('/login', loginUser);
authRoutes.get('/logout', logoutUser);


// Export the user routes
export default authRoutes;