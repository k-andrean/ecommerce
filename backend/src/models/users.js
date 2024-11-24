import pool from "../config/db.js";


export const getUsers = async () => {
  const { rows } = await pool.query('SELECT * FROM users');
  return rows;
};

export const getUsersById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows.length ? rows[0] : null;
};

export const getUserByUsername = async (identifier) => {
  try {
    const trimmedIdentifier = identifier.trim();
    console.log('Searching for:', trimmedIdentifier); // Log the identifier being searched

    const { rows } = await pool.query(
      'SELECT * FROM users WHERE name ILIKE $1 LIMIT 1', 
      [trimmedIdentifier] // Using ILIKE for case-insensitive matching
    );

    console.log('Query result:', rows); // Log the result of the query

    return rows.length ? rows[0] : null; // Return the user if found
  } catch (error) {
    console.error('Error in getUserByUsername:', error); // Log the error
    throw error; // Rethrow the error to handle it in loginUser
  }
};

export const createUser = async (user) => {
    // Set default values for missing fields
    const {
      name = '',
      email = '',
      phone_number = '',
      hashed_password = '',
      image_path = '',
    } = user;
  
    const { rows } = await pool.query(
      `INSERT INTO users 
      (name, email, phone_number, hashed_password, image_path) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [name, email, phone_number, hashed_password, image_path]
    );
  
    return rows[0];
  };

  export const updateUser = async (id, user) => {
    // Step 1: Fetch the current product data by ID
    const { rows: existingRows } = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
  
    // If no product is found, return null
    if (!existingRows.length) {
      return null;
    }
  
    const existingUser = existingRows[0];
  
    // Step 2: Merge the existing product with the new data from the request body
    const updatedUser = {
      ...existingUser,
      ...user, // This will overwrite only the fields provided in the request body
      image_path: user.image_path ? user.image_path : existingUser.image_path,
    };
  
    // Step 3: Update the product in the database
    const { rows: updatedRows } = await pool.query(
      'UPDATE users SET name = $1, email = $2, phone_number = $3, hashed_password = $4, image_path = $5 WHERE id = $6 RETURNING *',
      [
        updatedUser.name,
        updatedUser.email,
        updatedUser.phone_number,
        updatedUser.hashed_password,
        updatedUser.image_path,
        id,
      ]
    );
  
    return updatedRows.length ? updatedRows[0] : null;
  };

export const deleteUser = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return result.rowCount;
};

export const checkExistingUser = async (email, username) => {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    return rows.length ? rows[0] : null;
  };
  