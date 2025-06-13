import pool from "../config/db.js";

export const getOrders = async () => {
  const { rows } = await pool.query(
    "SELECT id, user_id, order_date, shipping_info, order_status, payment_info, products, total_amount::numeric AS total_amount, created_at, updated_at FROM orders"
  );
  return rows;
};

export const getOrderById = async (userId, orderId) => {
  const { rows } = await pool.query(
    "SELECT id, user_id, order_date, shipping_info, order_status, payment_info, products, total_amount::numeric AS total_amount, created_at, updated_at FROM orders WHERE id = $1 AND user_id = $2",
    [orderId, userId]
  );
  return rows.length ? rows[0] : null;
};

export const getOrderByUserId = async (userId) => {
  const { rows } = await pool.query(
    "SELECT id, user_id, order_date, shipping_info, order_status, payment_info, products, total_amount::numeric AS total_amount, created_at, updated_at FROM orders WHERE user_id = $1",
    [userId]
  );
  return rows;
};

export const createOrder = async (order) => {
  const {
    user_id = "",
    order_date = "",
    shipping_info = "",
    order_status = false,
    payment_info = {},
    products = {},
    total_amount = 0,
  } = order;

  const { rows } = await pool.query(
    `INSERT INTO orders 
      (user_id, order_date, shipping_info, order_status, payment_info, products, total_amount) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
    [
      user_id,
      order_date,
      shipping_info,
      order_status,
      payment_info,
      products,
      total_amount,
    ]
  );

  return rows[0];
};

export const updateOrder = async (id, order) => {
  // Step 1: Fetch the current product data by ID
  const { rows: existingRows } = await pool.query(
    "SELECT * FROM orders WHERE id = $1",
    [id]
  );

  if (!existingRows.length) {
    return null;
  }

  const existingOrder = existingRows[0];
  console.log(existingOrder);

  const updatedOrder = {
    ...existingOrder,
    ...order,
  };

  const { rows: updatedRows } = await pool.query(
    "UPDATE orders SET user_id = $1, order_date = $2, shipping_info = $3, order_status = $4, payment_info = $5, products = $6, total_amount = $7 WHERE id = $8 RETURNING *",
    [
      updatedOrder.user_id,
      updatedOrder.order_date,
      updatedOrder.shipping_info
        ? JSON.stringify(updatedOrder.shipping_info)
        : existingOrder.shipping_info, // Ensure it's valid JSON
      updatedOrder.order_status,
      updatedOrder.payment_info
        ? JSON.stringify(updatedOrder.payment_info)
        : existingOrder.payment_info, // Ensure it's valid JSON
      updatedOrder.products
        ? JSON.stringify(updatedOrder.products)
        : existingOrder.products, // Ensure it's valid JSON
      updatedOrder.total_amount,
      id,
    ]
  );

  return updatedRows.length ? updatedRows[0] : null;
};

export const deleteOrder = async (id) => {
  const result = await pool.query("DELETE FROM orders WHERE id = $1", [id]);
  return result.rowCount;
};
