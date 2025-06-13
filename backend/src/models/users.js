import pool from "../config/db.js";

export const getUsers = async () => {
  const { rows } = await pool.query("SELECT * FROM users");
  return rows;
};

export const getUsersById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows.length ? rows[0] : null;
};

export const getUserByUsername = async (identifier) => {
  try {
    const trimmedIdentifier = identifier.trim();
    console.log("Searching for:", trimmedIdentifier);

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE name ILIKE $1 LIMIT 1",
      [trimmedIdentifier]
    );

    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("Error in getUserByUsername:", error);
    throw error;
  }
};

export const createUser = async (user) => {
  const {
    name = "",
    email = "",
    phone_number = "",
    hashed_password = "",
    image_path = "",
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
  const { rows: existingRows } = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  if (!existingRows.length) {
    return null;
  }

  const existingUser = existingRows[0];

  const updatedUser = {
    ...existingUser,
    ...user,
    image_path: user.image_path ? user.image_path : existingUser.image_path,
  };

  const { rows: updatedRows } = await pool.query(
    "UPDATE users SET name = $1, email = $2, phone_number = $3, hashed_password = $4, image_path = $5 WHERE id = $6 RETURNING *",
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
  const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return result.rowCount;
};

export const checkExistingUser = async (email, username) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1 OR username = $2",
    [email, username]
  );
  return rows.length ? rows[0] : null;
};
