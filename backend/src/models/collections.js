import pool from "../config/db.js";


export const getCollections = async () => {
  const { rows } = await pool.query('SELECT * FROM collections');
  return rows;
};

export const getCollectionById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM collections WHERE id = $1', [id]);
  return rows.length ? rows[0] : null;
};

export const createCollection = async (collection) => {
    // Set default values for missing fields
    const {
      name = '',
      description = '',
      image_path = ''
    } = collection;
  
    const { rows } = await pool.query(
      `INSERT INTO collections 
      (name, description, image_path) 
      VALUES ($1, $2, $3) 
      RETURNING *`,
      [name, description, image_path]
    );
  
    return rows[0];
  };

  export const updateCollection = async (id, collection) => {
    // Step 1: Fetch the current product data by ID
    const { rows: existingRows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  
    // If no product is found, return null
    if (!existingRows.length) {
      return null;
    }
  
    const existingCollection = existingRows[0];
  
    // Step 2: Merge the existing product with the new data from the request body
    const updatedCollection = {
      ...existingCollection,
      ...collection, // This will overwrite only the fields provided in the request body
      image_path: collection.image_path ? collection.image_path : existingCollection.image_path,
    };
  
    // Step 3: Update the product in the database
    const { rows: updatedRows } = await pool.query(
      'UPDATE collections SET name = $1, description = $2, image_path = $3 WHERE id = $4 RETURNING *',
      [
        updatedCollection.name,
        updatedCollection.description,
        updatedCollection.image_path,
        id,
      ]
    );
  
    return updatedRows.length ? updatedRows[0] : null;
  };

export const deleteCollection = async (id) => {
  await pool.query('DELETE FROM collections WHERE id = $1', [id]);
};