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
import { fetchCitiesFromApi } from "./src/models/cities.js";

import { notFound, errorHandler } from "./src/middlewares/error.middleware.js";

import Stripe from 'stripe';

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

// for upload image route
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

// for stripe payment purpose
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body; // Get amount and currency from frontend
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, 
      currency,
    });


    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: error.message });
  }
});


// for credit card payment purpose
app.post('/processPayment', (req, res) => {
  const { cardNumber, nameOnCard, expirationDate, cvc } = req.body;
  // Basic validation (you can expand this)
  if (!cardNumber || !nameOnCard || !expirationDate || !cvc) {
      return res.status(400).json({ status: 'failed', message: 'Missing required payment information' });
  }

  // Simulate payment processing logic here (e.g., call to payment gateway)
  // For demonstration purposes, we will assume the payment is always successful
  const paymentResponse = {
      status: 'success',
      paymentDate: new Date().toISOString(),
      paymentCode: Math.random().toString(36).substr(2, 9) // Random payment code
  };

  // Send back the response
  return res.status(200).json(paymentResponse);
});

// Route to fetch and insert cities from the API
app.post("/import-cities", async (req, res) => {
  try {
    await fetchCitiesFromApi();
    res.status(200).json({ message: "Cities imported successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to import cities." });
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

export default app;