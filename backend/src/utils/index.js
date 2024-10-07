import { join } from 'path';
import fs from 'fs';



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
