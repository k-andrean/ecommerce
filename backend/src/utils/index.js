import { join } from "path";
import fs from "fs";
import bcrypt from "bcrypt";

export const loadProductsFromFile = (dirpath, filename) => {
  const filePath = join(dirpath, `${filename}.json`);

  if (fs.existsSync(filePath)) {
    const productsData = fs.readFileSync(filePath);
    return JSON.parse(productsData);
  } else {
    throw new Error("Product file not found");
  }
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};
