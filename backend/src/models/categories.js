import pool from "../config/db.js";


export const getCategories = async () => {
  const { rows } = await pool.query('SELECT * FROM categories');
  return rows;
};

export const getCategoryById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  return rows.length ? rows[0] : null;
};

export const createCategory = async (category) => {
    // Set default values for missing fields
    const {
      name = '',
      description = '',
      image_path = '',
    } = category;
  
    const { rows } = await pool.query(
      `INSERT INTO categories 
      (name, description, image_path) 
      VALUES ($1, $2, $3) 
      RETURNING *`,
      [name, description, image_path]
    );
  
    return rows[0];
  };

  export const updateCategory = async (id, category) => {
    // Step 1: Fetch the current product data by ID
    console.log('id received', id);
    const { rows: existingRows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  
    // If no product is found, return null
    if (!existingRows.length) {
      return null;
    }
  
    const existingCategory = existingRows[0];
  
    // Step 2: Merge the existing product with the new data from the request body
    const updatedCategory = {
      ...existingCategory,
      ...category, // This will overwrite only the fields provided in the request body
      image_path: category.image_path ? category.image_path : existingCategory.image_path,
    };
  
    // Step 3: Update the product in the database
    const { rows: updatedRows } = await pool.query(
      'UPDATE categories SET name = $1, description = $2, image_path = $3 WHERE id = $4 RETURNING *',
      [
        updatedCategory.name,
        updatedCategory.description,
        updatedCategory.image_path,
        id,
      ]
    );
  
    return updatedRows.length ? updatedRows[0] : null;
  };

export const deleteCategory = async (id) => {
  await pool.query('DELETE FROM categories WHERE id = $1', [id]);
};