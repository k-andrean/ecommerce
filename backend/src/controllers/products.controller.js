import { getProducts, getProductById, getProductByCategoryId, createProduct, createBulkProducts, updateProduct, deleteProduct } from '../models/products.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await getProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await getProductById(parseInt(req.params.id));
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const getProductByCategory = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.categoryId); // Parse the categoryId from request params
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const product = await getProductByCategoryId(categoryId); // Call the query with categoryId
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found for the given category ID' });
    }
  } catch (error) {
    next(error); 
  }
};

export const createNewProduct = async (req, res, next) => {
    try {
      const product = req.body;
      const newProduct = await createProduct(product);
  
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  };

export const createNewMultiProduct = async (req, res, next) => {
    try {
      const products = req.body;  // Get the products from the request body
  
      // Call the model function to create bulk products
      const newMultiProduct = await createBulkProducts(products);
  
      // Send a successful response with the newly created products
      res.status(201).json(newMultiProduct);
    } catch (error) {
      // Handle errors and pass them to the Express error handler
      console.error('Error creating bulk products:', error);
      res.status(500).json({ error: error.message });
    }
  };

  export const createMultiProducts = async (req, res, next) => {
    try {
        const dataProducts = req.body; // Expecting an array of collection data
        const createdProducts = []; // To store successfully created collections

        for (const data of dataProducts) {
            const newProduct = await createProduct(data);
            createdProducts.push(newProduct); // Add each new collection to the array
        }

        res.status(201).json(createdProducts); // Return all created collections
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};

    

  export const updateExistingProduct = async (req, res, next) => {
    try {
      const image = req.file; // Get image from uploaded files (if any)
      const dataProduct = {
        ...req.body,
        image_path: image ? image.path : null  // Use image path if uploaded, else null
    };
  
      const updatedProduct = await updateProduct(parseInt(dataProduct.id), dataProduct);
  
      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      next(error);
    }
  };

  export const updateMultiProducts = async (products) => {
    for (const product of products) {
      try {
        const updatedProduct = await updateProduct(product.id, product);
        console.log(`Updated product with ID ${product.id}:`, updatedProduct);
      } catch (error) {
        console.error(`Failed to update product with ID ${product.id}:`, error);
      }
    }
  };

export const removeProduct = async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
  
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
  
      const deletedProduct = await deleteProduct(productId);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(204).end(); // No content for successful deletion
    } catch (error) {
      next(error);
    }
  };