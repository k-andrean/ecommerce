import pool from "../config/db.js";

export const getAllProductsList = async () => {
  const { rows } = await pool.query("SELECT * FROM products");
  return rows;
};

export const getProductById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [
    id,
  ]);
  return rows.length ? rows[0] : null;
};

export const getProductByCategoryId = async (categoryId) => {
  const { rows } = await pool.query(
    "SELECT * FROM products WHERE category_id = $1",
    [categoryId]
  );
  return rows;
};

export const getProductByCollectionId = async (collectionId) => {
  const { rows } = await pool.query(
    `SELECT products.*, collections.description AS collection_description
     FROM products
     JOIN collections ON products.collection_id = collections.id
     WHERE collections.id = $1`,
    [collectionId]
  );
  return rows;
};

export const createProduct = async (product) => {
  // Set default values for missing fields
  const {
    name = "",
    price = 0,
    collection_id = 0,
    category_id = 0,
    size = "",
    color = "",
    description = "",
    details = [],
    rating = 0,
    image_path = "",
    quantity = 0,
  } = product;

  const { rows } = await pool.query(
    `INSERT INTO products 
      (name, price, collection_id, category_id, size, color, description, details, rating, image_path, quantity) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
    [
      name,
      price,
      collection_id,
      category_id,
      size,
      color,
      description,
      details,
      rating,
      image_path,
      quantity,
    ]
  );

  return rows[0];
};

export const createBulkProducts = async (products) => {
  // Check if the products parameter is an array
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("No products found in the request");
  }

  const insertedProducts = [];

  for (let product of products) {
    const {
      name = "",
      price = 0,
      collectionId = 0,
      categoryId = 0,
      size = "",
      color = "",
      description = "",
      details = [],
      rating = 0,
      image_path = "",
      quantity = 0,
    } = product;

    const formattedDetails = `{${details.join(",")}}`;

    const values = [
      name,
      price,
      collectionId,
      categoryId,
      size,
      color,
      description,
      formattedDetails,
      rating,
      image_path,
      quantity,
    ];

    const { rows } = await pool.query(
      `INSERT INTO products 
        (name, price, collection_id, category_id, size, color, description, details, rating, image_path, quantity) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *`,
      values
    );

    insertedProducts.push(rows[0]);
  }

  return insertedProducts;
};

export const updateProduct = async (id, product) => {
  const { rows: existingRows } = await pool.query(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );

  if (!existingRows.length) {
    return null;
  }

  const existingProduct = existingRows[0];

  const updatedProduct = {
    ...existingProduct,
    ...product,
    image_path: product.image_path
      ? product.image_path
      : existingProduct.image_path,
  };

  const { rows: updatedRows } = await pool.query(
    "UPDATE products SET name = $1, price = $2, collection_id = $3, category_id = $4, size = $5, color = $6, description = $7, details = $8, rating = $9, image_path = $10, quantity = $11 WHERE id = $12 RETURNING *",
    [
      updatedProduct.name,
      updatedProduct.price,
      updatedProduct.collection_id,
      updatedProduct.category_id,
      updatedProduct.size,
      updatedProduct.color,
      updatedProduct.description,
      updatedProduct.details,
      updatedProduct.rating,
      updatedProduct.image_path,
      updatedProduct.quantity,
      id,
    ]
  );

  return updatedRows.length ? updatedRows[0] : null;
};

export const deleteProduct = async (id) => {
  const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return result.rowCount;
};

export const deleteAllProducts = async () => {
  await pool.query("DELETE FROM products");
};

export const searchProductByName = async (name) => {
  console.log("name", name);
  const { rows } = await pool.query(
    `SELECT * FROM products WHERE name ILIKE $1`,
    [`%${name}%`]
  );
  return rows;
};
