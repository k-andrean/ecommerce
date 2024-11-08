import { join } from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';

// Load products from the specified file
export const loadProductsFromFile = (dirpath, filename) => {
  // Construct the path to the JSON file
  const filePath = join(dirpath, `${filename}.json`);
  
  // Check if the file exists and load the content
  if (fs.existsSync(filePath)) {
    const productsData = fs.readFileSync(filePath);
    return JSON.parse(productsData);
  } else {
    throw new Error('Product file not found');
  }
};


export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};