import {
  getAllProductsList,
  getProductById,
  getProductByCategoryId,
  getProductByCollectionId,
  createProduct,
  createBulkProducts,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  searchProductByName,
} from "../models/products.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await getAllProductsList();
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
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const getProductByCategory = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const product = await getProductByCategoryId(categoryId);
    if (product) {
      res.status(200).json(product);
    } else {
      res
        .status(404)
        .json({ message: "Product not found for the given category ID" });
    }
  } catch (error) {
    next(error);
  }
};

export const getProductByCollection = async (req, res, next) => {
  try {
    const collectionId = parseInt(req.params.collectionId);
    if (isNaN(collectionId)) {
      return res.status(400).json({ message: "Invalid collection ID" });
    }

    const product = await getProductByCollectionId(collectionId);
    if (product) {
      res.status(200).json(product);
    } else {
      res
        .status(404)
        .json({ message: "Product not found for the given collection ID" });
    }
  } catch (error) {
    next(error);
  }
};

export const createNewProduct = async (req, res, next) => {
  try {
    const image = req.file;
    const product = req.body;

    if (image) {
      product.image_path = image.path;
    }
    const newProduct = await createProduct(product);

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const createNewMultiProduct = async (req, res, next) => {
  try {
    const products = req.body;

    const newMultiProduct = await createBulkProducts(products);

    res.status(201).json(newMultiProduct);
  } catch (error) {
    console.error("Error creating bulk products:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createMultiProducts = async (req, res, next) => {
  try {
    const dataProducts = req.body;
    const createdProducts = [];

    for (const data of dataProducts) {
      const newProduct = await createProduct(data);
      createdProducts.push(newProduct);
    }

    res.status(201).json(createdProducts);
  } catch (error) {
    next(error);
  }
};

export const updateExistingProduct = async (req, res, next) => {
  try {
    const image = req.file; // Get image from uploaded files (if any)
    const dataProduct = { ...req.body };
    const { id: productId } = req.params;
    // console.log('data product', productId)
    // Only add `image_path` to `dataProduct` if an image was uploaded
    if (image) {
      dataProduct.image_path = image.path;
    }

    const updatedProduct = await updateProduct(Number(productId), dataProduct);

    console.log("Updating product with data:", dataProduct);

    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
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

    const deletedProductCount = await deleteProduct(productId);

    if (deletedProductCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(204).end(); // No content for successful deletion
  } catch (error) {
    next(error);
  }
};

export const removeAllProducts = async (req, res, next) => {
  try {
    await deleteAllProducts();
    res.status(204).end(); // No content for successful deletion
  } catch (error) {
    next(error);
  }
};

export const searchProductByNameController = async (req, res, next) => {
  try {
    const { name } = req.query; // Get the search term from query parameters
    console.log("name", name);
    if (!name) {
      return res.status(400).json({ message: "Search term is required" });
    }

    // Call the model function to search products
    const products = await searchProductByName(name);

    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: "No products found" });
    }
  } catch (error) {
    next(error);
  }
};
