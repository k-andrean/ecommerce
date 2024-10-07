import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Import multer setup
import upload from "./src/services/multer.js"; // Update the path to your multer setup
import routes from "./src/routes/index.js"; 
import { loadProductsFromFile } from "./src/utils/index.js";

import { notFound, errorHandler } from "./src/middlewares/error.middleware.js";

dotenv.config();

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// Connect to MongoDB (if required)
// ConnectDB();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use(cors(corsOptions));


const { dirname, join } = path;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, 'src', 'config', 'data');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define the `/upload-images` route
app.post('/upload-images', upload.array('images', 5), (req, res) => {
  const files = req.files;
  const productType = req.body.productType || 'tables'; // Default to 'tables.json' if no type is provided
  
  try {
      // Dynamically load products from the specified JSON file
      let products = loadProductsFromFile(filePath, productType);

      // Check if the number of uploaded files matches the number of products
      if (files.length === products.length) {
          products = products.map((product, index) => {
              product.image_path = files[index].path; // Assign image path to the corresponding product
              return product;
          });

          fs.writeFileSync(path.join(filePath, `${productType}.json`), JSON.stringify(products, null, 2));

          // Send the updated products as response
          res.json({ message: "Images uploaded successfully", products });
      } else {
          res.status(400).json({ error: "Mismatch between number of images and products" });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Use existing routes
app.use("/", routes);

// Handle 404 Not Found
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});