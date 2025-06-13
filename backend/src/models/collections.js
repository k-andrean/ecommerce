import pool from "../config/db.js";

export const getCollections = async () => {
  const { rows } = await pool.query("SELECT * FROM collections");
  return rows;
};

export const getCollectionById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM collections WHERE id = $1", [
    id,
  ]);
  return rows.length ? rows[0] : null;
};

export const createCollection = async (collection) => {
  const { name = "", description = "", image_path = "" } = collection;

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
  const { rows: existingRows } = await pool.query(
    "SELECT * FROM collections WHERE id = $1",
    [id]
  );

  if (!existingRows.length) {
    return null;
  }

  const existingCollection = existingRows[0];

  const updatedCollection = {
    ...existingCollection,
    ...collection,
    image_path: collection.image_path
      ? collection.image_path
      : existingCollection.image_path,
  };

  const { rows: updatedRows } = await pool.query(
    "UPDATE collections SET name = $1, description = $2, image_path = $3 WHERE id = $4 RETURNING *",
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
  const result = await pool.query("DELETE FROM collections WHERE id = $1", [
    id,
  ]);
  return result.rowCount;
};
